import { renderMarkdownAlternate } from '@jdevalk/astro-seo-graph';
import { SITE_URL } from '../lib/schema';

export const GET = () => {
  const canonical = `${SITE_URL}/404/`;
  const rendered = renderMarkdownAlternate({
    frontmatter: {
      title: 'Not found · xav.ie',
      canonical,
    },
    body: "That page doesn't exist.",
  });
  return new Response(rendered.markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'max-age=300',
      'X-Robots-Tag': 'noindex, follow',
      Link: `<${canonical}>; rel="canonical"`,
      'X-Markdown-Tokens': String(rendered.tokenCount),
    },
  });
};
