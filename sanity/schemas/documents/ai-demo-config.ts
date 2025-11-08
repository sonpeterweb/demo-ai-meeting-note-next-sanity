import { defineField, defineType } from "sanity";
import { Sparkles } from "lucide-react";

const PROVIDER_OPTIONS = [
  { title: "OpenAI", value: "openai" },
  { title: "Anthropic", value: "anthropic" },
  { title: "Google", value: "google" },
  { title: "Custom", value: "custom" },
];

const RUN_MODE_OPTIONS = [
  { title: "Manual Trigger", value: "manual" },
  { title: "Auto Run on Upload", value: "auto" },
];

const aiDemoConfig = defineType({
  name: "ai-demo-config",
  title: "AI Demo Config",
  type: "document",
  icon: Sparkles,
  groups: [
    { name: "provider", title: "Provider" },
    { name: "behaviour", title: "Behaviour" },
    { name: "prompt", title: "Prompting" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "provider",
      description: "Label for this configuration (e.g., Production, Demo).",
      validation: (rule) =>
        rule.required().error("Configuration title is required."),
    }),
    defineField({
      name: "defaultProvider",
      title: "Default Provider",
      type: "string",
      group: "provider",
      options: {
        list: PROVIDER_OPTIONS,
        layout: "radio",
      },
      initialValue: "openai",
      validation: (rule) =>
        rule.required().error("Select an AI provider for the demo."),
    }),
    defineField({
      name: "model",
      title: "Model Identifier",
      type: "string",
      group: "provider",
      description:
        "Model name or version (e.g., gpt-4o-mini). Stored for reference only.",
      validation: (rule) =>
        rule.required().error("Specify the model used for this configuration."),
    }),
    defineField({
      name: "maxTokens",
      title: "Max Tokens",
      type: "number",
      group: "behaviour",
      initialValue: 1200,
      validation: (rule) =>
        rule
          .positive()
          .warning("Ensure max tokens aligns with provider limits."),
    }),
    defineField({
      name: "temperature",
      type: "number",
      group: "behaviour",
      description: "Creativity setting between 0 and 2.",
      initialValue: 0.7,
      validation: (rule) =>
        rule
          .min(0)
          .max(2)
          .warning("Temperature should stay between 0 and 2."),
    }),
    defineField({
      name: "runMode",
      title: "Run Mode",
      type: "string",
      group: "behaviour",
      options: {
        list: RUN_MODE_OPTIONS,
        layout: "radio",
      },
      initialValue: "manual",
      validation: (rule) =>
        rule.required().error("Select how the demo triggers AI requests."),
    }),
    defineField({
      name: "systemPrompt",
      title: "System Prompt",
      type: "text",
      rows: 8,
      group: "prompt",
      description: "Base instructions sent to the AI model.",
      validation: (rule) =>
        rule.warning("Ensure sensitive details are not included here."),
    }),
    defineField({
      name: "postProcessingInstructions",
      title: "Post-processing Instructions",
      type: "text",
      rows: 4,
      group: "prompt",
      description:
        "Guidance for how the front-end should interpret the AI response.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      provider: "defaultProvider",
      model: "model",
    },
    prepare({ title, provider, model }) {
      return {
        title: title ?? "AI Demo Config",
        subtitle: [provider, model].filter(Boolean).join(" · "),
      };
    },
  },
});

export default aiDemoConfig;

