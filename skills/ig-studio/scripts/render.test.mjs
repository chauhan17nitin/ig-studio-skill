import assert from "node:assert/strict";
import { test } from "node:test";
import { audioFilter, buildTimeline, countWords, findChrome, frameUrl, zoomFilter } from "./render.mjs";

test("countWords ignores tokens with no letters or numbers", () => {
  assert.equal(countWords("read this first 👇"), 3);
  assert.equal(countWords("3 बातें यहाँ"), 3);
  assert.equal(countWords(""), 0);
});

test("buildTimeline adds reading time, a final hold and the end card", () => {
  const { frames, cardStart, total } = buildTimeline(
    [{ id: "a", text: "one two three four five six" }, { id: "b", text: "one two three four five six" }],
    {},
    true,
  );
  assert.deepEqual(frames.map((f) => [f.start, f.seconds]), [[0, 2.3], [2.3, 3.8]]);
  assert.equal(cardStart, 6.1);
  assert.equal(total, 7.1);
});

test("buildTimeline keeps explicit durations", () => {
  const { frames } = buildTimeline([{ id: "a", seconds: 0.3 }]);
  assert.equal(frames[0].seconds, 0.3);
});

test("buildTimeline refuses a reel over the limit", () => {
  assert.throws(() => buildTimeline([{ id: "a", seconds: 19.5 }], {}, true), /over the 20s reel limit/);
});

test("buildTimeline honors a per-format limit", () => {
  assert.equal(buildTimeline([{ id: "a", seconds: 29 }], { maxSeconds: 30 }, true).total, 30);
});

test("frameUrl uses a hash as given, or encodes merged state", () => {
  assert.ok(frameUrl("/tmp/t.html", { hash: "s1" }).endsWith("/tmp/t.html#s1"));
  const url = frameUrl("/tmp/t.html", { state: { show: 2 } }, { hook: "hi" });
  assert.deepEqual(JSON.parse(decodeURIComponent(url.split("#")[1])), { hook: "hi", show: 2 });
});

test("zoomFilter is plain without a zoom and fills in the duration", () => {
  assert.equal(zoomFilter(undefined, 2, [1080, 1920]), "format=yuv420p");
  assert.match(zoomFilter("0.04*t/{d}", 2, [1080, 1920]), /0\.04\*t\/2/);
});

test("audioFilter builds a single cue without a mix", () => {
  assert.equal(
    audioFilter([{ volume: "4dB", start: 6.1 }], 7.1),
    "[1]volume=4dB,adelay=6100|6100,apad,atrim=duration=7.1[aout]",
  );
});

test("audioFilter mixes several cues and applies trim and fade", () => {
  const filter = audioFilter([{ trim: 1.5, fadeOut: 0.2, volume: "10dB", start: 1 }, { start: 2 }], 5);
  assert.match(filter, /atrim=duration=1\.5,afade=t=out:st=1\.3:d=0\.2,volume=10dB,adelay=1000\|1000\[a1\]/);
  assert.match(filter, /amix=inputs=2/);
});

test("findChrome prefers CHROME_PATH and fails clearly", () => {
  assert.equal(findChrome("linux", () => true, { CHROME_PATH: "/custom/chrome" }), "/custom/chrome");
  assert.equal(findChrome("linux", (p) => p === "/usr/bin/chromium", {}), "/usr/bin/chromium");
  assert.throws(() => findChrome("linux", () => false, {}), /Chrome not found/);
});
