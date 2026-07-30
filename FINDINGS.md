# Search bar / SEO — Findings

Session date: 2026-07-30. Branch: `search-nav-improvements`. Trigger: reports that Mintlify's in-product search bar isn't respecting `keywords` or `boost` frontmatter properly.

## Headline conclusion

Not a Mintlify defect — `keywords` and `boost` work exactly as documented. The real issue is coverage: they've been applied to a tiny, ad hoc slice of the site, so almost no searches benefit from either lever, and where they do overlap, nothing coordinates them.

## Coverage numbers (corrected)

Repo has 630 `.mdx` files total, but that count includes stale duplicate worktree checkouts (`.claude/worktrees/*`) and 2 non-page snippet files. The real, unique page count is **214**.

| Field | Pages with it | Out of | Coverage |
|---|---|---|---|
| `description` | 3 (2 are unedited placeholders — `"WisdomAI"` and `"Description of your new file."`; only 1 is a real description) | 214 | ~1.4% (effectively ~0.5%) |
| `keywords` | 16 | 214 | ~7.5% |
| `boost` | 1 | 214 | ~0.5% |

Per-section breakdown of missing `description`/`keywords`:
- `integrations/` (101 files, ~80 of them GraphQL API): description=0, keywords=4
- `setting-up-wisdom-ai/` (31): description=1, keywords=2
- `product-updates/` (20): description=0, keywords=2
- `getting-started/` (13): description=0, keywords=1
- `using-wisdom-ai-everyday/` (11): description=0, keywords=2
- `manage-account/` (12): description=2 (both placeholders), keywords=3
- `improve-wisdom-ai-responses/` (8): description=0
- `advanced-features/` (3): description=0, keywords=1
- `settings/` (3): description=1 (real one — `connected-apps.mdx`)

## Specific risk: keyword cannibalization around "chat"

- `using-wisdom-ai-everyday/ask-better-questions.mdx` — `keywords: ["chat", "use the chat", "chatting", "ask questions"]`, `boost: 3`. This is the **only page in the entire site with a boost value**, added 2026-07-15 (commits `908a25e`, `03ded13`), live on `main` for ~2 weeks — not a caching/reindex-lag issue.
- `using-wisdom-ai-everyday/auditing.mdx` — `keywords: ["chat history", "chat log", "delete chat"]`, no boost. Independently targets overlapping "chat" terms with no coordination.
- `chat/overview.mdx` — title is literally "Chat Overview". Currently `hidden: true` (correctly excludes it from search today), placeholder content ("this guide is being finalized"), no description/keywords. **Landmine**: if this page is ever unhidden as-is, its exact title match will out-rank the boosted `ask-better-questions.mdx` for any "chat" query, silently undoing the boost work. Fix its frontmatter *before* unhiding it.
- File history: `chat/overview.mdx` was added as a hidden stub in commit `918c8f5` ("docs: add hidden stub pages for Dashboard Tabs, Instant Filters, Chat Overview").

## docs.json state

