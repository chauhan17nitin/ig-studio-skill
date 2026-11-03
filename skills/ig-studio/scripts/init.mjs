#!/usr/bin/env node
// Creates a project's folders and starting files. Existing files are never overwritten.
// Usage: node init.mjs <project>
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATES = join(dirname(fileURLToPath(import.meta.url)), "..", "templates");
const FILES = ["state.yaml", "brand.yaml", "brief.md", "voice.md", "rules.md", "log.md", "numbers.md"];
const FOLDERS = ["formats", "posts", "reviews", "calendar", "assets"];

export function initProject(project) {
  const root = resolve(project);
  for (const folder of FOLDERS) mkdirSync(join(root, folder), { recursive: true });
  for (const file of FILES) {
    if (!existsSync(join(root, file))) copyFileSync(join(TEMPLATES, file), join(root, file));
  }
  return root;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) {
    console.error("Usage: node init.mjs <project>");
    process.exit(1);
  }
  console.log(`project ready at ${initProject(process.argv[2])}`);
}
