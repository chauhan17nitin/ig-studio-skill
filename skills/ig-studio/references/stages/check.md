# Stage: check

1. Run `node <skill>/scripts/init.mjs <project>`. It creates the folders and template files and never overwrites existing ones.
2. Run `node <skill>/scripts/check.mjs`. It prints JSON listing anything missing and its install command.
3. Sort out anything specific to this computer yourself, such as a tool in an unusual location (`render.mjs` accepts `CHROME_PATH`) or links that aren't allowed. Before installing anything, get the user's approval. Install `ig-*` using the upstream README's instructions.
4. Re-run the check. Save `igSkillsDir` to `state.yaml`.
5. Tell the user what's needed for browser access: Claude's browser pane or the Chrome extension, logged in to their Instagram. It's optional, because they can paste numbers into `numbers.md`.

Set `stage: brand`. If something required is still missing, stop here and say what's left.
