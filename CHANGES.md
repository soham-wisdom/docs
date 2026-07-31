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

## Constraints honored

- No `description` frontmatter was added to any article, per client preference. All improvements use search-ranking fields (`keywords`, `boost`) instead.

## Still open

- **Search results per query** currently shows 3 results. This is controlled in the Mintlify dashboard (not in the docs repository), so it's a separate, one-time setting to confirm with whoever has dashboard access.
- **Recent searches persisting in the search bar.** No configuration option for this was found in Mintlify's current documentation. Next step is to check the dashboard directly, and if there's no toggle, raise it with Mintlify as a feature request.

## Verification plan

Local preview (`mint dev`) doesn't support search, so changes are verified on the deployed branch preview after each push. Next: push this heading change and confirm "Ask Better Questions" ranks at or near the top for a "chat" search.
