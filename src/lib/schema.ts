import { breadcrumbsFromUrl } from '@jdevalk/astro-seo-graph';
import {
  assembleGraph,
  buildArticle,
  buildBreadcrumbList,
  buildPiece,
  buildWebPage,
  buildWebSite,
  makeIds,
  type GraphEntity,
} from '@jdevalk/seo-graph-core';

export const SITE_URL = 'https://xav.ie';
export const ids = makeIds({ siteUrl: SITE_URL });

const personImageUrl = `${SITE_URL}/og.png`;

const personImagePiece = (): GraphEntity =>
  buildPiece({
    '@type': 'ImageObject',
    '@id': ids.personImage,
    url: personImageUrl,
    contentUrl: personImageUrl,
    width: 1200,
    height: 630,
    caption: 'Xavier Ruiz',
  }) as GraphEntity;

const personPiece = (): GraphEntity =>
  buildPiece({
    '@type': 'Person',
    '@id': ids.person,
    name: 'Xavier Ruiz',
    url: `${SITE_URL}/`,
    email: 'hello@xav.ie',
    jobTitle: 'Software Developer',
    homeLocation: { '@type': 'Place', name: 'Boston, Massachusetts' },
    knowsAbout: [
      'TypeScript',
      'Rust',
      'Nix',
      'NixOS',
      'Neovim',
      'Lua',
      'Nushell',
      'PipeWire',
      'D-Bus',
      'Model Context Protocol',
      'E-commerce',
      'Web performance',
      'Accessibility',
    ],
    sameAs: [
      'https://github.com/xav-ie',
      'https://www.linkedin.com/in/xav-ie/',
    ],
    image: { '@id': ids.personImage },
  }) as GraphEntity;

const websitePiece = (): GraphEntity =>
  buildWebSite(
    {
      url: `${SITE_URL}/`,
      name: 'xav.ie',
      publisher: { '@id': ids.person },
      inLanguage: 'en-US',
    },
    ids,
  ) as GraphEntity;

const siteBasePieces = (): readonly GraphEntity[] => [
  personPiece(),
  personImagePiece(),
  websitePiece(),
];

export function siteGraph(extraPieces: readonly GraphEntity[] = []) {
  return assembleGraph([...siteBasePieces(), ...extraPieces]);
}

export interface PostLike {
  id: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
  };
}

export function postUrl(post: PostLike): string {
  return `${SITE_URL}/posts/${post.id}/`;
}

export function postPieces(post: PostLike): readonly GraphEntity[] {
  const pageUrl = postUrl(post);
  const { title, description, pubDate, updatedDate } = post.data;
  const crumbs = breadcrumbsFromUrl({
    url: pageUrl,
    siteUrl: SITE_URL,
    pageName: title,
    names: { posts: 'Posts' },
  });
  return [
    buildWebPage(
      {
        url: pageUrl,
        name: title,
        description,
        isPartOf: { '@id': ids.website },
        breadcrumb: { '@id': ids.breadcrumb(pageUrl) },
        datePublished: pubDate,
        ...(updatedDate ? { dateModified: updatedDate } : {}),
        inLanguage: 'en-US',
      },
      ids,
    ) as GraphEntity,
    buildArticle(
      {
        url: pageUrl,
        isPartOf: { '@id': ids.webPage(pageUrl) },
        author: { '@id': ids.person },
        publisher: { '@id': ids.person },
        headline: title,
        description,
        image: { '@id': ids.personImage },
        datePublished: pubDate,
        ...(updatedDate ? { dateModified: updatedDate } : {}),
        inLanguage: 'en-US',
      },
      ids,
      'BlogPosting',
    ) as GraphEntity,
    buildBreadcrumbList({ url: pageUrl, items: crumbs }, ids) as GraphEntity,
  ];
}
