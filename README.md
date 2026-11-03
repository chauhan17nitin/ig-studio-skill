# ig-studio

A Claude skill that runs your brand's Instagram content as a weekly system. It plans the week, creates the posts and files them in a calendar. You upload them.

> **Status:** in testing, not yet released. There is no license yet.

## Who it's for

Solo builders who have a product but aren't strong at marketing.

## How it works

**First session:** you share your brand, and ig-studio suggests content types based on evidence. You pick the ones you want and react to a first post.

**Every week:**

1. Review last week's numbers.
2. Tune or pause formats, using each format's success test.
3. Plan the week.
4. Create and render the posts.
5. File them in the calendar, with a log and a summary of what to upload each day.

Run it from a recurring task, or type "generate next week's content". The recurring task only runs while the Claude app is open.

## Requirements

- Claude Code or the Claude desktop app
- Node 18 or newer
- `python3`
- `ffmpeg` with `libx264`
- Google Chrome

## Install

Add both marketplaces, then install. This also installs `instagram-agent`, the plugin with the `ig-*` skills.

```bash
claude plugin marketplace add Jakeschincariol/instagram-agent-skill
```

```bash
claude plugin marketplace add <owner>/<repo>
```

```bash
claude plugin install ig-studio@ig-studio
```

Then ask Claude to set up Instagram content for your brand. Setup checks the other requirements and shows how to install anything missing.

## What you get

```text
my-brand/
  brand.yaml, brief.md, voice.md, rules.md   # what it knows about your brand
  formats/<name>/                            # your content types
  posts/<name>/NN-slug/                      # finished files and captions
  calendar/YYYY/MM-month/                    # the plan and each day's posts
  reviews/                                   # what worked
  log.md                                     # every post and its results
```

## What it won't do

- Publish for you
- Ask for your Instagram password or use a scraping service
- Invent numbers, customers or testimonials. A post missing a fact is marked `NEEDS INPUT`.
- Promise growth. It's a system for making and testing content.

## Repo

| Path | Contents |
|---|---|
| [`skills/ig-studio/`](skills/ig-studio/) | The skill |
| [`.claude-plugin/`](.claude-plugin/) | Plugin and marketplace manifests |
| [`GOAL.md`](GOAL.md) | Why it exists |
| [`DESIGN.md`](DESIGN.md) | How it behaves |
| [`PLAN.md`](PLAN.md) | Build steps and status |

Run the tests:

```bash
node --test skills/ig-studio/scripts/*.test.mjs
```

## Credits

Writing and analysis come from [instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) by Jake Schincariol (MIT). It installs as a separate plugin and isn't copied into this repo.
