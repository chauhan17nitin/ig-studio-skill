#!/usr/bin/env node
// Renders one post from its config.json: HTML template to frames with headless Chrome, then frames to a timed
// video with ffmpeg for reels. Carousels and single images stop at the frames.
// Usage: node render.mjs path/to/config.json [--out dir]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const SIZES = {
  reel: [1080, 1920],
  carousel: [1080, 1350],
  image: [1080, 1350],
};
export const TIMING = { wps: 4, base: 0.8, hold: 1.5, card: 1, maxSeconds: 20 };
const CARD_ZOOM = "0.04*exp(-t*6)";
const CARD_FADE = 0.15;

export const round1 = (n) => n.toFixed(1);

export function countWords(text = "") {
  return text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

// Start times are summed from rounded durations, so the printed timeline is the one that gets rendered.
export function buildTimeline(frames, timingConfig = {}, hasCard = false) {
  const timing = { ...TIMING, ...timingConfig };
  let at = 0;
  const timed = frames.map((frame, index) => {
    const isLast = index === frames.length - 1;
    const seconds =
      frame.seconds ??
      Number(round1(timing.base + countWords(frame.text) / timing.wps + (isLast ? timing.hold : 0)));
    const start = at;
    at = Number(round1(at + seconds));
    return { ...frame, seconds, start };
  });
  const cardStart = at;
  const total = hasCard ? Number(round1(at + timing.card)) : at;
  if (total > timing.maxSeconds) {
    throw new Error(`${round1(total)}s is over the ${timing.maxSeconds}s reel limit. Cut words or frames.`);
  }
  return { frames: timed, cardStart, cardSeconds: timing.card, total };
}

export function frameUrl(template, frame, data = {}) {
  const hash = frame.hash ?? encodeURIComponent(JSON.stringify({ ...data, ...frame.state }));
  return `${pathToFileURL(template).href}#${hash}`;
}

export function zoomFilter(zoom, seconds, [width, height]) {
  if (!zoom) return "format=yuv420p";
  const expression = zoom.replaceAll("{d}", String(seconds));
  return `scale=w='trunc(${width}*(1+${expression})/2)*2':h=-2:eval=frame,crop=${width}:${height},format=yuv420p`;
}

export function audioFilter(cues, total) {
  const labels = [];
  const chains = cues.map((cue, index) => {
    const steps = [];
    if (cue.trim) steps.push(`atrim=duration=${cue.trim}`);
    if (cue.trim && cue.fadeOut) {
      steps.push(`afade=t=out:st=${Number((cue.trim - cue.fadeOut).toFixed(3))}:d=${cue.fadeOut}`);
    }
    if (cue.volume) steps.push(`volume=${cue.volume}`);
    const ms = Math.trunc(cue.start * 1000);
    steps.push(`adelay=${ms}|${ms}`);
    return { input: `[${index + 1}]`, steps: steps.join(","), label: `[a${index + 1}]` };
  });
  if (chains.length === 1) {
    return `${chains[0].input}${chains[0].steps},apad,atrim=duration=${total}[aout]`;
  }
  const parts = chains.map((chain) => {
    labels.push(chain.label);
    return `${chain.input}${chain.steps}${chain.label}`;
  });
  return `${parts.join(";")};${labels.join("")}amix=inputs=${chains.length}:normalize=0:duration=longest,alimiter=limit=0.8:level=disabled,apad,atrim=duration=${total}[aout]`;
}

export function findChrome(platform = process.platform, exists = existsSync, env = process.env) {
  const candidates = {
    darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"],
    linux: ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/snap/bin/chromium"],
    win32: [
      `${env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
      `${env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
      `${env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    ],
  }[platform] ?? [];
  const found = [env.CHROME_PATH, ...candidates].filter(Boolean).find((path) => exists(path));
  if (!found) throw new Error("Chrome not found. Install Google Chrome or set CHROME_PATH.");
  return found;
}

function escapeHtml(text = "") {
  return text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function textCardHtml({ text, tagline, background = "#ffffff", color = "#111111", font = "Helvetica,Arial,sans-serif" }) {
  return `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;width:100%;height:100%;background:${background};color:${color}}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:${font};text-align:center}
h1{font-size:84px;margin:0}p{font-size:44px;margin:24px 80px 0;opacity:.7}
</style><h1>${escapeHtml(text)}</h1>${tagline ? `<p>${escapeHtml(tagline)}</p>` : ""}`;
}

function run(command, args) {
  execFileSync(command, args, { stdio: ["ignore", "ignore", "pipe"] });
}

function main(argv) {
  const configPath = resolve(argv[0] ?? "");
  if (!argv[0] || !existsSync(configPath)) throw new Error("Usage: node render.mjs path/to/config.json [--out dir]");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const base = dirname(configPath);
  const outFlag = argv.indexOf("--out");
  const out = outFlag >= 0 ? resolve(argv[outFlag + 1]) : base;
  const container = config.container ?? "reel";
  const size = config.size ?? SIZES[container];
  if (!size) throw new Error(`Unknown container "${container}". Use reel, carousel or image.`);
  const template = resolve(base, config.template);
  if (!existsSync(template)) throw new Error(`Template not found: ${template}`);

  const chrome = findChrome();
  const framesDir = join(out, "frames");
  const tmp = mkdtempSync(join(tmpdir(), "ig-studio-"));
  mkdirSync(framesDir, { recursive: true });

  const shoot = (url, file) => {
    run(chrome, [
      "--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1", "--no-first-run", "--disable-background-networking",
      `--user-data-dir=${join(tmp, "chrome")}`, `--window-size=${size[0]},${size[1]}`, `--screenshot=${file}`, url,
    ]);
    if (!existsSync(file)) throw new Error(`Chrome did not write ${file}`);
  };

  try {
    for (const frame of config.frames) {
      shoot(frameUrl(template, frame, config.data), join(framesDir, `${frame.id}.png`));
    }
    if (container !== "reel") {
      console.log(`wrote ${config.frames.length} frames to ${framesDir}`);
      return;
    }
    renderReel({ config, base, out, size, framesDir, tmp, shoot });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

function resolveCardImage(card, base, size, framesDir, shoot) {
  if (!card) return null;
  if (card.image && existsSync(resolve(base, card.image))) return resolve(base, card.image);
  if (!card.text) throw new Error(`End card image not found and no fallback text is set: ${card.image}`);
  if (card.image) console.warn(`warning: ${card.image} not found, using a text end card`);
  const html = join(framesDir, "..", ".end-card.html");
  writeFileSync(html, textCardHtml(card));
  const file = join(framesDir, "end-card.png");
  shoot(pathToFileURL(html).href, file);
  rmSync(html);
  return file;
}

function renderReel({ config, base, out, size, framesDir, tmp, shoot }) {
  const cardImage = resolveCardImage(config.endCard, base, size, framesDir, shoot);
  const timeline = buildTimeline(config.frames, config.timing, Boolean(cardImage));
  for (const frame of timeline.frames) console.log(`${frame.id}: start ${frame.start}s, ${frame.seconds}s`);
  if (cardImage) console.log(`end card: start ${timeline.cardStart}s, ${timeline.cardSeconds}s`);
  console.log(`total ${timeline.total}s`);

  const encode = ["-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18"];
  const segments = timeline.frames.map((frame, index) => {
    const file = join(tmp, `seg${index}.mp4`);
    run("ffmpeg", ["-v", "error", "-y", "-loop", "1", "-framerate", "30", "-t", String(frame.seconds),
      "-i", join(framesDir, `${frame.id}.png`), "-vf", zoomFilter(frame.zoom, frame.seconds, size), ...encode, file]);
    return file;
  });
  if (cardImage) {
    const file = join(tmp, "seg-card.mp4");
    const filter = zoomFilter(CARD_ZOOM, timeline.cardSeconds, size).replace(",format=yuv420p", `,fade=t=in:st=0:d=${CARD_FADE},format=yuv420p`);
    run("ffmpeg", ["-v", "error", "-y", "-loop", "1", "-framerate", "30", "-t", String(timeline.cardSeconds),
      "-i", cardImage, "-vf", filter, ...encode, file]);
    segments.push(file);
  }
  const list = join(tmp, "list.txt");
  writeFileSync(list, segments.map((file) => `file '${file}'\n`).join(""));
  const video = join(tmp, "video.mp4");
  run("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", video]);

  const starts = Object.fromEntries(timeline.frames.map((frame) => [frame.id, frame.start]));
  starts.endCard = timeline.cardStart;
  const cues = (config.audio ?? []).flatMap((cue) => {
    const file = resolve(base, cue.file);
    if (!existsSync(file)) {
      console.warn(`warning: sound not found, skipping: ${cue.file}`);
      return [];
    }
    const start = typeof cue.at === "number" ? cue.at : starts[cue.at];
    if (start === undefined) throw new Error(`Audio cue points at unknown frame "${cue.at}"`);
    return [{ ...cue, file, start }];
  });

  const output = join(out, "reel-video.mp4");
  const audioOut = ["-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-shortest", "-movflags", "+faststart", output];
  if (cues.length) {
    run("ffmpeg", ["-v", "error", "-y", "-i", video, ...cues.flatMap((cue) => ["-i", cue.file]),
      "-filter_complex", audioFilter(cues, timeline.total), "-map", "0:v", "-map", "[aout]", ...audioOut]);
  } else {
    console.warn("note: no sounds used, the reel has a silent audio track");
    run("ffmpeg", ["-v", "error", "-y", "-i", video, "-f", "lavfi", "-t", String(timeline.total),
      "-i", "anullsrc=r=44100:cl=stereo", "-map", "0:v", "-map", "1:a", ...audioOut]);
  }
  console.log(`wrote ${output}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`ERROR: ${error.stderr?.toString().trim() || error.message}`);
    process.exit(1);
  }
}
