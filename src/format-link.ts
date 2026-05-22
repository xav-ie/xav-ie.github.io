// Shortens link text for display. The full URL stays in `href`; only the
// visible label is trimmed. Currently strips the "https://github.com/"
// prefix so e.g. https://github.com/xav-ie/repo renders as "xav-ie/repo".
const PREFIXES = ['https://github.com/'];

export function formatLinkText(url: string): string {
  for (const prefix of PREFIXES) {
    if (url.startsWith(prefix)) return url.slice(prefix.length);
  }
  return url;
}
