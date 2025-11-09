import {
  defineArrayMember,
  defineField,
  defineType,
} from "sanity";
import { Wallet } from "lucide-react";

export default defineType({
  name: "pricing-row",
  title: "Pricing Row",
  type: "object",
  icon: Wallet,
  groups: [
    { name: "content", title: "Content" },
    { name: "layout", title: "Layout" },
  ],
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
      group: "layout",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant for this section.",
      group: "layout",
    }),
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      group: "content",
      description: "Short label that appears above the title.",
      validation: (rule) =>
        rule
          .max(48)
          .warning("Keep the eyebrow label short (max 48 characters)."),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      group: "content",
      validation: (rule) =>
        rule.required().error("Pricing sections must include a title."),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      title: "Description",
      group: "content",
      description: "Supportive paragraph that explains the pricing model.",
      validation: (rule) =>
        rule
          .max(220)
          .warning("Keep the description under 220 characters for readability."),
    }),
    defineField({
      name: "tiers",
      type: "array",
      title: "Pricing Tiers",
      group: "content",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "pricing-tier" }],
        }),
      ],
      validation: (rule) =>
        rule
          .min(1)
          .max(3)
          .error("Select between 1 and 3 pricing tiers to display."),
    }),
    defineField({
      name: "highlightedTier",
      title: "Highlighted Tier",
      type: "reference",
      to: [{ type: "pricing-tier" }],
      group: "content",
      description:
        "Pick a tier to visually emphasize (e.g., “Most popular”).",
    }),
    defineField({
      name: "footnote",
      type: "text",
      rows: 2,
      title: "Footnote",
      group: "content",
      description: "Optional footnote that appears beneath the pricing grid.",
      validation: (rule) =>
        rule
          .max(160)
          .warning("Footnotes should be concise (160 characters max)."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      firstTier: "tiers.0.title",
    },
    prepare({ title, firstTier }) {
      return {
        title: title || "Pricing Row",
        subtitle: firstTier || "Connect pricing tiers from Sanity",
      };
    },
  },
});

