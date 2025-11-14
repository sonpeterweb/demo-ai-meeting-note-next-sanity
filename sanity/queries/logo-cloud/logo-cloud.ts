import { groq } from "next-sanity";
import { imageQuery } from "../shared/image";

// @sanity-typegen-ignore
export const logoCloudQuery = groq`
  _type == "logo-cloud" => {
    _type,
    _key,
    padding,
    colorVariant,
    title,
    images[]{
      ${imageQuery}
    },
  }
`;

