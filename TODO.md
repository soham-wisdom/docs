# Search bar / SEO — TODO

Branch: `search-nav-improvements` (created from `staging`). Nothing has been edited yet — all description edits proposed this session were rejected before being applied. Pick up from scratch.

- [ ] **1. Pull Mintlify Search Analytics data** — Optimize → Analytics → Search in the dashboard. Export queries with no results and queries with low click-through rate. Use this to target #2/#3 instead of guessing.
- [ ] **2. Add `description` frontmatter across the site** — only 1 of 214 real pages has a genuine description today. Start with `using-wisdom-ai-everyday/` (11 files) as a pilot batch, get tone approved, then fan out.
- [ ] **3. Expand `keywords` frontmatter coverage** — only 16 of 214 pages have it. Target the no-result/low-CTR terms from #1.
- [ ] **4. Define a `boost` convention and apply it deliberately** — only 1 page site-wide has `boost` (ask-better-questions.mdx, boost: 3), added ad hoc. Write a convention (e.g. 2-5 for cornerstone pages, 5-10 for top-level) and consider `navigation.groups[].boost` in docs.json for whole sections.
- [ ] **5. Resolve keyword overlap** between `using-wisdom-ai-everyday/auditing.mdx` (keywords: chat history, chat log, delete chat) and `using-wisdom-ai-everyday/ask-better-questions.mdx` (keywords: chat, use the chat, chatting, ask questions; boost: 3) — differentiate the terms or document boost as the intended tie-breaker.
- [ ] **6. Add description + keywords to `chat/overview.mdx` before ever unhiding it** — it's `hidden: true`, titled exactly "Chat Overview", placeholder content. If unhidden as-is, its exact title match will out-rank the boosted ask-better-questions.mdx for any "chat" query.
- [ ] **7. Remove or fix the inert `canonical` metatag** in `docs.json` → `seo.metatags.canonical`. `<meta name="canonical">` isn't a real signal (canonicalization needs `<link rel="canonical">`); either delete it or move any real override to per-page `canonical` frontmatter.

## New from the background audit (not yet turned into tasks — do this next)

- [ ] One redirect in `docs.json` points to a page that doesn't exist: `/new-releases/spring-2026/dashboard-versioning` → `/product-updates/spring-2026/dashboard-versioning` (real file is at `product-updates/june-2026/dashboard-versioning.mdx`, which itself isn't in nav either).
- [ ] 10 genuinely orphaned pages — no nav entry, no inbound links (see FINDINGS.md for the list). Decide: add to nav, delete, or intentionally leave unlisted.
- [ ] No `sitemap.xml`, `robots.txt`, or `llms.txt` checked into the repo. Confirm whether Mintlify's hosting auto-generates these (likely does) or whether explicit config is needed.
- [ ] Two hardcoded absolute `docs.wisdom.ai` links that should probably be root-relative, per existing convention (`setting-up-wisdom-ai/explorer-onboarding-admin-setup.mdx:28`, `using-wisdom-ai-everyday/command-palette.mdx:135` — lower priority, likely intentional).
- [ ] `setting-up-wisdom-ai/explorer-onboarding-admin-setup.mdx` is a fully orphaned page (not in nav, not linked from anywhere).

## Pilot batch drafted (descriptions below were written but NOT applied — rejected mid-edit)

Use these as a starting point when resuming #2, or rewrite from scratch:

- `ask-better-questions.mdx`: "Learn how to ask clear, specific questions in WisdomAI chat, using filters, follow-ups, and business terms to get accurate answers."
- `auditing.mdx`: "Tag chats, review the chat log, and share vetted answers to keep your team's WisdomAI conversations organized and auditable."
- `capture-knowledge-feedback.mdx`: "This guide on capturing context feedback in WisdomAI is under construction. Check back soon for instructions on this feature."
- `command-palette.mdx`: "Use the WisdomAI command palette (Cmd+K) to jump to chats, dashboards, domains, and settings, or run quick actions from anywhere."
- `knowledge-management-via-graph-ql-api.mdx`: "Use the WisdomAI GraphQL API to create, read, update, and delete domain knowledge entries that define terminology and business rules."
- `prompt-templates.mdx`: "Turn reviewed WisdomAI chat responses into reusable prompt templates, organized by topic, so Explorers can run complex analyses quickly."
- `request-help-from-admins.mdx`: "Configure a Slack channel for admin help requests, then flag inaccurate WisdomAI responses from the chat so an admin can step in."
- `schedule-dashboards-notifications.mdx`: "Subscribe to a WisdomAI dashboard to receive scheduled email updates, keep stakeholders informed, and automate recurring reports."
- `share-dashboards-and-set-access-control.mdx`: "Share WisdomAI dashboards with specific users or your whole organization, and control who can view or edit each dashboard."
- `turn-answers-into-dashboards.mdx`: "Turn WisdomAI chat responses into dashboards from the chat window or the dashboard editor to build a live, shareable reporting hub."
- `work-with-csv-files.mdx`: "Add CSV, TSV, or Excel files to a WisdomAI domain, create a private domain from a file, or attach a file to a chat to analyze it."
