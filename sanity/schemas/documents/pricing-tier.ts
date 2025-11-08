import { defineArrayMember, defineField, defineType } from "sanity";
import { Wallet } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

const BILLING_CYCLE_OPTIONS = [
  { title: "Monthly", value: "monthly" },
  { title: "Quarterly", value: "quarterly" },
  { title: "Annually", value: "annually" },
];

const STATUS_OPTIONS = [
  { title: "Active", value: "active" },
  { title: "Coming Soon", value: "coming-soon" },
  { title: "Deprecated", value: "deprecated" },
];

const pricingTier = defineType({
  name: "pricing-tier",
  title: "Pricing Tier",
  type: "document",
  icon: Wallet,
  groups: [
    { name: "details", title: "Details" },
    { name: "messaging", title: "Messaging" },
    { name: "control", title: "Controls" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "details",
      validation: (rule) => rule.required().error("Tier title is required."),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required().error("Slug is required."),
    }),
    defineField({
      name: "subtitle",
      type: "string",
      group: "details",
      description: "Short positioning line displayed above the price.",
      validation: (rule) =>
        rule.max(80).warning("Keep the subtitle concise (80 chars max)."),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "object",
      group: "details",
      fields: [
        defineField({
          name: "amount",
          type: "number",
          description: "Numeric amount without currency symbol.",
          validation: (rule) =>
            rule.min(0).warning("Negative pricing is typically not desired."),
        }),
        defineField({
          name: "currency",
          type: "string",
          initialValue: "NZD",
          validation: (rule) =>
            rule.length(3).warning("Use 3-letter ISO currency codes."),
        }),
        defineField({
          name: "billingCycle",
          title: "Billing Cycle",
          type: "string",
          options: {
            list: BILLING_CYCLE_OPTIONS,
            layout: "radio",
          },
          initialValue: "monthly",
          validation: (rule) =>
            rule.required().error("Select a billing cycle for this tier."),
        }),
      ],
    }),
    defineField({
      name: "badge",
      title: "Highlight Badge",
      type: "string",
      group: "messaging",
      description: "Optional badge such as “Most Popular”.",
      validation: (rule) =>
        rule.max(24).warning("Badges should be short (24 chars max)."),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      group: "messaging",
      description: "One-line descriptor of the tier’s primary value.",
      validation: (rule) =>
        rule
          .max(180)
          .warning("Keep the description under 180 characters for readability."),
    }),
    defineField({
      name: "features",
      type: "array",
      group: "messaging",
      description: "List of feature highlights for this tier.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) =>
            rule.required().error("Enter a description for each feature."),
        }),
      ],
      validation: (rule) =>
        rule.min(3).warning("Aim for at least 3 features per tier."),
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "link",
      group: "messaging",
      description: "Button link for this tier.",
    }),
    defineField({
      name: "status",
      type: "string",
      group: "control",
      options: {
        list: STATUS_OPTIONS,
        layout: "radio",
      },
      initialValue: "active",
      validation: (rule) =>
        rule.required().error("Set the availability status for this tier."),
    }),
    defineField({
      name: "notes",
      type: "text",
      group: "control",
      description: "Internal notes for editorial or go-to-market teams.",
    }),
    orderRankField({
      type: "pricing-tier",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      amount: "price.amount",
      currency: "price.currency",
      cycle: "price.billingCycle",
      badge: "badge",
    },
    prepare({ title, subtitle, amount, currency, cycle, badge }) {
      const formattedPrice =
        amount !== undefined
          ? `${currency ?? "NZD"} ${amount}/${cycle ?? "monthly"}`
          : "Custom pricing";
      return {
        title: title ?? "Pricing Tier",
        subtitle: [badge, subtitle, formattedPrice].filter(Boolean).join(" · "),
      };
    },
  },
});

export default pricingTier;

