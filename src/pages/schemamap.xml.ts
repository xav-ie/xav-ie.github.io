import { getCollection } from 'astro:content';
import { createSchemaMap } from '@jdevalk/astro-seo-graph';
import { SITE_URL } from '../lib/schema';

const allPosts = await getCollection('posts');
const posts = allPosts.filter((p) => !p.data.draft);
let postsLastModified = new Date(0);
for (const p of posts) {
  const candidate = p.data.updatedDate ?? p.data.pubDate;
  postsLastModified = new Date(
    Math.max(postsLastModified.getTime(), candidate.getTime()),
  );
}

export const GET = createSchemaMap({
  siteUrl: SITE_URL,
  entries: [{ path: '/schema/posts.json', lastModified: postsLastModified }],
});
