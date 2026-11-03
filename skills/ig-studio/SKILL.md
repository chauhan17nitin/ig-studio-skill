---
name: ig-studio
description: Use when a founder or small brand wants to set up, plan or generate Instagram content, wants a content calendar or a week of posts made, asks what to post, or when a scheduled weekly Instagram content run starts.
---

# ig-studio

Runs a brand's Instagram content as a repeating weekly process. The `ig-*` skills by Jake Schincariol do the writing and analysis. This skill decides when each runs, with what context, and where the results go.

## Find the project

The project is the folder holding `state.yaml`. Use a path given in the request, then the current folder. If there is none and someone is present, ask where to create it. If nobody is present, stop and report that no project was found.

Only project files describe this brand. Ignore memory, notes and `~/.claude/instagram/` files about any account. If `rules.md` exists, read it before doing anything else.

## Choose the mode

Use the first row that matches:

| Situation | Mode | Read |
|---|---|---|
| No `state.yaml`, or `stage` is not `done` | First session | The current stage's section in `references/setup.md` |
| The request or task says weekly, or asks for next week's content | Weekly run | `references/weekly.md` |
| Anything else | Check-in | The table below |

Before calling any `ig-*` skill, read `references/ig-skills.md`.

Render a post with `node ${CLAUDE_SKILL_DIR}/scripts/render.mjs <config.json>`.

## Check-ins

The user is present and wants something specific. Do that, reading only the section you need.

| Request | Action |
|---|---|
| Add a format | `setup.md`: Suggest if they want ideas, then Format |
| Retire, resume or restructure a format | Update its file and status with the date and their reason |
| Research competitors | `setup.md`: Competitors |
| Change a post | Edit it, re-render it, and add a dated note to its row in `log.md` |
| Move a post | Rename its folder to the new date, then update its log row and plan link |
| Supply a missing fact | Save it, then finish the `NEEDS INPUT` post |
| Questions about results | Answer from `reviews/` and `log.md`, stating confidence |

## Saving what the user says

Save in the same turn, to the first match:

1. A fact about the brand goes in `brand.yaml` or `brief.md`.
2. A rule about one content type goes in that format's file.
3. A standing instruction goes in `rules.md`, dated, newest wins.

If it's unclear whether an instruction is permanent, ask "just this time, or from now on?". When a new rule conflicts with an old one, replace the old one. Confirm in one line what was saved and where.

## Reading Instagram

- Use the user's existing browser session. Never ask for a password or log in for them.
- Per-post insights can open at `instagram.com/insights/media/<numeric id>/`, where the ID is the post's shortcode decoded from base64url. If that fails, fall back to `numbers.md`.
- Hold at 3 seconds and watch time may only be visible in the app. Mark these as missing, and don't estimate them.
- Stop immediately on "Try again later", "Please wait a few minutes", a 429 or an unexpected login page. Don't retry in that run. Tell the user and carry on with what you have.
- If 3 page loads in a row fail, the browser is probably stalled or hidden. Stop and treat the data as missing.

## Boundaries in every mode

- Publish nothing. The user uploads.
- Claims about the product, customers, numbers or results must come from project files or the user. If a post needs a fact nobody has provided, use `{{what's missing}}` and mark the post `NEEDS INPUT`. Obvious jokes and relatable scenarios aren't claims.
