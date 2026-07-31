# Search Improvements — Change Log

This document tracks changes made to improve in-product search results, for review before final client presentation.

## Applied changes

### 1. Increased search priority for "Ask Better Questions"

**File:** `using-wisdom-ai-everyday/ask-better-questions.mdx`
**Change:** Search boost value raised from 3 to 10.

This page is the main guide for using chat effectively. Raising its boost value increases how highly it ranks when someone searches for terms like "chat" or "ask questions."

### 2. Balanced search weighting for the Developer reference sections

**File:** `docs.json`
**Change:** Added a search weighting value (0.3) to the GraphQL API and MCP Server reference groups.

The Developer tab contains detailed technical reference pages (API objects, mutations, tool specs) that share vocabulary with everyday terms like "chat." This change adjusts their relative weight in general searches so that guide-style content surfaces first for general terms, while developer content continues to rank normally for developer-specific searches (for example, "ChatMessage" or "GraphQL mutation"). No pages were removed or hidden; every page remains fully searchable.

## Constraints honored

- No `description` frontmatter was added to any article, per client preference. All improvements use search-ranking fields (`keywords`, `boost`) instead.

## Still open

- **Search results per query** currently shows 3 results. This is controlled in the Mintlify dashboard (not in the docs repository), so it's a separate, one-time setting to confirm with whoever has dashboard access.
- **Recent searches persisting in the search bar.** No configuration option for this was found in Mintlify's current documentation. Next step is to check the dashboard directly, and if there's no toggle, raise it with Mintlify as a feature request.
- **"sql" appearing in results for a "chat" search.** Not yet reproduced or explained. Needs a live test on the deployed preview to confirm current behavior before further changes.

## Verification plan

Local preview (`mint dev`) doesn't support search, so these changes will be verified on the deployed preview after pushing this branch. Plan: search "chat" and confirm "Ask Better Questions" appears first, then check whether the "sql" result still appears.
