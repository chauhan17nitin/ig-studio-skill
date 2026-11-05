#!/usr/bin/env node
// Renders one post: HTML template to frames/*.png with headless Chrome, then reel-video.mp4 for reels.
// Usage: node render.mjs path/to/config.json
// config.json: { container: "reel" | "carousel" | "image", template, data, maxSeconds: 20,
//                frames: [{ id, text, state, seconds }] }
// The template reads { ...data, ...state } from JSON.parse(decodeURIComponent(location.hash.slice(1))).
// A frame's time is 0.8s + words / 4, plus a 1.5s hold on the last frame without its own seconds.
// An end card is an ordinary last frame with "seconds": 1. Reels get a silent track; sound is added in the app.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CHROMES = [process.env.CHROME_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium", "/usr/bin/chromium-browser", "/snap/bin/chromium"];
const countWords = (text = "") => text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;

function main(arg) {
  if (!arg) throw new Error("Usage: node render.mjs path/to/config.json");
  const dir = dirname(resolve(arg));
  const config = JSON.parse(readFileSync(arg, "utf8"));
  if (!Array.isArray(config.frames) || config.frames.length === 0) throw new Error(`${arg} needs a non-empty "frames" list.`);
  if (!config.template) throw new Error(`${arg} needs a "template" path.`);
  if (config.frames.some((frame) => !frame.id)) throw new Error("Every frame needs an \"id\".");
  const isReel = (config.container ?? "reel") === "reel";
  const template = resolve(dir, config.template);
  if (!existsSync(template)) throw new Error(`Template not found: ${template}`);
  const chrome = CHROMES.filter(Boolean).find((path) => existsSync(path));
  if (!chrome) throw new Error("Chrome not found. Install Google Chrome or set CHROME_PATH. Windows is not supported.");
  if (isReel) {
    try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); }
    catch { throw new Error("ffmpeg not found. Install it (macOS: brew install ffmpeg) to make reels."); }
  }

  const holdIndex = config.frames.findLastIndex((frame) => frame.seconds == null);
  const seconds = config.frames.map((frame, i) => frame.seconds ?? Number((0.8 + countWords(frame.text) / 4 + (i === holdIndex ? 1.5 : 0)).toFixed(1)));
  const total = Number(seconds.reduce((a, b) => a + b, 0).toFixed(1));
  const limit = config.maxSeconds ?? 20;
  if (isReel && total > limit) throw new Error(`${total}s is over the ${limit}s limit. Cut words or frames.`);

  const out = join(dir, "frames");
  const tmp = mkdtempSync(join(tmpdir(), "ig-studio-"));
  // Clear old frames so a re-render with fewer slides can't leave stale images behind.
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  try {
    const pngs = config.frames.map((frame) => {
      const png = join(out, `${frame.id}.png`);
      const hash = encodeURIComponent(JSON.stringify({ ...config.data, ...frame.state }));
      execFileSync(chrome, ["--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1", "--no-first-run", "--virtual-time-budget=3000", `--user-data-dir=${join(tmp, "chrome")}`,
        `--window-size=1080,${isReel ? 1920 : 1350}`, `--screenshot=${png}`, `${pathToFileURL(template).href}#${hash}`], { stdio: "ignore" });
      if (!existsSync(png)) throw new Error(`Chrome did not write ${png}`);
      return png;
    });
    if (!isReel) return console.log(`wrote ${pngs.length} frames to ${out}`);
    // The concat demuxer ignores the last duration unless the last file is listed again.
    const entry = (png) => `file '${png.replaceAll("'", "'\\''")}'\n`;
    const list = join(tmp, "list.txt");
    writeFileSync(list, pngs.map((png, i) => `${entry(png)}duration ${seconds[i]}\n`).join("") + entry(pngs.at(-1)));
    execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-t", String(total),
      "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "18", "-c:a", "aac", "-movflags", "+faststart", join(dir, "reel-video.mp4")], { stdio: ["ignore", "ignore", "inherit"] });
    console.log(`wrote reel-video.mp4, ${total}s`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

try {
  main(process.argv[2]);
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
