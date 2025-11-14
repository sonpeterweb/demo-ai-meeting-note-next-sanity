import { groq } from "next-sanity";
import { heroQuery } from "./hero/hero";
import { sectionHeaderQuery } from "./section-header";
import { splitRowQuery } from "./split/split-row";
import { gridRowQuery } from "./grid/grid-row";
import { ctaQuery } from "./cta/cta";
import { logoCloudQuery } from "./logo-cloud/logo-cloud";
import { faqsQuery } from "./faqs";
import { formNewsletterQuery } from "./forms/newsletter";
import { pricingRowQuery } from "./pricing/pricing-row";

export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    blocks[]{
      ${heroQuery},
      ${sectionHeaderQuery},
      ${splitRowQuery},
      ${gridRowQuery},
      ${pricingRowQuery},
      ${ctaQuery},
      ${logoCloudQuery},
      ${faqsQuery},
      ${formNewsletterQuery},
    },
    meta_title,
    meta_description,
    noindex,
    ogImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
    }
  }
`;

export const PAGES_SLUGS_QUERY = groq`*[_type == "page" && defined(slug)]{slug}`;
