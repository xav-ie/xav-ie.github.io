// Renders one section of choropleth maps from its data.json.
//
// The 2021 site shipped each map as a Plotly .div — an HTML fragment with an
// embedded <script> that authored its own figure. That format is why the old
// page needed a script re-executor, a Plotly.newPlot monkey-patch to correct the
// per-figure layout, and a double-buffered host to swap fragments. Holding the
// data ourselves means we author the layout once, and all of that goes away.

/**
 * The only trace shape these pages draw. Narrow on purpose: `type` being a
 * literal means a slip back to 'choroplethmapbox' — which put the figure on a
 * mapbox subplot and spun up a WebGL context per swap, the cause of the
 * flashing — is a compile error rather than a runtime regression.
 *
 * The layout side has no such guard: `typeof LAYOUT` is inferred from LAYOUT,
 * so adding a mapbox subplot there would change the constant and its type
 * together and compile clean. Read the constant, don't trust the types for it.
 */
type ChoroplethTrace = {
  type: 'choropleth';
  geo: 'geo';
  geojson: ChoroplethData['geojson'];
  locations: ChoroplethMap['locations'];
  z: ChoroplethMap['z'];
  coloraxis: 'coloraxis';
  marker: { opacity: number };
  hovertemplate: string;
};

// Loaded from the CDN by a separate is:inline script tag on each page, so it is
// a global here rather than an import. Only newPlot is used.
declare const Plotly: {
  newPlot: (
    graphDiv: HTMLElement,
    data: ChoroplethTrace[],
    layout: typeof LAYOUT,
    config: { responsive: boolean },
  ) => Promise<unknown>;
};

/** One map: the values for a single job type or ACS category. */
type ChoroplethMap = {
  /** Stable key, also the DPW button label — e.g. "Water-Leak". */
  id: string;
  /** Human-readable name, shown as the heading above the map. */
  title: string;
  /** Census feature ids. Must resolve against the section's geojson. */
  locations: (string | number)[];
  /** Counts, one per location. */
  z: number[];
};

/** A section's data.json: the geometry once, plus every map drawn on it. */
type ChoroplethData = {
  /** The geojson property the locations key off — "NAME10" or "index". */
  locationLabel: string;
  geojson: { features: { id: string | number }[] };
  maps: ChoroplethMap[];
};

type ChoroplethOptions = {
  /** Accessible name for the map picker. */
  legend: string;
  /**
   * DPW only: splits 183 maps into departments by a prefix on the id, adding a
   * second picker above the first.
   */
  groupBy?: (id: string) => string;
  /** Accessible name for the group picker. Required alongside groupBy. */
  groupLegend?: string;
  /** Button label for a map. Defaults to its id. */
  label?: (map: ChoroplethMap) => string;
};

// Pinned so every figure gets identical geometry. Plotly otherwise sizes the
// colorbar gutter to its contents — the tick labels vary from "0.2" to "1500" —
// which resized the plot area and made the map jump on every selection.
// autoexpand:false is what stops it re-expanding to fit.
const GUTTER = 110;

const LAYOUT = {
  height: 550,
  margin: { t: 0, r: GUTTER, b: 0, l: 0, autoexpand: false },
  // No basemap. These render as plain SVG on a geo subplot; the mapbox subplot
  // the DPW figures originally used spun up a WebGL context per swap, which is
  // what made that page flash.
  geo: {
    fitbounds: 'locations',
    visible: false,
    projection: { type: 'mercator' },
  },
  coloraxis: {
    // Plasma, as the 2021 figures used.
    colorscale: [
      [0, '#0d0887'],
      [0.111, '#46039f'],
      [0.222, '#7201a8'],
      [0.333, '#9c179e'],
      [0.444, '#bd3786'],
      [0.556, '#d8576b'],
      [0.667, '#ed7953'],
      [0.778, '#fb9f3a'],
      [0.889, '#fdca26'],
      [1, '#f0f921'],
    ],
    // No title in the bar: its width would vary with the text and shift the map.
    // The page renders it as a heading instead.
    colorbar: {
      title: { text: '' },
      x: 1,
      xanchor: 'left',
      xpad: 10,
      thickness: 18,
    },
  },
} as const;

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`missing ${selector}`);
  return element;
}

// fieldset, not form: nothing to submit, and inside a <form> pressing Enter on a
// radio triggers implicit submission and reloads the page. The legend is the
// group's accessible name.
function radioGroup(id: string, legendText: string): HTMLFieldSetElement {
  const group = document.createElement('fieldset');
  group.id = id;
  const legend = document.createElement('legend');
  legend.className = 'sr-only';
  legend.textContent = legendText;
  group.append(legend);
  return group;
}

