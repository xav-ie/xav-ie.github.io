import { getCollection } from "astro:content";
import { createMarkdownEndpoint } from "@jdevalk/astro-seo-graph";
import { postUrl } from "../../lib/schema";

export const getStaticPaths = async () => {
  const posts = await getCollection("posts");
  return posts
    .filter((p) => !p.data.draft)
    .map((p) => ({ params: { slug: p.id } }));
};

export const GET = createMarkdownEndpoint({
  entries: async () => {
    const posts = await getCollection("posts");
    return posts.filter((p) => !p.data.draft);
  },
  mapper: (post, slug) =>
    post.id === slug
      ? {
          frontmatter: {
            title: post.data.title,
            canonical: postUrl(post),
            pubDate: post.data.pubDate,
            updatedDate: post.data.updatedDate,
            author: "Xavier Ruiz",
            description: post.data.description,
          },
          body: post.body ?? "",
        }
      : // eslint-disable-next-line unicorn/no-null -- API requires null
        null,
});
