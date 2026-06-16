---
name: wisdomai-writer
description: "Write and maintain WisdomAI integration documentation — GraphQL API (mutations, objects, queries, subscriptions), embeddings, iframe, and MCP server pages — for a developer audience. All rules and context are self-contained in this skill."
---

## On startup — scan and propose

When this skill is invoked without a specific task, do the following before anything else:

1. Open `resources/tasks-to-do.mdx`.
2. Scan the file for incomplete, missing, or flagged items. Do not read it linearly — look for indicators of incomplete work such as:
   - Empty or placeholder sections
   - Items marked as TODO, pending, or not started
   - Sections that reference files that do not yet exist in the integrations folder
   - Notes or comments indicating work in progress
3. Cross-reference what you find against the current state of the `integrations/` folder.
4. Propose the next 2–3 concrete tasks to the writer in order of logical priority. Format the proposal as:

---

**What I found incomplete:**

1. `[Task]` — `[Where it appears in tasks-to-do.mdx and what is missing]`
2. `[Task]` — `[Where it appears in tasks-to-do.mdx and what is missing]`
3. `[Task]` — `[Where it appears in tasks-to-do.mdx and what is missing]`

**I suggest starting with [Task 1] because [reason].** Should I proceed, or would you like to work on something else?

---

Wait for confirmation before writing anything.

---

## Project context

**Project:** WisdomAI
**Documentation platform:** Mintlify (MDX)
**Primary audience:** Software developers — assume familiarity with GraphQL, APIs, and authentication concepts. Do not over-explain foundational concepts.
**Source materials:** All content must come from files in the `resources/` folder:

| File | What it provides |
|---|---|
| `resources/tasks-to-do.mdx` | Master plan — incomplete items drive the writing agenda |
| `resources/dashboard-mutations-questions.md` | GraphQL mutation details and open questions |
| `resources/embedded-user-management.pdf` | Embedded user management flows and specifications |
| `resources/role-and-permission-matrix.md` | Role definitions, permission scopes, and access matrix |

Do not invent behavior, parameters, or descriptions. If information is missing from the source materials, raise a flag.

---

## Information architecture

The `integrations/` folder is the output destination. Maintain this structure exactly — do not create folders or files outside of it without confirming with the writer.

```
integrations/
├── connect-to-slack.mdx
├── mcp-server/
│   ├── MCP-Server.mdx
│   └── tools/                 # One page per MCP tool
└── embeddings/
    ├── embedding.mdx
    ├── user-attributes.mdx
    ├── graphql-api/
    │   ├── GraphQL-API.mdx
    │   ├── graphql-primer.mdx
    │   ├── user-management.mdx
    │   ├── mutations/
    │   │   ├── agent/             # One page per agent mutation
    │   │   ├── chat/              # One page per chat mutation
    │   │   ├── connection/        # One page per connection mutation
    │   │   ├── dashboard/         # One page per dashboard mutation
    │   │   ├── domain/            # One page per domain mutation
    │   │   └── user/              # One page per user mutation
    │   ├── objects/               # One page per object type
    │   ├── queries/
    │   │   ├── auth/              # One page per auth query
    │   │   ├── connection/        # One page per connection query
    │   │   ├── dashboard/         # One page per dashboard query
    │   │   └── user/              # One page per user query
    │   └── subscriptions/         # One page per subscription
    ├── iframe/
    │   ├── chat/                  # One page per chat iframe topic
    │   └── dashboard/             # One page per dashboard iframe topic
    └── sdk/
        └── sdk-overview.mdx
```

### Folder and file naming rules

- All folder names: lowercase, hyphenated (`graphql-api`, `mcp-server`)
- All file names: lowercase, hyphenated, `.mdx` extension
- One concept per file — do not combine multiple mutations, queries, or objects into a single page
- If a file's correct location is unclear, ask before creating it

---

## Frontmatter

Every page must include the following frontmatter:

```yaml
---
title: "{Page title}"
---
```

- `title`: 60 characters or fewer. Use the exact name of the mutation, query, object, or feature.

---

## Page types and structure

### GraphQL mutation page

One page per mutation.

```
---
title: "{MutationName}"
description: "Use the {MutationName} mutation to {what it does}."
---

# {MutationName}

One sentence: what this mutation does and when a developer would use it.

## Signature

```graphql
{mutation signature}
```

## Input fields

| Field | Type | Required | Description |
|---|---|---|---|
| `{field}` | `{type}` | Yes / No | {Description} |

## Response fields

| Field | Type | Description |
|---|---|---|
| `{field}` | `{type}` | {Description} |

## Example request

```graphql
{example mutation call with variables}
```

## Example response

```json
{example response}
```

## Related articles

<CardList cols={3}>
  <Card title="{title}" icon="{icon}" link="{/path}">
    {One sentence.}
  </Card>
</CardList>
```

### GraphQL query page

Same structure as mutation page — replace "mutation" with "query" throughout.

### GraphQL object page

