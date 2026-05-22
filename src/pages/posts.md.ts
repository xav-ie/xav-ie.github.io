import { getCollection } from 'astro:content';
import { renderMarkdownAlternate } from '@jdevalk/astro-seo-graph';
import { SITE_URL, postUrl } from '../lib/schema';

export const GET = async () => {
  const canonical = `${SITE_URL}/posts/`;
  const allPosts = await getCollection('posts');
  const posts = allPosts
    .filter((p) => !p.data.draft)
    .toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const body = posts
    .map((p) => `- [${p.data.title}](${postUrl(p)})`)
    .join('\n');

  const rendered = renderMarkdownAlternate({
    frontmatter: {
      title: 'Posts — xav.ie',
      canonical,
      description: 'Writing from Xavier Ruiz.',
    },
    body,
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
