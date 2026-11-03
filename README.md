# ig-studio

A Claude skill for solo builders who have a product but aren't strong at marketing. It runs your brand's Instagram content as a weekly system: it plans the week, creates the posts and files them in a calendar. You upload them.

> **Status:** in testing, not yet released.

## How it works

**First session:** you share your brand, and ig-studio suggests content types based on evidence. You pick the ones you want and react to a first post.

**Every week:** it reviews last week's numbers, tunes or pauses formats using each one's success test, plans the week, renders the posts, and writes a summary of what to upload each day.

Run it from a recurring task, or type "generate next week's content". The recurring task only runs while the Claude app is open.

## Requirements

- Claude Code or the Claude desktop app on macOS or Linux
- Node 18 or newer, `python3`, `ffmpeg` with `libx264`, and Google Chrome

## Install

Add both marketplaces, then install. This also installs `instagram-agent`, the plugin with the `ig-*` skills.

```bash
claude plugin marketplace add Jakeschincariol/instagram-agent-skill
claude plugin marketplace add chauhan17nitin/ig-studio-skill
claude plugin install ig-studio@ig-studio
```

Then ask Claude to set up Instagram content for your brand. Setup checks the other requirements and shows how to install anything missing.

## What you get

```text
my-brand/
  brand.yaml, brief.md, voice.md, rules.md   # what it knows about your brand
  formats/<name>/                            # your content types
  calendar/YYYY-MM/YYYY-MM-DD-slug/          # finished files and captions, by upload date
  reviews/                                   # what worked
  log.md                                     # every post and its results
```

## What it won't do

- Publish for you
- Ask for your Instagram password or use a scraping service
- Invent numbers, customers or testimonials. A post missing a fact is marked `NEEDS INPUT`.
- Promise growth. It's a system for making and testing content.

## Credits

Writing and analysis come from [instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) by Jake Schincariol (MIT). It installs as a separate plugin and isn't copied into this repo.

## License

MIT