```
---
title: "{ObjectName}"
description: "Reference for the {ObjectName} object type."
---

# {ObjectName}

One sentence: what this object represents in the WisdomAI data model.

## Fields

| Field | Type | Description | Notes |
|---|---|---|---|
| `{field}` | `{type}` | {Description} | {Constraints or caveats} |

## Used by

List the mutations, queries, or subscriptions that return or accept this object.

## Related articles

<CardList cols={3}>
  <Card title="{title}" icon="{icon}" link="{/path}">
    {One sentence.}
  </Card>
</CardList>
```

### GraphQL subscription page

```
---
title: "{SubscriptionName}"
description: "Use the {SubscriptionName} subscription to {what it does}."
---

# {SubscriptionName}

One sentence: what this subscription listens for and when a developer would use it.

## Signature

```graphql
{subscription signature}
```

## Payload fields

| Field | Type | Description |
|---|---|---|
| `{field}` | `{type}` | {Description} |

## Example

```graphql
{example subscription with variables}
```

## Related articles

<CardList cols={3}>
  <Card title="{title}" icon="{icon}" link="{/path}">
    {One sentence.}
  </Card>
</CardList>
```

### Concept or overview page

Use for `GraphQL-API.mdx`, `graphql-primer.mdx`, `embedding.mdx`, and similar overview pages.

```
---
title: "{Topic}"
description: "{One sentence: what this page covers and who it is for.}"
---

# {Topic}

Short introduction: what this is and why it matters to the developer.
Do not bold words in the introduction.

## {Section}

{Content}

## Related articles

<CardList cols={3}>
  <Card title="{title}" icon="{icon}" link="{/path}">
    {One sentence.}
  </Card>
</CardList>
```

---

## Writing rules

### Voice and tone
- Write in second person ("you", "your").
- Use active voice. Avoid passive constructions.
- Use present tense for all descriptions of product behavior.
- Professional but direct — this is a developer audience. Do not over-explain. Do not use filler phrases.
- Do not use em dashes. Use commas, colons, or parentheses instead.

### Formatting
- **Bold** for UI elements, buttons, and navigation paths only.
- Do not bold words in introduction paragraphs.
- `code` for field names, parameter names, file paths, and code values.
- Quotation marks for exact values the user must enter word for word.
- All code blocks must include the language tag (`graphql`, `json`, `bash`, etc.).
- Headings in sentence case. Imperative verbs where possible.
- No H4 or deeper headings. Restructure if needed.

### Images and alt text

Every image in an MDX file — whether written as `![alt](path)`, `<img alt="..." />`, or an `<img>` inside a Mintlify `<Frame>` — must have descriptive alt text that meets all of the following:

- **Describe what the user sees, not what the image is.** Write what is displayed on screen, not a label like "screenshot of the Domains page." A reader who cannot see the image should understand what is visible.
- **Name the key UI elements shown.** If a dropdown is open, name its options. If a table is visible, name its columns or the data context. If a button is highlighted, say so.
- **Stay under 125 characters.** Count the characters; trim if needed.
- **Do not start with "Screenshot", "Image", "Photo", or "A screenshot of".** Start with the subject.

**Correct:**
```
Add Tile dropdown showing Visualization, SQL Query, and Summary options on a sales dashboard
```

**Incorrect:**
```
Screenshot of the add widget menu
```
```
Dashboard with dropdown open
```

This rule applies to every image tag you write or edit. If you encounter an existing image with missing or non-compliant alt text while working on a file, fix it in the same edit. Do not leave non-compliant alt text in a file you have touched.

---

### Terminology
- **WisdomAI** — always capitalised exactly this way.
- Use exact names for mutations, queries, objects, and subscriptions as they appear in the source materials. Do not paraphrase or shorten them.
- Role and permission names must match `resources/role-and-permission-matrix.md` exactly.
- If a term appears in the content but is not confirmed in the source materials, raise a flag.

### Words and phrases to avoid
- `easily`, `simply`, `just`, `obviously`
- `leverage` — use "use" instead
- `robust`, `seamless`, `delve`, `unlock`, `cutting-edge`
- `important` — if something matters, show why instead of labelling it

---

## Flags

Raise a flag — do not silently resolve — when any of the following occur:

| Situation | Flag format |
|---|---|
| Information is missing from source materials | `[Note: Need clarification on {specific topic}.]` |
| A term or field name cannot be verified | `FLAG: Unverified term — "{term}" not confirmed in source materials.` |
| A file's correct location in the information architecture is unclear | `FLAG: Path unclear — confirm location before saving.` |
| Source materials contradict each other | `FLAG: Conflict — {topic} is described differently across sources. Clarification needed.` |

---

## Output rules

- Save each completed page to its correct path in the `integrations/` folder.
- One page at a time — do not batch multiple pages into a single output.
- After saving, confirm the file path in your response.
- After completing a page, update `resources/tasks-to-do.mdx` to mark the relevant item as done.
- Do not mark a page as done if it contains unresolved flags.
- After saving each page, append an entry to `resources/writing-log.md`. If the file does not exist, create it with the header below before appending. Each entry must follow this format exactly:

```
# Writing log

| Date | File | Task reference |
|------|------|----------------|
```

```
| {YYYY-MM-DD} | `{integrations/path/to/file.mdx}` | {Short description matching the item in tasks-to-do.mdx} |
```

Append one row per page saved. Do not modify existing rows.