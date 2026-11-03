# Using the ig-* skills

Source: [instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) by Jake Schincariol, MIT. Tested against commit `d03c56bb598be770c60b201f94237e5d1a4268a6`. Plugin installs may name them `instagram-agent:ig-reel`.

Each tool, such as `hookscore.py`, sits beside its skill's `SKILL.md`. Find that folder at run time and call the tool by its full path; never save the path, because it changes when the plugin updates.

Single-image captions use `ig-caption` Job B.

## Which rules win

Use this order: `rules.md`, the format file, `brand.yaml`, then `ig-*` defaults. So a format's length or word count beats `ig-reel`'s, and the post's ask follows `goal` and `cta` in `brand.yaml`.

Weekly plans contain posts only. Leave out `ig-plan`'s stories and engagement list.

## Project files replace global ones

Tell each skill to use the project's `voice.md`, `swipe.md` and `log.md` in place of those in `~/.claude/instagram/`, and this week's plan in `calendar/` in place of `plan.md`. Their scripts take file paths, so pass project paths: `swipe.py captured.tsv --out <project>/swipe.md`. Write temporary drafts to the post's folder and delete them when it's finished.

Carousels are rendered with `render.mjs`, not printed to PDF as `ig-carousel` suggests.

## When nobody is present

These overrides apply in a weekly run:

| The skill says | Do this |
|---|---|
| Ask the user something | Answer from project files. If they don't have it, treat the fact as missing |
| Wait for copy approval before rendering | Render |
| Wait for "yes" before logging | Log it |
| Use its weekly mix of post types | Fill the week from active formats only, so one format can repeat on consecutive days |
| Suggest formats outside the project | Mention it in the summary, and do not make those posts |

## Reading tool scores

Scores inform a decision and don't replace the format's rules.

| Tool result | Action |
|---|---|
| `hookscore.py` | Score at least 3 candidates per post, using the full on-screen line for a multi-line hook and the cover line for a carousel. Pick the best that still follows the format and sounds like the brand. Under 50 after 3 rewrites: keep the best and note `weak hook` in the summary. Record any formula used in the Formula column of `log.md` |
| `caption.py` FAIL | Fix it. Still failing after 3 tries: mark the post `NEEDS INPUT` |
| `caption.py` WARN | Fix it if the tool is right. If not, note the reason in the post's `checks.md`. Its ask check misses some real asks, such as "Send this to" and "It's in the bio" |
| `humanize.py` | Run on all copy and captions, then re-read the result, because automatic swaps can break a joke or a brand term |
| `detect.py` under PASS | Make one rewrite, then ship the better version and note the score in `checks.md`. If specificity is low because facts are missing, list which fact would help in the summary |

A hook that breaks the format or repeats a recent joke is out, whatever its score. Among the rest, choose the funnier or truer line over a higher score if the difference is under 15, and note that in `checks.md`.
