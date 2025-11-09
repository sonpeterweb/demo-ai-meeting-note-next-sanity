import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from "@/sanity/queries/page";
import { NAVIGATION_QUERY } from "@/sanity/queries/navigation";
import { SETTINGS_QUERY } from "@/sanity/queries/settings";
import {
  CHANGELOG_ENTRIES_QUERY,
  CHANGELOG_ENTRY_QUERY,
} from "@/sanity/queries/changelog/changelog-entry";
import { groq } from "next-sanity";
import {
  PAGE_QUERYResult,
  PAGES_SLUGS_QUERYResult,
  NAVIGATION_QUERYResult,
  SETTINGS_QUERYResult,
  CHANGELOG_ENTRIES_QUERYResult,
  CHANGELOG_ENTRY_QUERYResult,
} from "@/sanity.types";

export const fetchSanityPageBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<PAGE_QUERYResult> => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
  });

  return data;
};

export const fetchSanityPagesStaticParams =
  async (): Promise<PAGES_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: PAGES_SLUGS_QUERY,
      perspective: "published",
      stega: false,
    });

    return data;
  };

export const fetchSanityNavigation =
  async (): Promise<NAVIGATION_QUERYResult> => {
    const { data } = await sanityFetch({
      query: NAVIGATION_QUERY,
    });

    return data;
  };

export const fetchSanitySettings = async (): Promise<SETTINGS_QUERYResult> => {
  const { data } = await sanityFetch({
    query: SETTINGS_QUERY,
  });

  return data;
};

type ChangelogSlug = {
  slug?: {
    current?: string | null;
  } | null;
};

export async function fetchChangelogEntries(): Promise<CHANGELOG_ENTRIES_QUERYResult> {
  const { data } = await sanityFetch({
    query: CHANGELOG_ENTRIES_QUERY,
  });
  return data;
}

export async function fetchChangelogEntryBySlug({
  slug,
}: {
  slug: string;
}): Promise<CHANGELOG_ENTRY_QUERYResult> {
  const { data } = await sanityFetch({
    query: CHANGELOG_ENTRY_QUERY,
    params: { slug },
  });
  return data;
}

export async function fetchChangelogSlugs(): Promise<ChangelogSlug[]> {
  const { data } = await sanityFetch({
    query: groq`*[_type == "changelog-entry" && defined(slug.current)]{slug}`,
    perspective: "published",
    stega: false,
  });
  return data;
}
