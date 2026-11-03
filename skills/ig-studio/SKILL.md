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
| No `state.yaml`, or `stage` is not `done` | First session | The file for the current stage, below |
| The request or task says weekly, or asks for next week's content | Weekly run | `references/stages/weekly-run.md` |
| Anything else: edit, add a format, research competitors, ask a question | Check-in | `references/stages/check-in.md` |

First-session stages run in order. Update `stage` in `state.yaml` after each one, so an interrupted session can resume.

| `stage` | File in `references/stages/` |
|---|---|
| `check` | `check.md` |
| `brand` | `brand.md` |
| `history` | `history.md` |
| `competitors` | `competitors.md` |
| `suggest` | `suggest.md` |
| `format` | `format.md` |
| `first-post` | `first-post.md` |
| `weekly-setup` | `weekly-setup.md` |

Before calling any `ig-*` skill, read `references/ig-skills.md`. Before creating a post, read `references/production-rules.md` and `references/instagram-specs.md`.

Run bundled scripts with `node <this skill's folder>/scripts/<name>.mjs`.

## Saving what the user says

Save in the same turn, to the first match:

1. A fact about the brand goes in `brand.yaml` or `brief.md`.
2. A rule about one content type goes in that format's file.
3. A standing instruction goes in `rules.md`.

If it's unclear whether an instruction is permanent, ask "just this time, or from now on?". When a new rule conflicts with an old one, replace the old one. Confirm in one line what was saved and where.

## Boundaries in every mode

- Publish nothing. The user uploads.
- Claims about the product, customers, numbers or results must come from project files or the user. If a post needs a fact nobody has provided, use `{{what's missing}}` and mark the post `NEEDS INPUT`. Obvious jokes and relatable scenarios aren't claims.
- Use the user's existing browser session. Never ask for a password or log in for them.
