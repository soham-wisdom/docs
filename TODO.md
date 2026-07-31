# Search bar / SEO — TODO

Branch: `search-nav-improvements` (created from `staging`).

## Client constraint (2026-07-31)

Client does not want `description` frontmatter on articles. Dropped entirely — `keywords`, `boost`, and `navigation.groups[].boost` don't depend on `description`, so #2 below is cancelled rather than deferred. See FINDINGS.md for the full field breakdown.

- [x] **1. Pull Mintlify Search Analytics data** — Optimize → Analytics → Search in the dashboard. Export queries with no results and queries with low click-through rate. Use this to target #3 instead of guessing. *(Still not done this session — no dashboard access. Do before writing more keywords.)*
- [~] ~~**2. Add `description` frontmatter across the site**~~ — **cancelled per client, 2026-07-31.** Client does not want descriptions in article frontmatter.
- [ ] **3. Expand `keywords` frontmatter coverage** — only 16 of 214 pages have it. Target the no-result/low-CTR terms from #1.
- [x] **4. Define a `boost` convention and apply it deliberately** — done for the "chat" cannibalization case (see below). Still need a general convention doc (e.g. 2-5 for cornerstone pages) for future pages.
- [x] **5. Resolve "chat" query cannibalization** — root cause found: it wasn't `auditing.mdx` overlapping, it was ~90 developer-reference pages (GraphQL API `Chat` mutations + 4 `ChatMessage*` objects, MCP `Chat Tool`) with exact-title/high-density "chat" matches out-ranking the boosted consumer page. Fixed 2026-07-31:
  - `docs.json` → `navigation` → Developers tab → **GraphQL API** group: added `"boost": 0.3` (cascades to Objects/Queries/Mutations/Subscriptions, including the 4 `ChatMessage*` object pages and the `Chat` mutations subgroup).
  - `docs.json` → Admins tab → Integrations → **MCP Server** group: added `"boost": 0.3` (cascades to the Tools subgroup, including `chat.mdx` / "Chat Tool").
  - `using-wisdom-ai-everyday/ask-better-questions.mdx`: `boost` raised from `3` → `10` (per-page frontmatter boost always wins over inherited group boost, so this is unaffected by the two changes above).
  - **Not yet verified live** — no `mint dev`/browser access this session. Test searching "chat" before/after via `mint dev` (after `mint login`) or on the deployed preview once this branch ships.
  - Tradeoff to be aware of: de-prioritizing the whole GraphQL API and MCP Server groups also lowers pages like the "GraphQL API" overview and "MCP Server" overview for their own exact-title searches. Boost of 0.3 de-prioritizes, doesn't exclude, so they should still appear, just not rank #1 for unrelated generic terms. Confirm this is an acceptable tradeoff once testable.
- [ ] **6. Add keywords to `chat/overview.mdx` before ever unhiding it** — it's `hidden: true`, titled exactly "Chat Overview", placeholder content. If unhidden as-is, its exact title match will out-rank the boosted ask-better-questions.mdx for any "chat" query. (No `description` per client constraint — use `keywords`/`boost` only.)
- [ ] **7. Remove or fix the inert `canonical` metatag** in `docs.json` → `seo.metatags.canonical`. `<meta name="canonical">` isn't a real signal (canonicalization needs `<link rel="canonical">`); either delete it or move any real override to per-page `canonical` frontmatter.
- [ ] **8. "sql" also surfacing for a "chat" query** — client-reported, not yet reproduced or root-caused this session (unlike the dev-docs cannibalization above, no file-level explanation found for this one). Needs live/empirical testing to confirm it's still happening after the boost changes above, then investigate further if so.

## New from the background audit (not yet turned into tasks — do this next)

- [ ] One redirect in `docs.json` points to a page that doesn't exist: `/new-releases/spring-2026/dashboard-versioning` → `/product-updates/spring-2026/dashboard-versioning` (real file is at `product-updates/june-2026/dashboard-versioning.mdx`, which itself isn't in nav either).
- [ ] 10 genuinely orphaned pages — no nav entry, no inbound links (see FINDINGS.md for the list). Decide: add to nav, delete, or intentionally leave unlisted.
- [ ] No `sitemap.xml`, `robots.txt`, or `llms.txt` checked into the repo. Confirm whether Mintlify's hosting auto-generates these (likely does) or whether explicit config is needed.
- [ ] Two hardcoded absolute `docs.wisdom.ai` links that should probably be root-relative, per existing convention (`setting-up-wisdom-ai/explorer-onboarding-admin-setup.mdx:28`, `using-wisdom-ai-everyday/command-palette.mdx:135` — lower priority, likely intentional).
- [ ] `setting-up-wisdom-ai/explorer-onboarding-admin-setup.mdx` is a fully orphaned page (not in nav, not linked from anywhere).

## Two more client-reported issues (2026-07-31, not yet actionable from code alone)

- [ ] **Search bar only shows 3 results.** Root cause: "Maximum search results" is a Mintlify **dashboard-only** setting (app.mintlify.com/settings/deployment/search → "Results per query", default 6, range 1-100). Not stored in this repo — nothing in `docs.json` or frontmatter controls it. If the client wants this changed, it has to happen in the dashboard, by whoever has access, not via a code change here.
- [ ] **Recent/last searches persist in the search bar and client wants this off.** No documented Mintlify config (frontmatter, `docs.json`, or dashboard setting) was found that controls this in the public docs. Likely default client-side behavior of the search modal. Next steps: (a) check the dashboard search settings page directly in case there's a toggle not covered in public docs, (b) if truly not configurable, file this as a feature request / support ticket with Mintlify rather than hacking it with unsupported custom JS against localStorage.
