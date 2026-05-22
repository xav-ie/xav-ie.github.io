import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const all = await getCollection("posts");
  const posts = all
    .filter((p) => !p.data.draft)
    .toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "xav.ie",
    description: "Writing from Xavier Ruiz.",
    site: context.site!,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: [
      "<language>en-us</language>",
      `<atom:link href="${new URL("/rss.xml", context.site!).href}" rel="self" type="application/rss+xml" />`,
    ].join(""),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
  });
}
