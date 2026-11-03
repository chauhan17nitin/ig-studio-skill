# First session

Stages run in order. Set `stage` in `state.yaml` after each one, so an interrupted session can resume. Read only the current stage.

## check

1. Create the folders `formats`, `reviews`, `calendar` and `assets`, and each project file below. Create a file only if it's absent. Never overwrite one.
2. Check for Node 18 or newer, `python3`, `ffmpeg` with `libx264` (`ffmpeg -hide_banner -encoders | grep libx264`), Chrome or `CHROME_PATH`, and the `ig-*` skills. Before installing anything, get the user's approval. Install `ig-*` using the upstream README's instructions.
3. Tell the user what's needed for browser access: Claude's browser pane or the Chrome extension, logged in to their Instagram. It's optional, because they can paste numbers into `numbers.md`.

Set `stage: brand`. If something required is still missing, stop here and say what's left.

| File | Contents |
|---|---|
| `state.yaml` | `stage: check`, `insights:` (browser or paste), `runsWithoutData: 0` |
| `brand.yaml` | `name`, `handle`, `website`, `goal` (sign-ups, sales or awareness), `audience`, `timezone`, `postsPerWeek: 5`, `postDays` (`["mon", "wed"]`), `postTimes` (`["18:00"]`, one time applies to every day), `cta`, `colors` (`background`, `text`, `accent`), `fonts` (`heading`, `body`), `assets.logo`, `endCard` (`text`, `tagline`) |
| `brief.md` | What it is, who it's for, the problem it solves, what it doesn't do, and facts usable in posts: only real numbers, customers and results, with where each came from |
| `voice.md` | How we sound, words we use, words we never use, samples in our own words |
| `rules.md` | One standing rule per line, with the date. Newest wins |
| `log.md` | The table in the Log section of `weekly.md` |
| `numbers.md` | Note that it's optional and used rows get cleared, then a table: Post, Date, Views, Non-followers %, Likes, Comments, Shares, Saves, Follows |

## brand

Ask at most 6 questions per message. If they share a website or Instagram handle, read it first, then ask them to confirm what you found rather than asking from scratch.

Round 1:

1. What are you building, and what problem does it solve?
2. Who is it for, as specifically as possible?
3. What do you want Instagram to do: sign-ups, sales, awareness?
4. Your website or link, and your Instagram handle?
5. Your brand colors and fonts? A link to a design system or a screenshot works.
6. Anything you never want said or shown?

Round 2:

1. Share 3 captions, posts or messages that sound like you, or describe how you talk.
2. What would make a post feel wrong for your brand?
3. Your audience's timezone, and any preferred posting days and times?
4. How many posts a week? Default: 5.
5. What should people do after seeing a post? That becomes your call to action.
6. A logo you have the rights to use, and a tagline for a text end card? Both optional.

Save the answers to `brief.md`, `brand.yaml`, `voice.md` and `rules.md`, with things that feel wrong going in `rules.md`. Copy or reference assets through `assets/`. Ask them to confirm they have the rights to anything they supply. If they have no font preference, use a clean system sans. If they don't know an answer, record it as unknown and move on.

Set `stage: history`.

## history

Choose the first that applies:

| Situation | Action |
|---|---|
| New account, or under 3 posts | Set `stage: competitors` and stop this stage |
| Browser connected | Read up to 30 recent posts and their insights, following Reading Instagram in `SKILL.md` |
| No browser | Ask for pasted numbers or screenshots, saved to `numbers.md` |

Run `ig-audit` on what you have. Save the result to `reviews/YYYY-MM-DD-baseline.md` in the Review shape in `weekly.md`, and add any past posts to `log.md`. Tell the user the top finding and how confident it is. Under 10 posts counts as weak evidence, and the review must say so.

Set `stage: competitors`.

## competitors

Ask whether they want this now. It takes longer than the other stages. Recommend it if the account is new, because there's no other evidence. If no, or if the browser isn't available, continue.

If yes, propose accounts for approval, then run `ig-viral` and save `swipe.md` in the project. These add to `ig-viral`:

