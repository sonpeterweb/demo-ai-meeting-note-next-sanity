import { defineArrayMember, defineField, defineType } from "sanity";
import { History } from "lucide-react";

const IMPACT_OPTIONS = [
  { title: "Major Update", value: "major" },
  { title: "Enhancement", value: "minor" },
  { title: "Bug Fix", value: "fix" },
];

const AUDIENCE_OPTIONS = [
  { title: "All Users", value: "all" },
  { title: "Admins", value: "admin" },
  { title: "Beta Testers", value: "beta" },
];

const changelogEntry = defineType({
  name: "changelog-entry",
  title: "Changelog Entry",
  type: "document",
  icon: History,
  groups: [
    { name: "summary", title: "Summary" },
    { name: "details", title: "Details" },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "summary",
      validation: (rule) => rule.required().error("Title is required."),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "summary",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required."),
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "datetime",
      group: "summary",
      validation: (rule) =>
        rule.required().error("Provide the release date for this update."),
    }),
    defineField({
      name: "impactLevel",
      title: "Impact Level",
      type: "string",
      group: "summary",
      options: {
        list: IMPACT_OPTIONS,
        layout: "radio",
      },
      initialValue: "minor",
      validation: (rule) =>
        rule.required().error("Select the impact level for this release."),
    }),
    defineField({
      name: "audience",
      title: "Intended Audience",
      type: "string",
      group: "summary",
      options: {
        list: AUDIENCE_OPTIONS,
        layout: "radio",
      },
      initialValue: "all",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "details",
      description: "One-paragraph overview shown in the changelog list.",
      validation: (rule) =>
        rule
          .max(220)
          .warning("Keep the summary concise (220 characters max)."),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) =>
            rule.required().error("Highlight items cannot be empty."),
        }),
      ],
      validation: (rule) =>
        rule.min(1).warning("Include at least one highlight for visibility."),
    }),
    defineField({
      name: "body",
      title: "Detailed Notes",
      type: "block-content",
      group: "details",
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "meta",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
        }),
      ],
    }),
    defineField({
      name: "relatedPages",
      title: "Related Pages",
      type: "array",
      group: "meta",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "page" }],
        }),
      ],
      description: "Links to marketing pages that highlight this release.",
    }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      group: "meta",
      options: {
        list: [
          { title: "Published", value: "published" },
          { title: "Draft", value: "draft" },
          { title: "Scheduled", value: "scheduled" },
        ],
        layout: "radio",
      },
      initialValue: "published",
      validation: (rule) =>
        rule.required().error("Set the visibility for the changelog entry."),
    }),
    defineField({
      name: "scheduledPublish",
      title: "Scheduled Publish",
      type: "datetime",
      group: "meta",
      description:
        "Optional future publish time for scheduled changelog entries.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      releaseDate: "releaseDate",
      impactLevel: "impactLevel",
    },
    prepare({ title, releaseDate, impactLevel }) {
      const date = releaseDate
        ? new Date(releaseDate).toLocaleDateString()
        : "No date";
      const impact = impactLevel
        ? impactLevel.replace(/^\w/, (char: string) => char.toUpperCase())
        : "Uncategorized";
      return {
        title: title ?? "Changelog Entry",
        subtitle: `${impact} · ${date}`,
      };
    },
  },
});

export default changelogEntry;

