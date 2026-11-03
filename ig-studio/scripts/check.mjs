#!/usr/bin/env node
// Prints JSON listing missing dependencies and how to install them. Exits 1 if anything is missing.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { findChrome } from "./render.mjs";

export const IG_SKILLS = ["audit", "caption", "carousel", "human", "plan", "reel", "viral"].map((name) => `ig-${name}`);
const REPO = "https://github.com/Jakeschincariol/instagram-agent-skill";

export function findIgSkills(roots) {
  return roots.find((root) => IG_SKILLS.every((skill) => existsSync(join(root, skill, "SKILL.md")))) ?? null;
}

function pluginRoots(home) {
  const cache = join(home, ".claude", "plugins", "cache");
  const roots = [];
  const walk = (dir, depth) => {
    if (depth > 4 || !existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const path = join(dir, entry.name);
      if (entry.name === "skills") roots.push(path);
      else walk(path, depth + 1);
    }
  };
  walk(cache, 0);
  return roots;
}

function output(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

function runCheck() {
  const home = homedir();
  const missing = [];
  if (Number(process.versions.node.split(".")[0]) < 18) {
    missing.push({ name: "node 18 or newer", install: "https://nodejs.org" });
  }
  if (!output("python3", ["--version"])) missing.push({ name: "python3", install: "https://www.python.org/downloads/" });
  const encoders = output("ffmpeg", ["-hide_banner", "-encoders"]);
  if (!encoders) missing.push({ name: "ffmpeg", install: "macOS: brew install ffmpeg. Linux: use your package manager. Windows: winget install ffmpeg" });
  else if (!encoders.includes("libx264")) missing.push({ name: "ffmpeg with libx264", install: "Install a full ffmpeg build" });
  let chrome = null;
  try {
    chrome = findChrome();
  } catch {
    missing.push({ name: "Google Chrome", install: "https://www.google.com/chrome/, or set CHROME_PATH" });
  }
  const igSkillsDir = findIgSkills([join(home, ".claude", "skills"), ...pluginRoots(home)]);
  if (!igSkillsDir) missing.push({ name: "ig-* skills", install: `Follow the install steps at ${REPO}` });
  return { ok: missing.length === 0, missing, chrome, igSkillsDir };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = runCheck();
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}
