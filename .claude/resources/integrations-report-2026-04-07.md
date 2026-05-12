# Integrations Docs — Branch Update Report (`wc-updates`)

**Date:** April 7, 2026
**Scope:** `integrations/` folder only
**Commits:** 5 commits since `main`

---

## Structural Change

The `integrations/embedding/` folder was renamed and reorganized to `integrations/embeddings/`, with content split into dedicated subdirectories: `iframe/`, `graphql-api/` (with `mutations/`, `queries/`, `objects/`, `subscriptions/`), and `sdk/`.

---

## Tasks Completed

### New pages — User Management (GraphQL API > Mutations > User)
- `createUsers` — includes `CreateUsersInput` schema, re-invite/role-overwrite behavior, email uniqueness gotcha, and display name limitation
- `setUserAttributes` — with warning that this replaces all DATABASE-sourced attributes
- `deleteUsersFromWorkspace`

### New pages — Queries
- `ListUsers` — including `userAttributes` with `key`, `value`, and `source` in response

### Auth (moved from Mutation to Query — matches actual schema)
- `impersonateUser` — full signature, cURL examples with and without transient attributes, security note on `impersonated_user_id`

### New concept pages
- `user-attributes.mdx` — DATABASE vs JWT sources, how to set at creation time, update via `setUserAttributes`, transient attributes at impersonation
- `graphql-primer.mdx` — POST to `/graphql`, HTTP 200 on errors, Postman setup, common mistakes
- `embedding-modes.mdx` (P0) — all four embed paths (`/embed/search`, `/embed/dashboards`, `/embed/dashboards/[id]`, `/embed/chat/[conversationId]`), `allow="microphone; camera"` requirement
- `error-handling.mdx` — HTTP 200 on failure, `ResponseStatus` shape, transport-level HTTP errors
- `token-lifecycle.mdx` — 1-hour token lifetime, full `postMessage` refresh flow with working example, switching users, redirect behavior on expired/invalid tokens
- `rbac.mdx` — how roles control edit controls in embedded views (Viewer hides edit buttons), role matrix, role IDs table, re-invite behavior warning
- `response-status.mdx` (object reference) — `ResponseStatus` type with `StatusCode` enum

### Updated pages
- `embedding.mdx` — rewritten from 2-step to 5-step flow (get access key → create user → set attributes → impersonate → embed), domain clarification note, `createUsers` re-invite behavior, email uniqueness warning
- Domain placeholder updated from `<customer>.askwisdom.ai` to `{ACCOUNT}.askwisdom.ai` with clarification that both `askwisdom.ai` and `wisdom.ai` are valid (P0 fix)

---

## Not Completed

| Item | Priority | Status |
|------|----------|--------|
| `exportDashboard`, `importDashboard`, `duplicateDashboard` pages (GraphQL API > Mutations > Dashboard) | — | Not started — no files created |

---

## Dropped (by design)

- Dashboard filter URL parameters (`/dashboards/<id>?<column_name>=<value>`) — struck through in the task list, intentionally excluded from this cycle.

---

**Summary:** 16 of 17 active task items completed. The only remaining gap is the three Dashboard export/import/duplicate mutation pages.