- Research needs the user present, so it never runs in a weekly run.
- 6 to 12 accounts, about 12 reels each, at human speed. At least half within 10x of the user's follower count. At most about 10 page loads between pauses.
- Follow the stop rules in Reading Instagram in `SKILL.md`.
- Skip accounts whose content the brand wouldn't want to be associated with.

Set `stage: suggest`.

## suggest

No content types are built in. Build suggestions for this brand from its reviews, `swipe.md` and brief. Offer 3 to 5, each in this shape:

```text
<Name>: <one-line description>
Example for your brand: <a specific post idea>
Evidence: <post or account and its number, or "Starting assumption, no data yet">
You provide: <nothing, or what's needed each week>
Result: finished file every week | script and shot list, you film it
```

- Every suggestion has an evidence line. For a new account with no research, label them all as starting assumptions and tests.
- Include at least 2 that can be fully rendered.
- A filmed format goes beyond "upload only", so say so plainly.
- The user can also describe their own type. It gets the same treatment.

Encourage 2 to 3 choices, so weeks have variety and one format isn't carrying everything. Save the list and mark the choices in `formats/ideas.md`, then set `stage: format`.

## format

For each chosen type, create `formats/<name>/format.md`, plus `template.html` if it's rendered. Ask only what's needed to fill the fields, at most 6 questions per message: what each post contains in order, what it must never do, where raw ideas or facts come from (if they must come from the user each week, explain that weekly runs will hold those posts until they do), and what counts as success.

Every field must be filled in:

| Field | Value |
|---|---|
| Name and job | |
| Container | reel, carousel or image |
| Structure | |
| Copy rules | |
| Production | rendered or filmed |
| Assets | What it needs, and the fallback |
| Cadence | Fixed count per week, or flexible |
| Reel length limit | Default 20s |
| Success test | Metric, bar, and number of posts before judging |
| Status | testing, kept, paused or retired, with date and reason |

For the success test, suggest a bar from existing data, or for a new account use the median views of the account's other formats after 5 posts, plus one action that serves the brand's goal.

The template is plain HTML that reads its data with `JSON.parse(decodeURIComponent(location.hash.slice(1)))`, uses `brand.yaml` colors and fonts, and stays inside the safe area in `weekly.md`. Keep text in the same position between reel frames: to reveal lines one at a time, lay out all of them and set `visibility: hidden` on those not yet shown. An end card is a state of the same template, and shows the brand name as text if the logo is missing.

Set `stage: first-post` when all chosen formats are complete.

## first-post

Make one complete post from the user's first-choice format, using "Create one post" in `weekly.md`. Someone is present, so ask rather than guess.

Show them the file and caption, then ask what's off. Save each correction to the format file or `rules.md`, so it shapes later posts. Revise and re-render until they're happy.

Agree an upload date with them and name the post's folder for it, with status `ready` in `log.md`. A later weekly run counts it as one of that week's slots. Set `stage: weekly-setup`.

## weekly-setup

Explain the routine: each week produces finished posts and a summary, with no approval step, and the only manual job is uploading. They can skip any post by not uploading it.

Explain and ask about reading Instagram during weekly runs:

> A weekly run can read last week's numbers from your logged-in browser while you aren't watching. It's a small read of your own account and stops at any sign of blocking. Or you can fill in `numbers.md` before each run instead.

Save the choice as `insights: browser` or `insights: paste` in `state.yaml`.

Offer a recurring task, with the day and time they choose. The default is Sunday at 19:00 local time. If the host has a scheduled-task tool, create it with this prompt:

> Use the ig-studio skill to do a weekly run for the project at <PROJECT PATH>. Nobody is present. Don't wait for replies or approval. Finish with the summary.

Tell them plainly:

- Tasks run while the Claude app is open. If it's closed when one is due, it runs at the next launch.
- A permission prompt or hidden browser can stall a run. They should test it once, and the task's permission mode decides how often this happens.
- They can always type "generate next week's content" instead.

Set `stage: done`, and tell them where the calendar folder is.
