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

### 3. First round verified on the live preview

After deploying the branch preview, searching "chat" no longer surfaces the GraphQL API or MCP "Chat Tool" reference pages. It now surfaces section headings named "Chat" on three other pages instead (RBAC permissions, SDK Components, and Auditing), which still outrank "Ask Better Questions."

This also explains an earlier observation: the "sql"-related result seen alongside "chat" searches wasn't a separate page. It's a "Chat" permissions section on the RBAC reference page that lists permission names like `chat:execute-sql` and `chat:edit-sql`.

### 4. Added a matching section heading to "Ask Better Questions"

**File:** `using-wisdom-ai-everyday/ask-better-questions.mdx`
**Change:** Renamed the "Ask a question" subsection to "Chat with WisdomAI." Content is unchanged.

The three competing results above all rank well because they have a section literally titled "Chat." Giving "Ask Better Questions" the same exact wording, combined with its higher boost value, lets it compete on equal terms. No other page links to this section directly, so nothing else needed updating.

### 5. Second round verified: heading change alone wasn't enough

Same three pages (RBAC, SDK Components, Auditing) still ranked above "Ask Better Questions" for a "chat" search after change #4. Since Mintlify caps the recommended boost value at 10 (already applied to "Ask Better Questions"), the more effective lever is de-prioritizing the specific competing pages directly, rather than pushing our own page's boost past what Mintlify recommends.

**Files:** `using-wisdom-ai-everyday/auditing.mdx`, `integrations/user-management/rbac.mdx`, `integrations/embeddings/sdk/sdk-components.mdx`
**Change:** Added `boost: 0.15` to each. This lowers their ranking specifically, on top of the earlier GraphQL API / MCP Server group-level change. None of these three pages were hidden or made unsearchable, they're just weighted lower for general searches. Auditing keeps its own "chat history" / "chat log" keywords for its own relevant searches, just ranks lower for the single word "chat."

### 6. Third round verified: still not resolved, work in progress

After change #5, the same three pages still ranked above "Ask Better Questions" on the live preview. This is not yet solved. Status honestly is: two rounds of targeted changes have not yet produced the desired ranking, and we've identified a promising new lead (see below) that needs testing before the next change.

**New lead:** searching the single word "chat" does not surface "Ask Better Questions," but searching a partial phrase like "chat wi" (the start of "chat with") does. This suggests Mintlify's search favors a short heading that is an exact one-word match over a longer heading that merely contains the same word, in a way that the boost values used so far haven't overcome. Next step is to test giving "Ask Better Questions" a heading that is the bare word "Chat," to see if that closes the gap.

## Constraints honored

- No `description` frontmatter was added to any article, per client preference. All improvements use search-ranking fields (`keywords`, `boost`) instead.

## Still open

- **The core goal is not yet met.** Client's target: searching "chat" should surface the Chat Overview page and "Ask Better Questions" first, then other results after. Three rounds of boost/heading changes have narrowed the competition (removed the GraphQL/MCP developer pages, identified and are de-prioritizing three other competing pages) but haven't yet gotten "Ask Better Questions" to the top. In progress, resuming next session.
- **Chat Overview page** isn't part of this branch yet. The finished version exists on a separate branch (`chat-preview`) and hasn't been brought over or unhidden here. Needs a decision on timing before it can be part of the "chat" search results.
- **Search results per query** currently shows 3 results. This is controlled in the Mintlify dashboard (not in the docs repository), so it's a separate, one-time setting to confirm with whoever has dashboard access.
- **Recent searches persisting in the search bar.** No configuration option for this was found in Mintlify's current documentation. Next step is to check the dashboard directly, and if there's no toggle, raise it with Mintlify as a feature request.

## Verification plan

Local preview (`mint dev`) doesn't support search, so changes are verified on the deployed branch preview after each push. Next session: confirm the latest push has actually finished building before testing (check the Previews list in the Mintlify dashboard), then test one change at a time so it's clear which one moves the ranking.
