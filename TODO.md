# Search bar / SEO — TODO

Branch: `search-nav-improvements` (created from `staging`).

## Client constraint (2026-07-31)

Client does not want `description` frontmatter on articles. Dropped entirely — `keywords`, `boost`, and `navigation.groups[].boost` don't depend on `description`, so #2 below is cancelled rather than deferred. See FINDINGS.md for the full field breakdown.

- [x] **1. Pull Mintlify Search Analytics data** — Optimize → Analytics → Search in the dashboard. Export queries with no results and queries with low click-through rate. Use this to target #3 instead of guessing. *(Still not done this session — no dashboard access. Do before writing more keywords.)*
- [~] ~~**2. Add `description` frontmatter across the site**~~ — **cancelled per client, 2026-07-31.** Client does not want descriptions in article frontmatter.
- [ ] **3. Expand `keywords` frontmatter coverage** — only 16 of 214 pages have it. Target the no-result/low-CTR terms from #1.
- [x] **4. Define a `boost` convention and apply it deliberately** — done for the "chat" cannibalization case (see below). Still need a general convention doc (e.g. 2-5 for cornerstone pages) for future pages.
- [~] **5. Resolve "chat" query cannibalization — IN PROGRESS, not solved yet as of 2026-07-31 EOD.** See "Session status" section below for the full state and the exact next step.
- [ ] **6. Add keywords to `chat/overview.mdx` before ever unhiding it** — it's `hidden: true`, titled exactly "Chat Overview" on this branch, placeholder content. The real, finished version of this page (title "Overview", Chat V2 content) already exists on the `chat-preview` branch, not yet merged anywhere. **Decision needed:** pull that real content into this branch now (to test full desired ranking: Chat Overview first, Ask Better Questions second), or wait for `chat-preview` to merge on its own timeline. Asked mid-session, deferred — revisit next week.
- [ ] **7. Remove or fix the inert `canonical` metatag** in `docs.json` → `seo.metatags.canonical`. `<meta name="canonical">` isn't a real signal (canonicalization needs `<link rel="canonical">`); either delete it or move any real override to per-page `canonical` frontmatter.
- [x] **8. "sql" also surfacing for a "chat" query — root-caused.** It wasn't a separate page. `integrations/user-management/rbac.mdx` has an `<Accordion title="Chat">` (line 74) listing permission rows named `chat:execute-sql` and `chat:edit-sql` — that's the literal source of the "sql" text appearing alongside "chat" results. Addressed by de-prioritizing this page (see below).

## Session status — end of day 2026-07-31, resume here next week

**Goal (client's words):** searching "chat" should surface only the Chat Overview page and Ask Better Questions at the top, "then maybe any of the others."

**What's been tried, in order, on the `wisdomai-search-nav-improvements.mintlify.site` preview:**

1. `ask-better-questions.mdx` boost `3 → 10`, plus `navigation.groups[].boost: 0.3` on the GraphQL API and MCP Server nav groups (docs.json). Result: killed the GraphQL/MCP "Chat" results, but three *other* pages with exact `## Chat` / `<Accordion title="Chat">` headings still outranked us: RBAC for Users, Components (SDK), Auditing ("Tag chats").
2. Renamed `ask-better-questions.mdx`'s `### Ask a question` heading to `### Chat with WisdomAI`, keeping content unchanged, so our page has its own exact "Chat" heading match too. **Result: no visible change** — same 3 competitors still on top.
3. Added `boost: 0.15` to all three competing pages (`auditing.mdx`, `rbac.mdx`, `sdk-components.mdx`). **Result: still not working** as of the last live test.

**Critical new clue from the user, not yet investigated:** searching the literal single word **"chat" fails**, but typing a partial phrase like **"chat wi"** (prefix of "chat with") *does* successfully surface "Chat with WisdomAI." This strongly suggests Mintlify's relevance scoring treats a short, exact one-word heading match (a heading that is *just* "Chat") as higher-relevance than a longer heading that merely *contains* "chat" as one of several words ("Chat with WisdomAI") — independent of boost, or at least such that boost:10 vs boost:0.15 on the competitors still isn't enough to close that gap for the bare single-token query. A prefix/phrase query like "chat wi" apparently matches far more specifically against our heading's exact word sequence, which is why it works.

**Next step to try first:** Since a short exact-match heading seems to dominate regardless of boost, consider either (a) also giving `ask-better-questions.mdx` a heading that is the bare word `## Chat` (not `### Chat with WisdomAI`) to compete on truly equal lexical terms, or (b) pushing the three competitors' boost even lower (e.g. `0.05` or `searchable: false` instead of `boost: 0.15`) since 0.15 evidently wasn't enough. Test one variable at a time so it's clear which change moves the needle — so far every change this session has been layered on the previous one without isolating which one (if any) had an effect, which makes it hard to tell if `boost: 0.15` is even being applied server-side yet vs. still propagating.

**Also unconfirmed:** whether the preview had actually finished rebuilding before each test. Before trying anything new, check the Mintlify dashboard's Previews list (Activity → Previews) to confirm the latest commit (`1f07d19` as of this session) shows a successful, recent build for `search-nav-improvements` before concluding a change "didn't work."

## New from the background audit (not yet turned into tasks — do this next)

- [ ] One redirect in `docs.json` points to a page that doesn't exist: `/new-releases/spring-2026/dashboard-versioning` → `/product-updates/spring-2026/dashboard-versioning` (real file is at `product-updates/june-2026/dashboard-versioning.mdx`, which itself isn't in nav either).
- [ ] 10 genuinely orphaned pages — no nav entry, no inbound links (see FINDINGS.md for the list). Decide: add to nav, delete, or intentionally leave unlisted.
- [ ] No `sitemap.xml`, `robots.txt`, or `llms.txt` checked into the repo. Confirm whether Mintlify's hosting auto-generates these (likely does) or whether explicit config is needed.
- [ ] Two hardcoded absolute `docs.wisdom.ai` links that should probably be root-relative, per existing convention (`setting-up-wisdom-ai/explorer-onboarding-admin-setup.mdx:28`, `using-wisdom-ai-everyday/command-palette.mdx:135` — lower priority, likely intentional).
- [ ] `setting-up-wisdom-ai/explorer-onboarding-admin-setup.mdx` is a fully orphaned page (not in nav, not linked from anywhere).

## Two more client-reported issues (2026-07-31, not yet actionable from code alone)

- [ ] **Search bar only shows 3 results.** Root cause: "Maximum search results" is a Mintlify **dashboard-only** setting (app.mintlify.com/settings/deployment/search → "Results per query", default 6, range 1-100). Not stored in this repo — nothing in `docs.json` or frontmatter controls it. If the client wants this changed, it has to happen in the dashboard, by whoever has access, not via a code change here.
- [ ] **Recent/last searches persist in the search bar and client wants this off.** No documented Mintlify config (frontmatter, `docs.json`, or dashboard setting) was found that controls this in the public docs. Likely default client-side behavior of the search modal. Next steps: (a) check the dashboard search settings page directly in case there's a toggle not covered in public docs, (b) if truly not configurable, file this as a feature request / support ticket with Mintlify rather than hacking it with unsupported custom JS against localStorage.
