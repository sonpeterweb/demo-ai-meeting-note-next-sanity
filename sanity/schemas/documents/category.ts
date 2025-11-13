import { defineField, defineType } from "sanity";
import { Tag } from "lucide-react";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: Tag,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().error("Category title is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare({ title, description }) {
      return {
        title: title || "Category",
        subtitle: description,
      };
    },
  },
});

