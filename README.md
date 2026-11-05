# ig-studio

A Claude plugin for solo builders who have a product but aren't strong at marketing. It runs your brand's Instagram as a weekly routine: each week it plans your posts, makes them, and leaves them in a dated folder with captions ready to paste. You upload them.

> **Status:** early version (0.1), still being tested.

## What the posts are

Be clear on this before you install:

- **Carousels and single images:** designed graphics in your brand colours and fonts, made from text. No stock photos or AI images.
- **Reels:** short text-on-screen videos, about 20 seconds, with **no sound**. You add music in the Instagram app when you upload.
- **Filmed formats** (optional): if you pick a format that needs you on camera, ig-studio writes the script and shot list and you film it.

It also learns as it goes. Before making each week's posts, it looks at how last week's did, keeps what's working, changes or pauses what isn't, and tells you what it changed and why. It needs your numbers to do this (see [Reading your Instagram numbers](#reading-your-instagram-numbers)). Without them it says so instead of guessing, and its calls get better as the weeks of data add up.

Every week you get one folder per post, plus a summary that tells you what to upload on which day, what worked last week, and what it changed:

```text
# Week of 2026-11-09
Ready: 5 posts. Need you: 1. Data: fresh, from your browser.

| Day | Time  | Post file                              | Caption     | Add in the app |
|-----|-------|----------------------------------------|-------------|----------------|
| Mon | 18:00 | 2026-11-09-why-spreadsheets-fail/...mp4 | caption.txt | music          |
| Wed | 18:00 | 2026-11-11-3-onboarding-mistakes/frames | caption.txt | -              |
```

## How it works

**First session (plan on an hour or more):** you tell it about your brand. It looks at how your past posts did (and, if you want, at what's working for similar accounts), suggests 3 to 5 types of post, makes your first post with you, and adjusts until it sounds like you. Researching similar accounts is optional and takes the longest.

**Every week:** it checks how last week's posts did, keeps what's working and pauses what isn't, then makes next week's posts and writes the summary. There's no approval step. If you don't like a post, don't upload it, or ask Claude to change it.

You can start a week by typing **"generate next week's content"**, or have it run on a schedule (see below).

## Requirements

- **Claude Code**, ideally inside the **Claude desktop app** for its browser pane and scheduled tasks. The terminal works too. macOS or Linux. Windows isn't supported.
- A few free tools. Setup checks for them and offers to install any that are missing:

| Tool | Why it's needed |
|---|---|
| Node 18+ | Runs the script that makes the images and videos |
| Google Chrome | Draws each post as an image |
| ffmpeg | Turns the images into a reel video |
| python3 | Runs the scoring tools that check hooks and captions |

On a Mac with [Homebrew](https://brew.sh): `brew install node python ffmpeg`, plus Chrome from google.com/chrome.

## Install

In a terminal:

```bash
claude plugin marketplace add Jakeschincariol/instagram-agent-skill
claude plugin marketplace add chauhan17nitin/ig-studio-skill
claude plugin install ig-studio@ig-studio
```

Or type the same commands inside a Claude Code session with a slash: `/plugin marketplace add ...` and `/plugin install ig-studio@ig-studio`.

Both marketplaces are needed. The first one provides `instagram-agent`, which does the writing and is installed automatically alongside ig-studio.

## Start

1. Make an empty folder for your brand, for example `~/instagram/my-brand`.
2. Open that folder in a Claude Code session in the **Claude desktop app** (recommended, because its browser pane lets it read your Instagram numbers). From a terminal, `cd ~/instagram/my-brand && claude` also works.
3. Type something like:

   > Set up Instagram content for my brand. Our website is example.com and our handle is @example.

Have your website, a few posts or messages that sound like you, and your brand colours ready. It asks at most 6 questions at a time.

## Uploading a post

Open `calendar/<month>/<date>-<name>/`. Upload `reel-video.mp4` for a reel, or the images in `frames/` in order for a carousel. Then paste `caption.txt` as the caption, and `alt.txt` as alt text if there is one. Posts marked `NEEDS INPUT` are missing a fact only you can give, and the summary says which.

## Running it every week on its own

At the end of setup it offers to create a scheduled task in the **Claude desktop app** (default: Sunday 19:00). Things to know:

- It only runs while the desktop app is open. If the app is closed, it runs the next time you open it.
- A permission prompt can stall it, so test it once while you're watching.
- Without the desktop app, type "generate next week's content" yourself each week.

## Reading your Instagram numbers

To learn what's working, it needs your post stats.

**Recommended: run everything in the Claude desktop app.** The app has a built-in browser pane. Open it once, log in to your Instagram there yourself, and you're done. From then on, setup and every weekly run can read your post insights on their own: which posts got views, shares, saves and follows. That's what lets it see what's working and adjust next week's posts. It reads slowly, only from your own account, and stops at any sign of rate limiting.

So for the best results, do your setup and make your posts in the Claude app, not the terminal.

Other options:

- **Claude in Chrome extension:** works the same way, using the Instagram login in your own Chrome.
- **Paste:** copy your numbers into `numbers.md` before each run. It works anywhere, but it's manual, and if you skip it the week is planned without data.

It never asks for your password. You log in yourself.

## Cost

Every session uses your Claude plan's usage, and a weekly run writes and checks several posts, so it uses a fair amount. On a limited plan, start with fewer posts a week (setup asks how many).

## What's in your folder

```text
my-brand/
  brand.yaml, brief.md, voice.md, rules.md   # what it knows about your brand
  state.yaml                                 # setup progress and settings
  numbers.md                                 # optional: paste your stats here
  swipe.md                                   # research on similar accounts, if you ran it
  assets/                                    # your logo and images
  formats/<name>/                            # your types of post, with their rules
  calendar/YYYY-MM/YYYY-MM-DD-slug/          # finished posts and captions, by upload date
  reviews/                                   # what worked each week
  log.md                                     # every post and its results
```

You can edit any of these files. To give it a lasting instruction, just tell Claude ("never use emojis") and it saves it to `rules.md`.

## What it won't do

- Publish for you
- Ask for your Instagram password or use a scraping service
- Invent numbers, customers or testimonials. A post missing a fact is marked `NEEDS INPUT`.
- Promise growth. It's a system for making and testing content.

## Update or remove

```bash
claude plugin marketplace update ig-studio
claude plugin update ig-studio@ig-studio
claude plugin uninstall ig-studio@ig-studio
```

Your brand folder is never touched by uninstalling.

## Troubleshooting

- **"Chrome not found":** install Google Chrome, or set `CHROME_PATH` to your Chrome or Chromium binary.
- **"ffmpeg not found":** `brew install ffmpeg` (macOS) or `sudo apt install ffmpeg` (Linux).
- **Fonts look wrong in a post:** use fonts installed on your machine or Google Fonts, then ask Claude to re-render the post.
- **A weekly run never finished:** it's probably waiting on a permission prompt. Open the task in the desktop app and approve it, or run it by hand once.
- **It says the `ig-*` skills are missing:** run the install commands again.

## Credits

Writing and analysis come from [instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) by Jake Schincariol (MIT). It installs as a separate plugin and isn't copied into this repo. ig-studio was tested against its commit `d03c56b`, and newer versions may behave a little differently.

## License

MIT
