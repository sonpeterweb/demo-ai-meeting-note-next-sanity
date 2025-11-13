import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

const config = [
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "test-env/**",
      "sanity.types.ts",
      "listenote-seed.ndjson",
      "pnpm-lock.yaml",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default config;

