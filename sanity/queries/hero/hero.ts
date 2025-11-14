import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";
import { imageQuery } from "../shared/image";
import { bodyQuery } from "../shared/body";

// @sanity-typegen-ignore
export const heroQuery = groq`
  _type == "hero" => {
    _type,
    _key,
    tagLine,
    title,
    body[]{
      ${bodyQuery}
    },
    image{
      ${imageQuery}
    },
    links[]{
      ${linkQuery}
    },
  }
`;

