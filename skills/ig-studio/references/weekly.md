# Weekly run

Nobody may be present, so finish every step without waiting for a reply. Read `references/ig-skills.md` first. A finished run leaves all of these in the project:

| Output | Path |
|---|---|
| Review | `reviews/YYYY-MM-DD.md` |
| Plan | `calendar/YYYY-MM/plan-YYYY-MM-DD.md` |
| Each post | `calendar/YYYY-MM/YYYY-MM-DD-slug/`, named for its upload date, with its final files, `caption.txt` and `checks.md` |
| Log rows | `log.md`, one per post |
| Summary | `calendar/YYYY-MM/summary-YYYY-MM-DD.md`, repeated as the final message |

## 1. Pick the week

If the request names dates or a number of days, use those, with one slot per day unless it says otherwise. Otherwise the target is the earliest Monday, today or later, with no plan file. Dates in filenames are the first day. If today is Monday and no plan exists, the week starts today.

## 2. Read the project

Read `rules.md`, `brief.md`, `brand.yaml`, `voice.md`, `log.md`, the latest review, each format file, and `swipe.md` if it exists.

## 3. Review last week

Get numbers from the first available source:

1. `numbers.md`, if it has rows for last week
2. The browser, if `insights` isn't `paste`, following Reading Instagram in `SKILL.md`
3. None: write the review with `Data: none`. If `log.md` shows posts that were due last week, add 1 to `runsWithoutData` in `state.yaml`

With numbers, run `ig-audit`, update results in `log.md`, set those posts to `posted`, reset `runsWithoutData` to 0 and clear used rows from `numbers.md`. Name the review after the plan's first day. Mark posts live under 3 days as too new, and re-read them next run.

## 4. Update formats

Apply each format's success test once it has enough posts, following Judging a format below. Within these limits:

| A run may | A run may not |
|---|---|
| Tune a format's copy rules | Invent a format |
| Pause a format that missed its bar | Rewrite a format's structure or template |
| Record the evidence and date | Pause or retire the last active format |

Suggest anything bigger in the summary. If `runsWithoutData` is 3 or more, change no format status and ask for numbers in the summary.

## 5. Plan

Run `ig-plan` with the review and formats, overriding as in `references/ig-skills.md`.

- Slots: `postsPerWeek` from `brand.yaml`, on `postDays` at `postTimes`. If days aren't set, spread posts evenly starting Monday. If times aren't set, use early evening in the audience's timezone. Label these as defaults.
- A `ready` post already dated in this week takes its slot, and isn't made again.
- Place formats with a fixed cadence next, then fill the rest from active formats, meaning `testing` or `kept`. Share slots evenly, and give any extra slot to the format with the stronger evidence in the review.
- If a planned post can't be made for lack of a fact, give its slot to another active format and record the held idea as `NEEDS INPUT`. Every slot is filled if any active format can fill it.
- Check ideas against `log.md`, and avoid reusing the same joke, example or angle from the last 14 days. The brand's core problem can recur.

## 6. Create one post

For each slot:

1. Make the post's folder, named for its upload date.
2. Write the copy following the format file, using `ig-reel` or `ig-carousel`. Write to a word budget: a 20s reel with a 1s end card holds about 45 to 50 words across 5 to 6 frames.
3. Write the caption with `ig-caption`. For a carousel or image, write `alt.txt` too.
4. Clean all of it with `ig-human`, then re-read it against `voice.md` and `rules.md`.
5. Add its row to `log.md` with status `drafted`.
6. For rendered formats, write `config.json` and run the render command in `SKILL.md`. For filmed formats, write `script.md`, and mark the post `FILM`.
7. View every carousel slide, and a reel's first and last frames. If text is clipped, overflows, leaves the safe area, or an image is broken, fix and re-render. If a reel is over its limit, cut words or frames; never shorten a frame below reading speed.
8. Write `checks.md`: tool scores, decisions and any fact that would improve the post.
9. Set the log status to `ready`.

Any error on one post: record it, mark that post `NEEDS INPUT` and continue with the rest.

```json
{
  "container": "reel",
  "template": "../../../formats/FORMAT/template.html",
  "data": {},
  "maxSeconds": 20,
  "audio": "../../../assets/sounds/FILE.mp3",
  "frames": [
    { "id": "frame-1", "text": "Text shown on this frame, used for reading time", "state": {} },
    { "id": "end-card", "seconds": 1, "state": { "card": true } }
  ]
}
```

## 7. Summarize

Write the summary in the shape below and end the run with it.

## Post rules

| Container | Size | Files | Safe area |
|---|---|---|---|
| Reel | 1080x1920 | `reel-video.mp4` | Nothing above y=230 or below y=1440, and keep the right 230px clear |
| Carousel | 1080x1350 | `frames/`, up to 20, plus `alt.txt` | Keep cover text clear of the outer 120px, and important content 160px from the top |
| Single image | 1080x1350 | `frames/`, plus `alt.txt` | Same as carousel |

- A post isn't done until it has its final files and a `caption.txt` that's ready to paste.
- A reel gets sound when its format names one, or when the user asks for one: set `audio` in `config.json` to a file in `assets/sounds/`. The sound loops or is trimmed to fit, with a 1s fade-out. Use only sounds the user has supplied and has the rights to use. Without `audio`, leave the field out: the reel is silent, and the summary should say to add music in the app.
- Images the user supplies go in `assets/` and are shown by the template. Never use images the user hasn't supplied.
- Don't edit published posts to match new rules. Apply new rules to new posts.

## Judging a format

- Set the bar before the test: the metric, the number and how many posts count.
- Compare a post to the account's own median, not to other accounts.
- Say how long each post had been live, state the sample size and confidence, and call small samples weak.
- If a format misses its bar, change or pause it. Don't keep testing the same thing.
- Separate reach problems from conversion problems. Few views points to the hook. Views with no action points to the ask or the profile.

## Log

`log.md` has one row per post, most recent first, added as soon as its copy is final. If a post changes later, add a dated note to its row, not a second row. Status is `drafted`, `ready`, `NEEDS INPUT`, `FILM` or `posted`.

| Date | Format | Post | Hook | Formula | Status | Views | Non-followers | Likes | Comments | Shares | Saves | Follows | Edits |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## Output shapes

**Plan:** `# Plan: <first day> to <last day>`, then `Times: <audience timezone>. Based on: <review link, or "no fresh data">.`, a table of Day, Time, Format, Post (linked), Hook, Status, then sections Testing this week and Held for missing facts.

**Review:** `# Review: <date>`, then `Data: <browser, numbers.md or none>. Posts: <count>. Median views: <number>.`, a table of Post, Format, Days live, Views, vs median, Non-followers, Comments, Shares, Saves, Follows, then sections What the data says (each finding with evidence and confidence), Stop, do more, test, Format decisions, and Missing.

**Summary:** `# Week of <first day>`, then `**Ready:** <n> posts. **Need you:** <n>. **Data:** <fresh, or none, and why>.`, then sections Upload list (a table of Day, Time, Post file, Caption, Add in the app), What worked last week, What changed, Needs you (posts marked `NEEDS INPUT` or `FILM`, and exactly what each needs), and Suggestions (bigger changes, new formats, and a competitor check-in if `swipe.md` is over 30 days old).
