#!/usr/bin/env node
/**
 * Mintlify Search & SEO Audit
 * ---------------------------
 * Scans a Mintlify docs project for the config-level issues that most
 * commonly break in-product search relevance and page discoverability:
 *
 *  - Broken/unparseable YAML frontmatter (silently drops all fields, incl. keywords/boost)
 *  - Missing/duplicate titles, missing descriptions, bad description length
 *  - Pages accidentally excluded from search (hidden / noindex / searchable:false)
 *  - `keywords` present but malformed (not an array, empty, duplicated from title)
 *  - `boost` values that are 0, negative, or absurdly high (degrades overall search quality)
 *  - Pages referenced in docs.json navigation that don't exist on disk (dead nav entries)
 *  - Orphan pages: files on disk not referenced anywhere in docs.json navigation
 *  - Near-duplicate titles across pages (e.g. three pages titled "Chat" in different sections)
 *    which is exactly the ambiguity your search results screenshot shows
 *
 * Usage:
 *   node audit.js <path-to-docs-repo-root>
 *
 * Requires: gray-matter, glob (npm install gray-matter glob)
 *
 * Output:
 *   - Console summary (grouped by severity)
 *   - JSON report: seo-audit-report.json
 *   - Markdown report: seo-audit-report.md  (good for pasting into a PR description)
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { globSync } = require("glob");

const rootArg = process.argv[2];
if (!rootArg) {
  console.error("Usage: node audit.js <path-to-docs-repo-root>");
  process.exit(1);
}
const root = path.resolve(rootArg);

if (!fs.existsSync(root)) {
  console.error(`Path does not exist: ${root}`);
  process.exit(1);
}

// ---------- Load docs.json ----------
function findDocsJson(dir) {
  const candidates = ["docs.json", "mint.json"];
  for (const c of candidates) {
    const p = path.join(dir, c);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const docsJsonPath = findDocsJson(root);
let docsConfig = null;
if (docsJsonPath) {
  try {
    docsConfig = JSON.parse(fs.readFileSync(docsJsonPath, "utf8"));
  } catch (e) {
    console.error(`WARNING: could not parse ${docsJsonPath}: ${e.message}`);
  }
}

// Flatten every page path referenced anywhere in docs.json navigation
function extractNavPages(node, acc = []) {
  if (!node) return acc;
  if (typeof node === "string") {
    acc.push(node);
    return acc;
  }
  if (Array.isArray(node)) {
    node.forEach((n) => extractNavPages(n, acc));
    return acc;
  }
  if (typeof node === "object") {
    if (node.pages) extractNavPages(node.pages, acc);
    if (node.groups) extractNavPages(node.groups, acc);
    if (node.tabs) extractNavPages(node.tabs, acc);
    if (node.anchors) extractNavPages(node.anchors, acc);
    if (node.dropdowns) extractNavPages(node.dropdowns, acc);
    if (node.versions) extractNavPages(node.versions, acc);
    if (node.languages) extractNavPages(node.languages, acc);
  }
  return acc;
}

const navPages = docsConfig
  ? extractNavPages(docsConfig.navigation || docsConfig, [])
  : [];

// ---------- Scan MDX/MD files ----------
const files = globSync("**/*.{md,mdx}", {
  cwd: root,
  ignore: ["node_modules/**", ".git/**", "**/snippets/**"],
});

const issues = { error: [], warning: [], info: [] };
const titleMap = new Map(); // normalized title -> [file paths]
const seenPaths = new Set();

