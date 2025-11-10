import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  if (mode === "test") {
    hydrateProcessEnvFromFile(".env.test");
  }

  return {
    esbuild: {
      jsx: "automatic",
      jsxImportSource: "react",
    },
    envDir: path.resolve(__dirname, "test-env"),
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./vitest.setup.ts"],
      css: false,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  };
});

function hydrateProcessEnvFromFile(filename: string) {
  const envPath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(envPath)) {
    return;
  }

  let raw: string;
  try {
    raw = fs.readFileSync(envPath, "utf8");
  } catch (error) {
    return;
  }
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

