import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

// @sanity-typegen-ignore
export const pricingRowQuery = groq`
  _type == "pricing-row" => {
    _type,
    _key,
    padding,
    colorVariant,
    eyebrow,
    title,
    description,
    footnote,
    highlightedTier->{
      _id
    },
    tiers[]->{
      _id,
      title,
      slug{
        current
      },
      subtitle,
      badge,
      description,
      status,
      price{
        amount,
        currency,
        billingCycle
      },
      features,
      cta{
        ${linkQuery}
      }
    }
  }
`;

