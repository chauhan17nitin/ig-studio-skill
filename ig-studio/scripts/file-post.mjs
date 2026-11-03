#!/usr/bin/env node
// Links a post into its calendar day folder. Falls back to a markdown link where symlinks aren't allowed.
// Usage: node file-post.mjs <project> <post folder> <YYYY-MM-DD>
import { existsSync, lstatSync, mkdirSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function dayFolder(date) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime())) {
    throw new Error(`Date must be YYYY-MM-DD, got "${date}"`);
  }
  const [year, month] = date.split("-");
  return join("calendar", year, `${month}-${MONTHS[parsed.getUTCMonth()]}`, `${date}-${DAYS[parsed.getUTCDay()]}`);
}

export function filePost(project, post, date, link = symlinkSync) {
  const postPath = resolve(project, post);
  if (!existsSync(postPath)) throw new Error(`Post not found: ${postPath}`);
  const folder = join(resolve(project), dayFolder(date));
  mkdirSync(folder, { recursive: true });
  const target = join(folder, basename(postPath));
  const relativePost = relative(folder, postPath);
  if (lstatExists(target)) unlinkSync(target);
  try {
    link(relativePost, target, "dir");
  } catch {
    writeFileSync(`${target}.md`, `[${basename(postPath)}](${relativePost.replaceAll("\\", "/")})\n`);
  }
  return folder;
}

function lstatExists(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [project, post, date] = process.argv.slice(2);
  try {
    if (!date) throw new Error("Usage: node file-post.mjs <project> <post folder> <YYYY-MM-DD>");
    console.log(`filed in ${filePost(project, post, date)}`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
}
