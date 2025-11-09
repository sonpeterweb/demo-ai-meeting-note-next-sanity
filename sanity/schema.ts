import { type SchemaTypeDefinition } from "sanity";
// documents
import faq from "./schemas/documents/faq";
import category from "./schemas/documents/category";
import testimonial from "./schemas/documents/testimonial";
import navigation from "./schemas/documents/navigation";
import settings from "./schemas/documents/settings";
import page from "./schemas/documents/page";
import pricingTier from "./schemas/documents/pricing-tier";
import changelogEntry from "./schemas/documents/changelog-entry";
import aiDemoSample from "./schemas/documents/ai-demo-sample";
import aiDemoConfig from "./schemas/documents/ai-demo-config";
import adminUser from "./schemas/documents/admin-user";

// Schema UI shared objects
import blockContent from "./schemas/blocks/shared/block-content";
import link from "./schemas/blocks/shared/link";
import { colorVariant } from "./schemas/blocks/shared/color-variant";
import { buttonVariant } from "./schemas/blocks/shared/button-variant";
import sectionPadding from "./schemas/blocks/shared/section-padding";
// Schema UI objects
import hero1 from "./schemas/blocks/hero/hero-1";
import hero2 from "./schemas/blocks/hero/hero-2";
import sectionHeader from "./schemas/blocks/section-header";
import splitRow from "./schemas/blocks/split/split-row";
import splitContent from "./schemas/blocks/split/split-content";
import splitCardsList from "./schemas/blocks/split/split-cards-list";
import splitCard from "./schemas/blocks/split/split-card";
import splitImage from "./schemas/blocks/split/split-image";
import splitInfoList from "./schemas/blocks/split/split-info-list";
import splitInfo from "./schemas/blocks/split/split-info";
import gridCard from "./schemas/blocks/grid/grid-card";
import pricingCard from "./schemas/blocks/grid/pricing-card";
import gridRow from "./schemas/blocks/grid/grid-row";
import cta1 from "./schemas/blocks/cta/cta-1";
import logoCloud1 from "./schemas/blocks/logo-cloud/logo-cloud-1";
import faqs from "./schemas/blocks/faqs";
import newsletter from "./schemas/blocks/forms/newsletter";
import pricingRow from "./schemas/blocks/pricing/pricing-row";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    faq,
    category,
    testimonial,
    navigation,
    settings,
    page,
    pricingTier,
    changelogEntry,
    aiDemoSample,
    aiDemoConfig,
    adminUser,
    // shared objects
    blockContent,
    link,
    colorVariant,
    buttonVariant,
    sectionPadding,
    // blocks
    hero1,
    hero2,
    sectionHeader,
    splitRow,
    splitContent,
    splitCardsList,
    splitCard,
    splitImage,
    splitInfoList,
    splitInfo,
    gridCard,
    pricingCard,
    gridRow,
    pricingRow,
    cta1,
    logoCloud1,
    faqs,
    newsletter,
  ],
};
