# Search & SEO Remediation Report

This report summarizes the audit findings and the fixes applied to the WisdomAI Mintlify docs site during this session.

## 1. Starting point

`audit.js` (pre-existing in this repo) scanned 214 pages and produced `seo-audit-report.md` / `seo-audit-report.json`, surfacing **261 findings**:

| Issue | Count | Severity |
|---|---|---|
| MISSING_DESCRIPTION | 211 | warning |
| DUPLICATE_TITLE | 8 groups | warning |
| NO_FRONTMATTER_BLOCK | 2 | error |
| MISSING_TITLE | 2 | warning |
| ORPHAN_PAGE (not in docs.json nav) | 15 | info |
| THIN_CONTENT (<40 words) | 11 | info |
| HIDDEN_TRUE (noindex forced) | 7 | info |
| KEYWORD_DUPLICATES_TITLE | 3 | info |
| DESCRIPTION_LENGTH (too short/placeholder) | 2 | info |

The two `NO_FRONTMATTER_BLOCK` / `MISSING_TITLE` errors were `README.md` and `seo-audit-report.md` — a repo readme and the audit's own output, not real Mintlify content pages.

## 2. Triage: programmatic vs. manual

**Fixed programmatically:**
- `MISSING_DESCRIPTION` / too-short or placeholder `DESCRIPTION_LENGTH` — generate a 50–160 char description from the page's first real prose paragraph.
- `KEYWORD_DUPLICATES_TITLE` — drop keywords that just repeat the title.
- `KEYWORDS_EMPTY`, `BOOST_ZERO_OR_NEGATIVE`, `BOOST_EXTREME`, `BOOST_NOT_NUMBER` — data-hygiene rules (none of these existed in the current content, but the fixer handles them defensively).

**Left for manual/content review** (require human judgment, not attempted):
- `DUPLICATE_TITLE` — renaming risks meaning/URLs; needs a human to pick a distinguishing title.
- `ORPHAN_PAGE` — whether to add a page to nav is an information-architecture decision.
- `THIN_CONTENT` — needs someone to actually write more content.
- `HIDDEN_TRUE` — pages intentionally marked hidden while being finalized; not a bug.
- `README.md` / `seo-audit-report.md` — excluded outright, not Mintlify pages.

## 3. `fix-seo.js`

A new Node script (`fix-seo.js`, using the `gray-matter`/`glob` deps already in `package.json`) applies the programmatic fixes above:

- Scans the same `**/*.{md,mdx}` glob as `audit.js` (excluding `node_modules`, `.git`, `snippets`).
- For each page: strips MDX/JSX noise (imports, code fences, tags, links, images, headings) from the body, takes the first prose paragraph, and trims it to a 50–160 character description at a real sentence boundary (careful not to split on periods inside emails/URLs/abbreviations like `askwisdom.ai`).
- Drops keyword entries that duplicate the title; removes empty `keywords: []`; removes invalid/`<= 0` boost values; clamps boost values `> 10` down to `5`.
- Skips (with a logged reason) anything it can't safely fix: unparseable frontmatter, non-string titles, non-array keywords, non-numeric boost, and pages too thin to generate a real description from.
- **Idempotent** — a second run makes zero changes; verified in a scratch directory and on the real repo.
- Supports `--dry-run` to preview changes without writing.

Usage:
```
node fix-seo.js .            # apply fixes
node fix-seo.js . --dry-run  # preview only
```

## 4. Results

Running `node fix-seo.js .` on the real repo:

- **204 files fixed** — mostly new/regenerated descriptions, plus keyword cleanup on `product-updates/spring-2026/domain-health.mdx` and `manage-account/privacy-policy.mdx`.
- **8 files skipped**, each with a reason: `README.md` and `seo-audit-report.md` (excluded, not content pages), and 6 pages too thin/placeholder to auto-generate a description for: `index.mdx`, `setting-up-wisdom-ai/spring-2026/parameterized-agents.mdx`, `product-updates/spring-2026/spring-changelog.mdx`, `product-updates/march-2026/march-changelog.mdx`, `product-updates/june-2026/june-changelog.mdx`, `integrations/graphql-api/objects/job-status.mdx`.

Re-running `audit.js` afterward: total findings dropped from **261 → 55**. Every remaining finding falls into the manual-only categories called out in section 2 (`DUPLICATE_TITLE`, `ORPHAN_PAGE`, `THIN_CONTENT`, `HIDDEN_TRUE`), plus the same 2 excluded meta-files and the 8 pages noted above. `seo-audit-report.md` / `.json` were regenerated to reflect this current state.

Diffs are scoped to frontmatter only (body content untouched). One side effect: since fixes are written via `gray-matter.stringify`, YAML formatting gets normalized on touched files (e.g. flow-style `["a","b"]` arrays become block-style lists, unnecessary quotes are dropped) — cosmetic only, still valid Mintlify frontmatter.

## 5. Description now search/SEO-only, not shown on-page

Separately, the `description` frontmatter field was confirmed (via `mintlify dev` + inspecting the rendered DOM) to serve two purposes in Mintlify:

1. `<meta name="description">`, `og:description`, `twitter:description` tags, and in-product search indexing.
2. A visible subtitle rendered under the page `<h1>`, inside `<header id="header"><div class="mt-2 text-lg prose ...">`.

Per request, (2) has been suppressed. `style.css` now includes:

```css
header#header > div.mt-2 {
  display: none;
}
```

Verified against a local `mintlify dev` server that:
- the on-page subtitle no longer renders,
- the meta/OG/Twitter description tags are untouched,
- pages without a `description` are unaffected (that `div` simply doesn't exist for them).

## 6. Still outstanding (manual)

- **7 `DUPLICATE_TITLE` groups** — e.g. two pages both titled "parameterized agents" (`setting-up-wisdom-ai/spring-2026/parameterized-agents.mdx` vs. `product-updates/spring-2026/parameterized-agents.mdx`); needs a human to pick distinguishing titles.
- **17 `ORPHAN_PAGE`s** not referenced in `docs.json` navigation — needs an IA decision on whether/where to add them.
- **11 `THIN_CONTENT`** pages — need real content written (several are "Page Under Construction" placeholders).
- **8 `HIDDEN_TRUE`** pages — intentionally in-progress, not a bug.
- **6 pages with no description** (listed in section 4) — need a manually written description since there wasn't enough body prose to safely generate one.
