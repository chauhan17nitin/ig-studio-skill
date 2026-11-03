# Stage: weekly setup

Explain the routine: each week produces finished posts and a summary, with no approval step, and the only manual job is uploading. They can skip any post by not uploading it.

Explain and ask about reading Instagram during weekly runs:

> A weekly run can read last week's numbers from your logged-in browser while you aren't watching. It's a small read of your own account and stops at any sign of blocking. Or you can fill in `numbers.md` before each run instead.

Save the choice as `insights: browser` or `insights: paste` in `state.yaml`.

Offer a recurring task, with the day and time they choose. The default is Sunday at 19:00 local time. If the host has a scheduled-task tool, create it with the prompt in `templates/weekly-task-prompt.md`, filling in the project path.

Tell them plainly:

- Tasks run while the Claude app is open. If it's closed when one is due, it runs at the next launch.
- A permission prompt or hidden browser can stall a run. They should test it once, and the task's permission mode decides how often this happens.
- They can always type "generate next week's content" instead.

Set `stage: done`, and tell them where the calendar folder is.
