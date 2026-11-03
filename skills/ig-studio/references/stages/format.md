# Stage: format

For each chosen type, create `formats/<name>/format.md` from `templates/format.md`, plus `template.html` if it's rendered. See `examples/formats/one-liner/` for a complete one.

Ask only what's needed to fill the fields, at most 6 questions per message:

- What should each post contain, in order?
- What should it never do?
- Where do the raw ideas or facts come from? If they must come from the user each week, explain that weekly runs will hold those posts until they do.
- What would count as success for this format?

Every field must be filled in. For the success test, suggest a bar from existing data, or for a new account use the median views of the account's other formats after 5 posts, plus one action that serves the brand's goal.

The template reads its data from the URL hash as JSON, uses `brand.yaml` colors and fonts, and stays inside the safe area in `references/instagram-specs.md`.

Set `stage: first-post` when all chosen formats are complete.
