import { defineArrayMember, defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { AudioLines } from "lucide-react";

const SOURCE_OPTIONS = [
  { title: "Transcript", value: "transcript" },
  { title: "Audio", value: "audio" },
  { title: "Transcript + Audio", value: "combined" },
];

const aiDemoSample = defineType({
  name: "ai-demo-sample",
  title: "AI Demo Sample",
  type: "document",
  icon: AudioLines,
  groups: [
    { name: "context", title: "Context" },
    { name: "assets", title: "Assets" },
    { name: "expected", title: "Expected Output" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "context",
      validation: (rule) => rule.required().error("Sample title is required."),
    }),
    defineField({
      name: "meetingContext",
      title: "Meeting Context",
      type: "text",
      rows: 3,
      group: "context",
      description: "Short description of the meeting scenario for the demo.",
      validation: (rule) =>
        rule
          .max(280)
          .warning("Keep the meeting context brief (280 characters max)."),
    }),
    defineField({
      name: "persona",
      title: "Primary Persona",
      type: "string",
      group: "context",
      description: "Who is this sample tailored for? (e.g., Product Manager)",
    }),
    defineField({
      name: "sourceType",
      title: "Source Type",
      type: "string",
      group: "assets",
      options: {
        list: SOURCE_OPTIONS,
        layout: "radio",
      },
      initialValue: "transcript",
      validation: (rule) =>
        rule.required().error("Select the source type for this sample."),
    }),
    defineField({
      name: "transcript",
      type: "text",
      group: "assets",
      rows: 12,
      description: "Paste the meeting transcript used for the demo run.",
      validation: (rule) =>
        rule.warning(
          "Long transcripts may impact demo performance; keep them concise."
        ),
    }),
    defineField({
      name: "audio",
      type: "file",
      group: "assets",
      options: {
        accept: "audio/*",
      },
      description: "Optional audio asset that pairs with the transcript.",
    }),
    defineField({
      name: "expectedSummary",
      title: "Expected Summary",
      type: "text",
      rows: 6,
      group: "expected",
      description:
        "Sample summary to pre-populate or compare against AI output.",
      validation: (rule) =>
        rule.warning("Keep summaries under 500 characters where possible."),
    }),
    defineField({
      name: "expectedActionItems",
      title: "Expected Action Items",
      type: "array",
      group: "expected",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) =>
            rule.required().error("Action item text cannot be empty."),
        }),
      ],
      validation: (rule) =>
        rule.min(1).warning("Provide at least one action item for reference."),
    }),
    defineField({
      name: "demoTips",
      title: "Demo Tips",
      type: "text",
      rows: 3,
      group: "expected",
      description: "Internal notes for how to narrate this demo scenario.",
    }),
    orderRankField({ type: "ai-demo-sample" }),
  ],
  preview: {
    select: {
      title: "title",
      persona: "persona",
      sourceType: "sourceType",
    },
    prepare({ title, persona, sourceType }) {
      return {
        title: title ?? "AI Demo Sample",
        subtitle: [persona, sourceType].filter(Boolean).join(" · "),
      };
    },
  },
});

export default aiDemoSample;

