# ig-studio

A Claude plugin for solo builders who have a product but aren't strong at marketing. Every week it plans your Instagram posts, makes them, and learns from how the last ones did. You upload them.

> **Status:** early version (0.1), still being tested.

## What you get

| Post | What it is | Size |
|---|---|---|
| Carousel | Designed slides in your brand colours and fonts, made from text. No stock photos or AI images | 1080×1350, up to 20 slides |
| Single image | Same as a carousel slide | 1080×1350 |
| Reel | A text-on-screen video, about 20s, with **no sound**. Add music in the Instagram app | 1080×1920 MP4 |
| Filmed (optional) | A script and shot list. You film it | |

Each post gets its own dated folder with the file and a `caption.txt` ready to paste. Every week you also get a summary:

```text
# Week of 2026-11-09
Ready: 5 posts. Need you: 1. Data: fresh, from your browser.

| Day | Time  | Post file                                | Caption     | Add in the app |
|-----|-------|------------------------------------------|-------------|----------------|
| Mon | 18:00 | 2026-11-09-why-spreadsheets-fail/...mp4  | caption.txt | music          |
| Wed | 18:00 | 2026-11-11-3-onboarding-mistakes/frames  | caption.txt | -              |
```

## Get started

**1. Requirements.** You need Claude Code on macOS or Linux (Windows isn't supported). Use it inside the **Claude desktop app** if you can, because its browser pane and scheduled tasks make the weekly loop work. The terminal works too. You also need Node 18+, Google Chrome, ffmpeg and python3: Chrome draws the posts, ffmpeg turns them into reels, and python3 runs the hook and caption checks. Setup offers to install anything missing. On a Mac: `brew install node python ffmpeg`.

**2. Install.**

```bash
claude plugin marketplace add Jakeschincariol/instagram-agent-skill
claude plugin marketplace add chauhan17nitin/ig-studio-skill
claude plugin install ig-studio@ig-studio
```

Inside a Claude session, type the same commands with a slash: `/plugin marketplace add ...`. You need both marketplaces. The first one provides the writing skills.

**3. Log in to Instagram once** in the desktop app's browser pane. This lets Claude read your post stats. It never asks for your password.

**4. Set up your brand.** Make an empty folder (for example `~/instagram/my-brand`), open it in Claude, and type:

> Set up Instagram content for my brand. Our website is example.com and our handle is @example.

Have your website, a few posts or messages that sound like you, and your brand colours ready. Setup takes an hour or more. It learns your brand, reviews your past posts, suggests 3 to 5 types of post, and makes your first post with you until it sounds right. Researching similar accounts is optional and takes the longest.

## Every week

Type **"generate next week's content"**, or let the scheduled task that setup offers do it (default Sunday 19:00, while the desktop app is open).

1. **It learns.** It reads last week's numbers, keeps what's working, changes or pauses what isn't, and tells you what it changed and why. Without numbers it says so rather than guessing. If you aren't using the browser pane, paste your stats into `numbers.md` before the run.
2. **It makes the posts** and writes the summary. There's no approval step, so skip any post you don't like.
3. **You upload.** Open the post's folder, upload `reel-video.mp4` or the images in `frames/` in order, and paste `caption.txt`. Posts marked `NEEDS INPUT` need a fact from you, and the summary says which one.

**If a post looks off, tell Claude with an example:**

> The headline on the Nov 11 carousel is cut off. Move it lower and keep headlines to one line.

It fixes the post and the design for that type of post, re-renders any you haven't uploaded, and saves the rule in your project folder so it doesn't happen again. Other standing instructions ("never use emojis") are saved to `rules.md`.

## Good to know

- **It won't** publish for you, ask for your password, use a scraping service, invent numbers or testimonials, or promise growth.
- **Cost:** weekly runs use a fair amount of your Claude plan. On a limited plan, choose fewer posts a week.
- **Your folder:** `brand.yaml`, `brief.md`, `voice.md` and `rules.md` hold what it knows about your brand. `formats/` holds your post types and their designs, `calendar/` your posts by upload date, and `reviews/` and `log.md` the results. You can edit any of them.
- **Update or remove:** `claude plugin update ig-studio@ig-studio`, or `claude plugin uninstall ig-studio@ig-studio`. Uninstalling never touches your brand folder.

## Troubleshooting

- **"Chrome not found":** install Google Chrome, or set `CHROME_PATH`.
- **"ffmpeg not found":** `brew install ffmpeg` (macOS) or `sudo apt install ffmpeg` (Linux).
- **A scheduled run never finished:** it's probably waiting on a permission prompt. Approve it in the desktop app, and watch the first run once.
- **`ig-*` skills missing:** run the install commands again.

## Credits

Writing and analysis come from [instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) by Jake Schincariol (MIT), installed as a separate plugin. Tested against its commit `d03c56b`.

## License

MIT
