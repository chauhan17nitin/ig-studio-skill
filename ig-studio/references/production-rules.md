# Production rules

These rules come from running a real weekly content system. Brand settings and `rules.md` can override them unless a rule says otherwise.

## Timing

- Text must stay on screen long enough to read. Default: `0.8s + words / 4`, with an extra `1.5s` on the last frame so it lands. Tokens with no letters or numbers, such as emoji, don't count as words.
- If a reel runs over its limit, cut words or frames. Never shorten a frame below reading speed.
- The default reel limit is 20s, and any end card counts inside it.
- Write to a word budget before building. A 20s reel with a 1s end card holds about 45 to 50 words across 5 to 6 frames.

## Layout

- Keep text in the same position between reel frames, and use one layout across a carousel's content slides. Text that jumps feels broken.
- On a 1080x1350 carousel, keep important content at least 160px from the top. Instagram's optional 1:1 crop trims about 135px from the top and bottom.
- Check the rendered file at phone size, then fix what doesn't read.

## Every post folder

- A post isn't done until it has its final files and a `caption.txt` that's ready to paste. Final files are `reel-video.mp4` for a reel, and `frames/` for a carousel or image, which also get an `alt.txt`.
- Reels with no sound can have trending audio added in the Instagram app. The summary should say so.
- Don't edit posts that are already published to match new rules. Apply new rules to new posts.

## Log

- Read `log.md` before writing, and pick a different angle if the same hook has run recently.
- Add one row per post as soon as its copy is final. Status is `drafted`, `ready`, `NEEDS INPUT`, `FILM` or `posted`.
- If a post changes later, add a dated note to its row. Don't add a second row.
- Keep the last 90 days of rows available for repeat checks.

## Calendar

- Posts live in `posts/<format>/NN-slug/`.
- Each day folder links to its posts, so a post has only one real copy.
- Each week has one plan file, which links to its posts.

## Judging a format

- Set the bar before the test: the metric, the number and how many posts count.
- Compare a post to the account's own median, not to other accounts.
- Mark posts live under 3 days as too new, and say how long each post had been live.
- State the sample size and confidence, and call small samples weak.
- If a format misses its bar, change or pause it. Don't keep testing the same thing.
- Separate reach problems from conversion problems. Few views points to the hook. Views with no action points to the ask or the profile.

## Reading insights

- Use the user's own logged-in browser session, and never log in for them.
- Per-post insights can open at `instagram.com/insights/media/<numeric id>/`, where the ID is the post's shortcode decoded from base64url. Instagram can change this, so fall back to `numbers.md` if it fails.
- Hold at 3 seconds and watch time may only be visible in the app. Mark these as missing, and don't estimate them.
