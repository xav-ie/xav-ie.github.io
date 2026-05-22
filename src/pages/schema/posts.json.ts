import { getCollection } from "astro:content";
import { createSchemaEndpoint } from "@jdevalk/astro-seo-graph";
import { postPieces } from "../../lib/schema";

export const GET = createSchemaEndpoint({
  entries: async () => {
    const posts = await getCollection("posts");
    return posts.filter((p) => !p.data.draft);
  },
  mapper: (post) => [...postPieces(post)],
});
