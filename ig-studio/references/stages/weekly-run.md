# Weekly run

Nobody may be present, so finish every step without waiting for a reply. Read `references/ig-skills.md` first. A finished run leaves all of these in the project:

| Output | Path |
|---|---|
| Review | `reviews/YYYY-MM-DD.md` |
| Plan | `calendar/YYYY/MM-month/plan-YYYY-MM-DD.md` |
| Each post | `posts/<format>/NN-slug/`, with its final files, `caption.txt` and `checks.md` |
| Calendar links | Each day folder, linking to that day's posts |
| Log rows | `log.md`, one per post |
| Summary | `calendar/YYYY/MM-month/summary-YYYY-MM-DD.md`, repeated as the final message |

## 1. Pick the week

If the request names dates or a number of days, use those, with one slot per day unless it says otherwise. Otherwise the target is the earliest Monday, today or later, with no plan file. Dates in filenames are the first day. If today is Monday and no plan exists, the week starts today.

## 2. Read the project

Read `rules.md`, `brief.md`, `brand.yaml`, `voice.md`, `log.md`, the latest review, each format file, and `swipe.md` if it exists.

## 3. Review last week

Get numbers from the first available source:

1. `numbers.md`, if it has rows for last week
2. The browser, if `insights` isn't `paste`, following the stop signals in `references/research-rules.md`
3. None: use `templates/review.md` with `Data: none`. If `log.md` shows posts that were due last week, add 1 to `runsWithoutData` in `state.yaml`

With numbers, run `ig-audit`, update results in `log.md`, set those posts to `posted`, reset `runsWithoutData` to 0 and clear used rows from `numbers.md`. Name the review after the plan's first day. Mark posts live under 3 days as too new, and re-read them next run.

## 4. Update formats

Apply each format's success test once it has enough posts. Within these limits:

| A run may | A run may not |
|---|---|
| Tune a format's copy rules | Invent a format |
| Pause a format that missed its bar | Rewrite a format's structure or template |
| Record the evidence and date | Pause or retire the last active format |

Suggest anything bigger in the summary. If `runsWithoutData` is 3 or more, change no format status and ask for numbers in the summary.

## 5. Plan

Run `ig-plan` with the review and formats, overriding as in `references/ig-skills.md`. Use `templates/plan.md`.

- Slots: `postsPerWeek` from `brand.yaml`, on `postDays` at `postTimes`. If days aren't set, spread posts evenly starting Monday. If times aren't set, use early evening in the audience's timezone. Label these as defaults.
- A `ready` post already dated in this week takes its slot, and isn't made again.
- Place formats with a fixed cadence next, then fill the rest from active formats, meaning `testing` or `kept`. Share slots evenly, and give any extra slot to the format with the stronger evidence in the review.
- If a planned post can't be made for lack of a fact, give its slot to another active format and record the held idea as `NEEDS INPUT`. Every slot is filled if any active format can fill it.
- Check ideas against `log.md`, and avoid reusing the same joke, example or angle from the last 14 days. The brand's core problem can recur.

## 6. Create one post

For each slot:

1. Make `posts/<format>/NN-slug/`, with `NN` continuing that format's numbering.
2. Write the copy following the format file, using `ig-reel` or `ig-carousel`.
3. Write the caption with `ig-caption`.
4. Clean both with `ig-human`, then re-read them against `voice.md` and `rules.md`.
5. Add its row to `log.md` with status `drafted`.
6. For rendered formats, write `config.json` from `templates/post-config.json`, removing any asset entries the brand doesn't have, then run `node <skill>/scripts/render.mjs config.json`. For filmed formats, write `script.md`, and mark the post `FILM`.
7. View every carousel slide, and at least one frame of a reel. If text is clipped, overflows or leaves the safe area, fix and re-render.
8. Write `checks.md`: tool scores, decisions and any fact that would improve the post.
9. Run `node <skill>/scripts/file-post.mjs <project> <post folder> <YYYY-MM-DD>`, then set the log status to `ready`.

Any error on one post: record it, mark that post `NEEDS INPUT` and continue with the rest.

## 7. Summarize

Fill in `templates/summary.md` and end the run with it. Set `lastRun` in `state.yaml`.
