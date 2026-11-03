import assert from "node:assert/strict";
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { filePost, dayFolder } from "./file-post.mjs";
import { initProject } from "./init.mjs";
import { findIgSkills, IG_SKILLS } from "./check.mjs";

const tempDir = () => mkdtempSync(join(tmpdir(), "ig-studio-test-"));

test("dayFolder names the year, month and weekday", () => {
  assert.equal(dayFolder("2026-11-09"), join("calendar", "2026", "11-november", "2026-11-09-mon"));
});

test("dayFolder rejects bad dates", () => {
  assert.throws(() => dayFolder("9 Nov"), /YYYY-MM-DD/);
  assert.throws(() => dayFolder("2026-13-40"), /YYYY-MM-DD/);
});

test("filePost links a post into its day folder and can repeat", () => {
  const project = tempDir();
  const post = join(project, "posts", "one-liner", "01-a");
  mkdirSync(post, { recursive: true });
  filePost(project, post, "2026-11-09");
  filePost(project, post, "2026-11-09");
  const link = join(project, dayFolder("2026-11-09"), "01-a");
  assert.ok(lstatSync(link).isSymbolicLink());
  assert.equal(readlinkSync(link), join("..", "..", "..", "..", "posts", "one-liner", "01-a"));
});

test("filePost falls back to a markdown link when symlinks fail", () => {
  const project = tempDir();
  const post = join(project, "posts", "one-liner", "01-a");
  mkdirSync(post, { recursive: true });
  const refuse = () => { throw new Error("EPERM"); };
  filePost(project, post, "2026-11-09", refuse);
  const note = readFileSync(join(project, dayFolder("2026-11-09"), "01-a.md"), "utf8");
  assert.match(note, /posts\/one-liner\/01-a/);
});

test("filePost refuses a post that does not exist", () => {
  assert.throws(() => filePost(tempDir(), "/no/such/post", "2026-11-09"), /not found/);
});

test("initProject creates files and keeps existing ones", () => {
  const project = tempDir();
  writeFileSync(join(project, "rules.md"), "mine");
  initProject(project);
  assert.equal(readFileSync(join(project, "rules.md"), "utf8"), "mine");
  for (const path of ["state.yaml", "brand.yaml", "log.md", "numbers.md", "formats", "posts", "reviews", "calendar", "assets"]) {
    assert.ok(existsSync(join(project, path)), path);
  }
  assert.ok(!existsSync(join(project, "format.md")));
});

test("findIgSkills finds a complete folder and rejects a partial one", () => {
  const root = tempDir();
  for (const skill of IG_SKILLS) {
    mkdirSync(join(root, skill), { recursive: true });
    writeFileSync(join(root, skill, "SKILL.md"), "");
  }
  const partial = tempDir();
  mkdirSync(join(partial, "ig-reel"));
  writeFileSync(join(partial, "ig-reel", "SKILL.md"), "");
  assert.equal(findIgSkills([partial, root]), root);
  assert.equal(findIgSkills([partial]), null);
});

