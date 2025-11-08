import { groq } from "next-sanity";
import { linkQuery } from "../shared/link";

export const PRICING_TIERS_QUERY = groq`
  *[_type == "pricing-tier"] | order(orderRank){
    _id,
    _type,
    title,
    slug{
      current
    },
    subtitle,
    badge,
    description,
    status,
    notes,
    price{
      amount,
      currency,
      billingCycle
    },
    features,
    cta{
      ${linkQuery}
    },
    orderRank
  }
`;

export const PRICING_TIER_QUERY = groq`
  *[_type == "pricing-tier" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug{
      current
    },
    subtitle,
    badge,
    description,
    status,
    notes,
    price{
      amount,
      currency,
      billingCycle
    },
    features,
    cta{
      ${linkQuery}
    },
    orderRank
  }
`;

