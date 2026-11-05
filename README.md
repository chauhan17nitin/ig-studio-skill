# ig-studio

**Your Instagram posts for the week, made for you and ready to upload.**

ig-studio is a free add-on for [Claude Code](https://claude.com/claude-code), Anthropic's AI assistant that can work with files on your computer. It's for solo founders who'd rather build than market. Every week it plans your posts, makes them, and learns from how the last ones did. You upload them.

> **Status:** early version (0.1), still being tested.

## What you get

| Post | What it is | Size |
|---|---|---|
| Carousel | Designed slides in your brand colours and fonts, with your own images if you add them. No stock photos or AI images | Portrait 4:5 (1080×1350), up to 20 slides |
| Single image | Same as a carousel slide | Portrait 4:5 (1080×1350) |
| Reel | A text-and-image video, up to 20s, with your background sound or silent (add music in the app) | Full-screen video, MP4 (1080×1920) |
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

**1. What you need**

- A paid Claude plan and [Claude Code](https://claude.com/claude-code), on macOS or Linux. Windows isn't supported.
- The **Claude desktop app** is best: its built-in browser and scheduled tasks make the weekly routine work. The terminal works too.
- Four free tools: Node, Google Chrome, ffmpeg and python3. Chrome draws the posts, ffmpeg turns them into videos, and python3 scores hooks and captions.

You don't have to install the tools yourself, because setup asks before installing anything that's missing. If you have [Homebrew](https://brew.sh) on a Mac, you can paste this into the Terminal app instead: `brew install node python ffmpeg`.

**2. Install.** Paste these into the Terminal app:

```bash
claude plugin marketplace add Jakeschincariol/instagram-agent-skill
claude plugin marketplace add chauhan17nitin/ig-studio-skill
claude plugin install ig-studio@ig-studio
```

Or type them inside Claude with a slash, for example `/plugin marketplace add ...`. A "marketplace" here is just a free list of add-ons on GitHub. You need both: the first one provides the writing skills.

**3. Optional: log in to Instagram once** in the desktop app's browser pane, or in Chrome with the Claude extension. This lets Claude read your post stats. It never asks for your password. If you skip this, you can paste your numbers in by hand instead.

**4. Set up your brand.** Make an empty folder, for example `instagram/my-brand` in your home folder. Open it in Claude: in the desktop app, pick the folder when you start a Code session, or in the terminal, `cd` into it and run `claude`. Then type:

> Set up Instagram content for my brand. Our website is example.com and our handle is @example.

Have your website, a few posts or messages that sound like you, and your brand colours ready. Setup takes an hour or more. It learns your brand, reviews your past posts, suggests 3 to 5 types of post, and makes your first post with you until it sounds right. Researching similar accounts is optional and takes the longest.

## Every week

Type **"generate next week's content"**, or let the scheduled task that setup offers do it (default Sunday 19:00, while the desktop app is open).

1. **It learns from your numbers.** It reads last week's results, keeps what's working, changes or pauses what isn't, and tells you what it changed and why. Without numbers it says so rather than guessing. If you aren't letting it read Instagram, paste your stats into `numbers.md` before the run.
2. **It makes the posts** and writes the summary. There's no approval step, so skip any post you don't like.
3. **You upload.** Open the post's folder in `calendar/`, for example `calendar/2026-11/2026-11-09-why-spreadsheets-fail/`. Upload `reel-video.mp4`, or the images in `frames/` in order, and paste `caption.txt`. Posts marked `NEEDS INPUT` need a fact from you, and posts marked `FILM` need you to film them. The summary says exactly what each one needs.

**If a post looks off, tell Claude with an example:**

> The headline on the Nov 11 carousel is cut off. Move it lower and keep headlines to one line.

It fixes the post and the design for that type of post, remakes any posts you haven't uploaded yet, and saves the rule in your brand folder so it doesn't happen again. Other standing instructions ("never use emojis") are saved to `rules.md`.

**Adding your own sound and images:** put sound files in `assets/sounds/` and images in `assets/` inside your brand folder, then tell Claude to use them ("use calm-piano.mp3 for the tip reels"). It puts the images into the frames and fits the sound to the reel with a fade-out. Here's [an example reel](https://www.instagram.com/reel/DfRC8pWhr4z/). Use only sounds and images you have the rights to, because Instagram can mute copyrighted music. A free sound pack is coming to this repo.

## Good to know

- **It won't** publish for you, ask for your password, use a scraping service, invent numbers or testimonials, or promise growth.
- **Cost:** ig-studio is free, but weekly runs use a good share of your Claude usage. On a smaller plan, choose fewer posts a week.
- **Your brand folder:** `brand.yaml`, `brief.md`, `voice.md` and `rules.md` hold what it knows about your brand. `formats/` holds your post types and their designs, `calendar/` your posts by upload date, and `reviews/` and `log.md` the results. You can edit any of them.
- **Update or remove:** `claude plugin update ig-studio@ig-studio`, or `claude plugin uninstall ig-studio@ig-studio`. Uninstalling never touches your brand folder.

## Troubleshooting

- **"Chrome not found":** install Google Chrome, or set `CHROME_PATH` to where Chrome is installed.
- **"ffmpeg not found":** `brew install ffmpeg` (macOS) or `sudo apt install ffmpeg` (Linux).
- **A scheduled run never finished:** it's probably waiting for you to approve something. Approve it in the desktop app, and watch the first run once.
- **`ig-*` skills missing:** run the install commands again.

## Used for real

All the content on [@pulseai.chat](https://www.instagram.com/pulseai.chat/) is made with ig-studio. The goal is to grow the page over the next 3 to 4 months. Let's see how it goes.

## Credits

Writing and analysis come from [instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) by Jake Schincariol (MIT), installed as a separate plugin. Tested against its commit `d03c56b`.

## License

MIT