- No `search` key exists at all (no custom prompt, no filters, no groups[].boost) — everything is Mintlify defaults except the one hand-edited page above.
- `seo.metatags` sets `"canonical": "https://docs.wisdom.ai"`. This is inert: canonicalization is read from `<link rel="canonical">`, not a `<meta name="canonical">` tag, so this entry does nothing (not actively harmful, just dead config). History: was `"https:/docs.wisdom.ai/"` (typo'd single slash + trailing slash) until commit `efd10cf` fixed the trailing slash; the missing-second-slash typo also got fixed at some point since current value is correct.
- One redirect points to a nonexistent page: `/new-releases/spring-2026/dashboard-versioning` → `/product-updates/spring-2026/dashboard-versioning`. That destination file doesn't exist — the real file lives at `product-updates/june-2026/dashboard-versioning.mdx`, which itself isn't in the nav (the June 2026 nav group currently lists only `june-features`).
- 44 redirects total, mostly slug renames and the old `/new-releases/*` → `/product-updates/*` migration.

## Orphan pages (no nav entry, computed by diffing docs.json page slugs against files on disk)

13 candidates found; most have an explanation, but 10 are genuinely dead:
- Reachable via other means (not real orphans): `manage-account/contact-support` (linked via global Support anchor + 5 pages), `chat/overview` (deliberately hidden by design), `integrations/user-management/roles` (linked from 1 page).
- **Genuinely orphaned (zero inbound links, no nav entry) — 10 files**, including:
  - `dashboards/instant-filters`, `dashboards/tabs`
  - `product-updates/february-2026/chat-with-dashboard`
  - `product-updates/june-2026/dashboard-versioning`, `product-updates/june-2026/june-changelog`
  - `setting-up-wisdom-ai/best-practices-testing-and-experimentation`
  - `setting-up-wisdom-ai/explorer-onboarding-admin-setup` (also has a hardcoded absolute link, see below)
  - `setting-up-wisdom-ai/spring-2026/parameterized-agents` (stray duplicate of the nav-linked `product-updates/spring-2026/parameterized-agents.mdx`, unformatted title "parameterized-agents")
  - `using-wisdom-ai-everyday/capture-knowledge-feedback`

## Hardcoded / legacy links

- No remaining `docs.askwisdom.ai` references in the live tree (only in stale worktree copies under `.claude/worktrees/`, not part of the served site). Fixed in commit `444fdd7`.
- `askwisdom.ai` (no `docs.` subdomain) is still used extensively, but appears to be **legitimate** — email addresses, tenant-domain examples in GraphQL API docs, and `integrations/developers.mdx:40` explicitly states both `wisdom.ai` and `askwisdom.ai` are valid tenant domains. Not flagged as a bug, just noting it's intentional dual-domain usage.
- Two hardcoded absolute `https://docs.wisdom.ai/...` links that could be root-relative per the convention used elsewhere: `setting-up-wisdom-ai/explorer-onboarding-admin-setup.mdx:28`, `using-wisdom-ai-everyday/command-palette.mdx:135` (this one is an intentional "open docs in new tab" link, lower priority).
- The global "WisdomAI" anchor in `docs.json` (line 24) points to `https://www.askwisdom.ai/` — a third, different domain from the canonical `docs.wisdom.ai`. Not necessarily wrong, just worth knowing it's a third domain in play.

## Sitemap / robots.txt / llms.txt

None of these exist anywhere in the repo (checked repo-wide). Mintlify auto-generates a sitemap and llms.txt at hosting time on some plans, but nothing is explicit/checked-in here — unconfirmed whether that's currently happening for this deployment.

## Ask Assistant button next to search bar — history

Implemented entirely via custom CSS in `style.css` (root), not via any docs.json field:

```css
#assistant-entry,
#assistant-entry-mobile {
  display: none;
}
[data-component-part="search-ask-ai-button"] {
  display: none;
}
```

Timeline (all within one week, July 8–15, 2026):
1. `4929976` "Hide AI assistant button next to search bar" (Jul 9)
2. `d32799a` "Hide Ask Assistant CTA inside search modal" (Jul 9)
3. `1966418` "Restore AI assistant button next to search bar" (Jul 15) — removed the topbar hide rule, kept the in-modal CTA hidden
4. `71b8201` "Revert 'Restore...'" (Jul 15, same day) — put the topbar hide rule back

**Current live state: both the standalone assistant button and the in-modal "Ask Assistant" CTA are hidden.** This is a CSS visibility hack (assistant not disabled at config level, just hidden from these two entry points), not a bug — but the back-and-forth on the same day suggests this was genuinely undecided, not settled policy. Worth confirming this is still the desired state.

Related, not yet shipped: a gitignored, uncommitted file `.mintlify/Assistant.md` exists locally, added to `.gitignore` in commit `1d68ede` with the comment "Mintlify assistant instructions (not ready to ship)". Defines an assistant persona/tone/terminology prompt. Not part of the tracked repo, not live — flagging as in-progress work, not current production config.

## Mintlify platform incident (context, not a cause)

[Mintlify status incident](https://status.mintlify.com/incidents/01KV42MPHV6D8X55G0JBFPGH9E) on 2026-06-14: search results rendered but weren't clickable. Reported 10:04 PM, resolved same night (11:40 PM). Unrelated to ranking/relevance — just noting it happened in case it's part of why search "felt broken" recently.

## What still needs live/empirical testing (couldn't do this session)

No browser or Mintlify Search API access this session. Mintlify's own Search Analytics (Optimize → Analytics → Search in the dashboard) shows queries with no results and low click-through rate — that's the objective way to find where keywords/boost are actually needed, instead of guessing from file coverage alone. Do this before writing more frontmatter (see TODO.md #1).

## Local dev note

`mint dev` local preview search uses the *same* indexed content as the deployed site, provided you're logged in via `mint login` first — so local testing should be a valid proxy for production search behavior, not a separate/simpler mechanism. (Confirmed from Mintlify docs, not tested live — `mint` CLI wasn't found installed in this environment.)
