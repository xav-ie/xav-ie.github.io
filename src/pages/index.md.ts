import { renderMarkdownAlternate } from "@jdevalk/astro-seo-graph";
import { SITE_URL } from "../lib/schema";

export const GET = () => {
  const canonical = `${SITE_URL}/`;
  const rendered = renderMarkdownAlternate({
    frontmatter: {
      title: "Xavier Ruiz",
      canonical,
      description:
        "Personal site of Xavier Ruiz — a full-stack developer in Boston.",
    },
    body: "Personal site of Xavier Ruiz — a full-stack developer in Boston.",
  });
  return new Response(rendered.markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "max-age=300",
      "X-Robots-Tag": "noindex, follow",
      Link: `<${canonical}>; rel="canonical"`,
      "X-Markdown-Tokens": String(rendered.tokenCount),
    },
  });
};
