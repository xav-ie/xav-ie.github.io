#!/usr/bin/env node
import { writeFile, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { buildHeartSvg } from "../src/heart-svg.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(__dirname, "../public/og.png");
const fontRegularPath = path.resolve(__dirname, "fonts/Inter-Regular.ttf");
const fontBoldPath = path.resolve(__dirname, "fonts/Inter-Bold.ttf");

const bg = "#150b1e";
const fg = "#fff17b";

async function main() {
  const [regular, bold] = await Promise.all([
    readFile(fontRegularPath),
    readFile(fontBoldPath),
  ]);

  // Render the stylized heart to PNG first — satori's SVG support
  // doesn't cover the gradients/filters/masks used in HeartGoldSvg, so
  // we feed it a pre-rasterised image instead. resvg-js handles the
  // full SVG cleanly. Drop-shadow CSS filter is off because the OG card
  // already supplies surrounding contrast and we don't want a halo
  // bleeding into the layout.
  const heartSvgString = buildHeartSvg({
    size: "360",
    title: "xav.ie",
    dropShadow: false,
  });
  const heartPng = new Resvg(heartSvgString, {
    fitTo: { mode: "width", value: 360 },
  })
    .render()
    .asPng();
  const heartDataUri = `data:image/png;base64,${heartPng.toString("base64")}`;

  const tree = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        background: bg,
        color: fg,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 90px",
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: 110,
                          fontWeight: 700,
                          lineHeight: 1.05,
                        },
                        children: "Xavier Ruiz",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 50, fontWeight: 400, marginTop: 8 },
                        children: "Full-Stack Developer",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: 36, fontWeight: 400 },
                  children: "xav.ie",
                },
              },
            ],
          },
        },
        {
          type: "img",
          props: {
            src: heartDataUri,
            width: 360,
            height: 360,
          },
        },
      ],
    },
  };

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: bold, weight: 700, style: "normal" },
    ],
  });

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  })
    .render()
    .asPng();

  await writeFile(output, png);
  console.log(`generated og.png → public/og.png (${png.length} bytes)`);
}

try {
  await main();
} catch (error) {
  try {
    await stat(output);
    console.warn(
      `og.png generation failed (${error.message}); keeping existing public/og.png`,
    );
  } catch {
    console.error(
      `og.png generation failed (${error.message}) and no fallback exists`,
    );
    process.exit(1);
  }
}