function normTitle(t) {
  return String(t || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function pagePathFromFile(file) {
  // Normalize to forward slashes so Windows paths compare correctly
  // against docs.json, which always uses forward slashes.
  return file.replace(/\.(mdx|md)$/, "").replace(/\\/g, "/");
}

for (const file of files) {
  const fullPath = path.join(root, file);
  const raw = fs.readFileSync(fullPath, "utf8");
  const pagePath = pagePathFromFile(file);
  seenPaths.add(pagePath);

  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    issues.error.push({
      file,
      issue: "UNPARSEABLE_FRONTMATTER",
      detail: `YAML frontmatter failed to parse (${e.message}). Every field on this page — title, description, keywords, boost — is silently ignored until this is fixed.`,
    });
    continue;
  }

  const fm = parsed.data || {};
  const body = parsed.content || "";

  // Detect frontmatter block presence at all
  const hasFrontmatterBlock = raw.trimStart().startsWith("---");
  if (!hasFrontmatterBlock) {
    issues.error.push({
      file,
      issue: "NO_FRONTMATTER_BLOCK",
      detail: "File has no YAML frontmatter block. Title falls back to filename and the page has no description or keywords.",
    });
  }

  // Title checks
  if (!fm.title) {
    issues.warning.push({
      file,
      issue: "MISSING_TITLE",
      detail: "No `title` set — Mintlify will derive one from the filename, which often reads worse in search results and sidebar.",
    });
  } else {
    const key = normTitle(fm.title);
    if (!titleMap.has(key)) titleMap.set(key, []);
    titleMap.get(key).push(file);
  }

  // Description checks
  if (!fm.description) {
    issues.warning.push({
      file,
      issue: "MISSING_DESCRIPTION",
      detail: "No `description` — hurts SEO meta tags and gives search users less context to pick the right result.",
    });
  } else if (fm.description.length < 50 || fm.description.length > 160) {
    issues.info.push({
      file,
      issue: "DESCRIPTION_LENGTH",
      detail: `Description is ${fm.description.length} chars (recommended 50–160).`,
    });
  }

  // Search exclusion flags
  if (fm.searchable === false) {
    issues.info.push({
      file,
      issue: "SEARCHABLE_FALSE",
      detail: "Page explicitly excluded from in-product search (searchable: false). Confirm this is intentional — `boost` has no effect here.",
    });
  }
  if (fm.noindex === true) {
    issues.info.push({
      file,
      issue: "NOINDEX_TRUE",
      detail: "Page excluded from search, sitemap, and AI assistant context (noindex: true).",
    });
  }
  if (fm.hidden === true) {
    issues.info.push({
      file,
      issue: "HIDDEN_TRUE",
      detail: "Page hidden from sidebar; this also force-sets noindex: true automatically.",
    });
  }

  // Keywords checks
  if (fm.keywords !== undefined) {
    if (!Array.isArray(fm.keywords)) {
      issues.error.push({
        file,
        issue: "KEYWORDS_NOT_ARRAY",
        detail: `keywords must be a YAML array, e.g. keywords: ["chat", "messaging"]. Found: ${JSON.stringify(fm.keywords)}`,
      });
    } else {
      if (fm.keywords.length === 0) {
        issues.warning.push({
          file,
          issue: "KEYWORDS_EMPTY",
          detail: "keywords field present but empty array — has no effect.",
        });
      }
      const dupeWithTitle = fm.keywords.filter(
        (k) => fm.title && normTitle(k) === normTitle(fm.title)
      );
      if (dupeWithTitle.length) {
        issues.info.push({
          file,
          issue: "KEYWORD_DUPLICATES_TITLE",
          detail: `Keyword(s) [${dupeWithTitle.join(", ")}] just repeat the title and add no new match surface.`,
        });
      }
    }
  }

  // Boost checks
  if (fm.boost !== undefined) {
    if (typeof fm.boost !== "number") {
      issues.error.push({
        file,
        issue: "BOOST_NOT_NUMBER",
        detail: `boost must be numeric. Found: ${JSON.stringify(fm.boost)}`,
      });
    } else if (fm.boost <= 0) {
      issues.error.push({
        file,
        issue: "BOOST_ZERO_OR_NEGATIVE",
        detail: `boost: ${fm.boost} — values must be > 0. 0 or negative likely isn't doing what you intend.`,
      });
    } else if (fm.boost > 10) {
      issues.warning.push({
        file,
        issue: "BOOST_EXTREME",
        detail: `boost: ${fm.boost} is very high. Mintlify recommends using boost sparingly — large multipliers can crowd out genuinely relevant pages.`,
      });
    }
  }

  // Thin content check (search chunk needs enough text to score well)
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  if (wordCount < 40) {
    issues.info.push({
      file,
      issue: "THIN_CONTENT",
      detail: `Only ~${wordCount} words of body content. Very short pages produce weak search chunks — boost/keywords compensate less well here.`,
    });
  }

  // Nav presence check
  if (docsConfig && navPages.length && !navPages.includes(pagePath) && !navPages.includes("/" + pagePath)) {
    issues.info.push({
      file,
      issue: "ORPHAN_PAGE",
      detail: "Not referenced in docs.json navigation — may still be reachable by URL but won't appear in sidebar-driven discovery.",
    });
  }
}

// Duplicate / near-duplicate titles across different sections
for (const [key, filesWithTitle] of titleMap.entries()) {
  if (filesWithTitle.length > 1) {
    issues.warning.push({
      file: filesWithTitle.join(", "),
      issue: "DUPLICATE_TITLE",
      detail: `${filesWithTitle.length} pages share the title "${key}". This is very likely why ambiguous single-word searches (like "chat") return confusing, hard-to-distinguish results — consider more specific titles or distinct sidebarTitle values.`,
    });
  }
}

// Dead nav entries (docs.json references a page that doesn't exist on disk)
if (docsConfig) {
  for (const navPath of navPages) {
    const clean = navPath.replace(/^\//, "");
    if (!seenPaths.has(clean)) {
      issues.error.push({
        file: docsJsonPath,
        issue: "DEAD_NAV_ENTRY",
        detail: `docs.json references "${navPath}" but no matching .md/.mdx file was found on disk.`,
      });
    }
  }
}

// ---------- Report ----------
function printGroup(name, arr) {
  if (!arr.length) return;
  console.log(`\n=== ${name.toUpperCase()} (${arr.length}) ===`);
  for (const i of arr) {
    console.log(`- [${i.issue}] ${i.file}\n    ${i.detail}`);
  }
}

console.log(`Mintlify Search & SEO Audit — ${files.length} pages scanned`);
printGroup("errors (breaks functionality)", issues.error);
printGroup("warnings (likely hurting search quality)", issues.warning);
printGroup("info (worth reviewing)", issues.info);

const totalIssues = issues.error.length + issues.warning.length + issues.info.length;
console.log(`\nTotal findings: ${totalIssues}`);

fs.writeFileSync(
  path.join(process.cwd(), "seo-audit-report.json"),
  JSON.stringify(issues, null, 2)
);

const md = [
  `# Mintlify Search & SEO Audit`,
  ``,
  `Scanned ${files.length} pages under \`${root}\`.`,
  ``,
  `## Errors (${issues.error.length})`,
  ...issues.error.map((i) => `- **${i.issue}** \`${i.file}\` — ${i.detail}`),
  ``,
  `## Warnings (${issues.warning.length})`,
  ...issues.warning.map((i) => `- **${i.issue}** \`${i.file}\` — ${i.detail}`),
  ``,
  `## Info (${issues.info.length})`,
  ...issues.info.map((i) => `- **${i.issue}** \`${i.file}\` — ${i.detail}`),
].join("\n");

fs.writeFileSync(path.join(process.cwd(), "seo-audit-report.md"), md);
console.log(`\nWrote seo-audit-report.json and seo-audit-report.md`);