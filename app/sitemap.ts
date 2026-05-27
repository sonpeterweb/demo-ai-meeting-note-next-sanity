import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const CHANGELOG_PUBLISHED_FILTER = `
  visibility == "published" || (
    visibility == "scheduled" &&
    defined(scheduledPublish) &&
    scheduledPublish <= now()
  )
`;

async function getPagesSitemap(): Promise<MetadataRoute.Sitemap> {
  const pagesQuery = groq`
    *[_type == 'page' && defined(slug.current)] | order(slug.current) {
      'url': $baseUrl + select(slug.current == 'index' => '', '/' + slug.current),
      'lastModified': _updatedAt,
      'changeFrequency': 'daily',
      'priority': select(
        slug.current == 'index' => 1,
        0.5
      )
    }
  `;

  const { data } = await sanityFetch({
    query: pagesQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });

  return data;
}

async function getChangelogSitemap(): Promise<MetadataRoute.Sitemap> {
  const changelogQuery = groq`
    *[_type == "changelog-entry" && defined(slug.current) && (${CHANGELOG_PUBLISHED_FILTER})]
      | order(releaseDate desc) {
      'url': $baseUrl + '/what-new/' + slug.current,
      'lastModified': _updatedAt,
      'changeFrequency': 'weekly',
      'priority': 0.6
    }
  `;

  const { data } = await sanityFetch({
    query: changelogQuery,
    params: {
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });

  return data;
}

function getStaticRoutes(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    {
      url: `${baseUrl}/what-new`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-demo`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, changelog] = await Promise.all([
    getPagesSitemap(),
    getChangelogSitemap(),
  ]);

  return [...pages, ...getStaticRoutes(), ...changelog];
}
