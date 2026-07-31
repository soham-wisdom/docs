---
description: Check the docs for broken internal links and stale anchors
---

Run `node scripts/check-links.js --check-anchors` from the repo root.

If it prints "No broken links found.", tell the user that and stop.

If it reports issues, list them grouped by file exactly as printed, then briefly say whether each looks like a mechanical fix (stale/renamed anchor, missing leading slash, wrong file path) or genuinely ambiguous (points at the wrong page/section entirely and needs a judgment call on the right target). Don't apply fixes unless the user asks you to.

If the command fails because `node_modules` is missing, run `npm install` first, then retry.