// Attached once per group, never inside fill(): fill() runs again on every
// department pick, and re-attaching there stacked a fresh listener each time —
// after eight departments a single job-type click fired eight full re-renders,
// silently.
function wire(
  group: HTMLFieldSetElement,
  onPick: (value: string) => void,
): void {
  group.addEventListener('change', () => {
    onPick(required<HTMLInputElement>(`#${group.id} input:checked`).value);
  });
}

function fill(
  group: HTMLFieldSetElement,
  name: string,
  entries: { value: string; label: string }[],
): void {
  // replaceChildren keeps the legend, which is the accessible name.
  group.replaceChildren(required<HTMLLegendElement>(`#${group.id} legend`));

  for (const entry of entries) {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = `${name}-${entry.value}`;
    radio.name = name;
    radio.value = entry.value;

    const label = document.createElement('label');
    label.htmlFor = radio.id;
    // textContent, not innerHTML: names like "DR-Clvrt&TrashRackClean" only
    // survive entity parsing by luck.
    label.textContent = entry.label;

    group.append(radio, label);
  }

  // querySelector, not children[0] — that is the legend. The click fires the
  // group's change listener, which renders the first entry.
  required<HTMLInputElement>(`#${group.id} input`).click();
}

export async function renderChoropleths(
  options: ChoroplethOptions,
): Promise<void> {
  const response = await fetch('./data.json');
  if (!response.ok) {
    throw new Error(`failed to load data.json: ${response.status}`);
  }
  const { locationLabel, geojson, maps } =
    (await response.json()) as ChoroplethData;

  const byId = new Map(maps.map((map) => [map.id, map]));
  const title = required<HTMLElement>('#mapTitle');
  const host = required<HTMLElement>('#mapHost');
  const controls = required<HTMLElement>('#controls');

  // Plotly emits an unlabelled SVG and puts the numbers behind hover only, so
  // the values are unreachable without a pointer. The same numbers as a table,
  // visually hidden.
  const table = document.createElement('table');
  table.className = 'sr-only';
  host.after(table);

  function cell(tag: 'th' | 'td', text: string, scope?: string): HTMLElement {
    const element = document.createElement(tag);
    // textContent for the same reason as the button labels: titles like
    // "DR-Clvrt&TrashRackClean" don't survive entity parsing.
    element.textContent = text;
    if (scope) element.setAttribute('scope', scope);
    return element;
  }

  function describe(map: ChoroplethMap): void {
    const caption = document.createElement('caption');
    caption.textContent = `${map.title}, by census area`;

    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.append(
      cell('th', locationLabel, 'col'),
      cell('th', 'Count', 'col'),
    );
    head.append(headRow);

    const body = document.createElement('tbody');
    for (const [index, location] of map.locations.entries()) {
      const row = document.createElement('tr');
      row.append(
        cell('th', String(location), 'row'),
        cell('td', String(map.z[index])),
      );
      body.append(row);
    }

    table.replaceChildren(caption, head, body);
  }

  function show(id: string): void {
    const map = byId.get(id);
    if (!map) throw new Error(`no map named ${id}`);

    title.textContent = map.title;
    describe(map);
    Plotly.newPlot(
      host,
      [
        {
          type: 'choropleth',
          geo: 'geo',
          geojson,
          locations: map.locations,
          z: map.z,
          coloraxis: 'coloraxis',
          marker: { opacity: 0.7 },
          hovertemplate: `${locationLabel}=%{location}<br>${map.title}=%{z}<extra></extra>`,
        },
      ],
      // Cloned: Plotly writes resolved values back into the layout it is given
      // (a colorbar `y` appears after the first plot). Handing it the shared
      // constant would let one map's resolved geometry leak into the next,
      // which is exactly the drift the pinned gutter exists to prevent.
      structuredClone(LAYOUT),
      { responsive: true },
    ).catch((error: unknown) => console.error(error));
  }

  const label = options.label ?? ((map: ChoroplethMap) => map.id);

  if (!options.groupBy) {
    const items = radioGroup('radioContainer', options.legend);
    controls.append(items);
    wire(items, show);
    fill(
      items,
      'maps',
      maps.map((map) => ({ value: map.id, label: label(map) })),
    );
    return;
  }

  if (!options.groupLegend) {
    throw new Error(
      'groupBy needs groupLegend for the group its accessible name',
    );
  }

  const groups = new Map<string, ChoroplethMap[]>();
  for (const map of maps) {
    const key = options.groupBy(map.id);
    const bucket = groups.get(key);
    if (bucket) bucket.push(map);
    else groups.set(key, [map]);
  }

  const categories = radioGroup('categoryContainer', options.groupLegend);
  const items = radioGroup('radioContainer', options.legend);
  controls.append(categories, items);

  wire(items, show);
  wire(categories, (key) => {
    fill(
      items,
      'maps',
      (groups.get(key) ?? []).map((map) => ({
        value: map.id,
        label: label(map),
      })),
    );
  });

  fill(
    categories,
    'cats',
    [...groups.keys()].map((key) => ({ value: key, label: key })),
  );
}
