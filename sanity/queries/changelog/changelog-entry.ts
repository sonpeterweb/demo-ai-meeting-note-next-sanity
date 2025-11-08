import { groq } from "next-sanity";
import { bodyQuery } from "../shared/body";

export const CHANGELOG_ENTRIES_QUERY = groq`
  *[_type == "changelog-entry" && visibility != "draft"] | order(releaseDate desc){
    _id,
    _type,
    title,
    slug{
      current
    },
    releaseDate,
    impactLevel,
    audience,
    summary,
    highlights,
    body[]{
      ${bodyQuery}
    },
    tags[]->{
      _id,
      title,
      slug{
        current
      }
    },
    relatedPages[]->{
      _id,
      title,
      slug{
        current
      }
    },
    visibility,
    scheduledPublish,
    _createdAt,
    _updatedAt
  }
`;

export const CHANGELOG_ENTRY_QUERY = groq`
  *[_type == "changelog-entry" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug{
      current
    },
    releaseDate,
    impactLevel,
    audience,
    summary,
    highlights,
    body[]{
      ${bodyQuery}
    },
    tags[]->{
      _id,
      title,
      slug{
        current
      }
    },
    relatedPages[]->{
      _id,
      title,
      slug{
        current
      }
    },
    visibility,
    scheduledPublish,
    _createdAt,
    _updatedAt
  }
`;

