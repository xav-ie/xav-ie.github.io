import { createApiCatalog } from "@jdevalk/astro-seo-graph";
import { SITE_URL } from "../../lib/schema";

export const GET = createApiCatalog({
  siteUrl: SITE_URL,
  schemaEndpoints: [{ path: "/schema/posts.json", schemaType: "BlogPosting" }],
  schemaMap: { path: "/schemamap.xml" },
});
