# Stage: history

Choose the first that applies:

| Situation | Action |
|---|---|
| New account, or under 3 posts | Note `history: none` in `state.yaml`, set `stage: competitors` and stop this stage |
| Browser connected | Read up to 30 recent posts and their insights, following `references/production-rules.md` and the stop signals in `references/research-rules.md` |
| No browser | Ask for pasted numbers or screenshots, saved to `numbers.md` |

Run `ig-audit` on what you have. Save the result to `reviews/YYYY-MM-DD-baseline.md` using `templates/review.md`, and add any past posts to `log.md`.

Tell the user the top finding and how confident it is. Under 10 posts counts as weak evidence, and the review must say so.

Set `stage: competitors`.
