import { PAGE_QUERYResult } from "@/sanity.types";
import Hero from "@/components/blocks/hero/hero";
import SectionHeader from "@/components/blocks/section-header";
import SplitRow from "@/components/blocks/split/split-row";
import GridRow from "@/components/blocks/grid/grid-row";
import Cta from "@/components/blocks/cta/cta";
import LogoCloud from "@/components/blocks/logo-cloud/logo-cloud";
import FAQs from "@/components/blocks/faqs";
import PricingRow from "@/components/blocks/pricing/pricing-row";
type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];

const componentMap: {
  [K in Block["_type"]]: React.ComponentType<Extract<Block, { _type: K }>>;
} = {
  hero: Hero,
  "section-header": SectionHeader,
  "split-row": SplitRow,
  "grid-row": GridRow,
  "pricing-row": PricingRow,
  cta: Cta,
  "logo-cloud": LogoCloud,
  faqs: FAQs,
};

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks?.map((block) => {
        const Component = componentMap[block._type];
        if (!Component) {
          // Fallback for development/debugging of new component types
          console.warn(
            `No component implemented for block type: ${block._type}`
          );
          return <div data-type={block._type} key={block._key} />;
        }
        return <Component {...(block as any)} key={block._key} />;
      })}
    </>
  );
}
