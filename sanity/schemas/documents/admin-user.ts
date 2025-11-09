import { defineArrayMember, defineField, defineType } from "sanity";
import { ShieldCheck } from "lucide-react";

const ROLE_OPTIONS = [
  { title: "Administrator", value: "admin" },
  { title: "Editor", value: "editor" },
  { title: "Viewer", value: "viewer" },
];

const STATUS_OPTIONS = [
  { title: "Active", value: "active" },
  { title: "Inactive", value: "inactive" },
  { title: "Invited", value: "invited" },
];

const COLLECTION_OPTIONS = [
  { title: "Testimonials", value: "testimonials" },
  { title: "Pricing Tiers", value: "pricing" },
  { title: "Changelog", value: "changelog" },
  { title: "AI Demo Samples", value: "ai-samples" },
];

const adminUser = defineType({
  name: "admin-user",
  title: "Admin User",
  type: "document",
  icon: ShieldCheck,
  groups: [
    { name: "profile", title: "Profile" },
    { name: "permissions", title: "Permissions" },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      group: "profile",
      validation: (rule) =>
        rule.required().error("Provide the administrator's name."),
    }),
    defineField({
      name: "email",
      type: "string",
      group: "profile",
      validation: (rule) =>
        rule
          .required()
          .email()
          .error("A valid email address is required for admin users."),
    }),
    defineField({
      name: "avatar",
      type: "image",
      group: "profile",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (rule) =>
            rule.required().error("Provide alt text for accessibility."),
        }),
      ],
    }),
    defineField({
      name: "role",
      type: "string",
      group: "permissions",
      options: {
        list: ROLE_OPTIONS,
        layout: "radio",
      },
      initialValue: "editor",
      validation: (rule) =>
        rule.required().error("Assign a role to the admin user."),
    }),
    defineField({
      name: "status",
      type: "string",
      group: "permissions",
      options: {
        list: STATUS_OPTIONS,
        layout: "radio",
      },
      initialValue: "active",
      validation: (rule) =>
        rule.required().error("Set the current status for the admin user."),
    }),
    defineField({
      name: "managedCollections",
      title: "Managed Collections",
      type: "array",
      group: "permissions",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: COLLECTION_OPTIONS,
          },
        }),
      ],
      validation: (rule) =>
        rule.min(1).error("Select at least one collection they manage."),
    }),
    defineField({
      name: "notes",
      type: "text",
      group: "meta",
      rows: 3,
      description: "Internal notes regarding access, demo scripts, etc.",
    }),
    defineField({
      name: "lastLogin",
      title: "Last Login",
      type: "datetime",
      group: "meta",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      subtitle: "role",
      media: "avatar",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title: title ?? "Admin User",
        subtitle: [subtitle, status].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});

export default adminUser;

