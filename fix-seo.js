#!/usr/bin/env node
/**
 * Mintlify SEO Auto-Fixer
 * ------------------------
 * Applies the subset of seo-audit-report.json findings (see audit.js) that
 * can be fixed mechanically, without guessing at content or navigation
 * intent:
 *
 *  - MISSING_DESCRIPTION / DESCRIPTION_LENGTH (too short or placeholder)
 *      -> derives a 50-160 char description from the page's first real
 *         prose paragraph (JSX/imports/code fences stripped).
 *  - KEYWORD_DUPLICATES_TITLE -> drops keywords that just repeat the title.
 *  - KEYWORDS_EMPTY -> removes an empty `keywords: []`.
 *  - BOOST_ZERO_OR_NEGATIVE / BOOST_NOT_NUMBER -> removes the invalid boost.
 *  - BOOST_EXTREME (>10) -> clamps to 5.
 *  - NO_FRONTMATTER_BLOCK / MISSING_TITLE on real content pages -> adds a
 *    minimal frontmatter block / filename-derived title.
 *
 * Deliberately NOT auto-fixed (logged as skipped, needs a human):
 *  - DUPLICATE_TITLE, ORPHAN_PAGE, THIN_CONTENT, HIDDEN_TRUE,
 *    UNPARSEABLE_FRONTMATTER, KEYWORDS_NOT_ARRAY.
 *  - README.md and seo-audit-report.md are excluded outright: they are not
 *    Mintlify content pages.
 *
 * Idempotent: run it as many times as you like. A file is only rewritten
 * when a fix actually changes something; already-fixed files are reported
 * as "no changes needed".
 *
 * Usage:
 *   node fix-seo.js [path-to-docs-repo-root] [--dry-run]
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { globSync } = require("glob");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rootArg = args.find((a) => !a.startsWith("--")) || ".";
const root = path.resolve(rootArg);

if (!fs.existsSync(root)) {
  console.error(`Path does not exist: ${root}`);
  process.exit(1);
}

// Files that look like docs but aren't Mintlify content pages.
const EXCLUDE_BASENAMES = new Set(["README.md", "seo-audit-report.md"]);

const ACRONYMS = {
  mcp: "MCP",
  api: "API",
  sql: "SQL",
  rag: "RAG",
  sso: "SSO",
  csv: "CSV",
  cls: "CLS",
  rls: "RLS",
  gcp: "GCP",
  aws: "AWS",
  sdk: "SDK",
  vpc: "VPC",
  graphql: "GraphQL",
  id: "ID",
};

function titleFromFilename(file) {
  const base = path.basename(file).replace(/\.(mdx|md)$/, "");
  return base
    .split(/[-_]+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS[lower]) return ACRONYMS[lower];
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function normTitle(t) {
  return String(t || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// ---------- Description generation ----------

function stripMdxNoise(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/^import .*$/gm, "") // import statements
    .replace(/^export .*$/gm, "") // export statements
    .replace(/<!--[\s\S]*?-->/g, " ") // html/mdx comments
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/<\/?[A-Za-z][^>]*>/g, " ") // JSX/HTML tags
    .replace(/^#{1,6}\s*/gm, "") // heading markers
    .replace(/[*_`]/g, "") // markdown emphasis/code markers
    .replace(/\|/g, " ") // table pipes
    .replace(/[ \t]+/g, " ");
}

function firstProseParagraph(body) {
  const cleaned = stripMdxNoise(body);
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return paragraphs.find((p) => p.split(" ").filter(Boolean).length >= 6) || null;
}

function buildDescription(body) {
  const paragraph = firstProseParagraph(body);
  if (!paragraph) return null;

  let desc;
  if (paragraph.length <= 160) {
    desc = paragraph;
  } else {
    // Scan backward from the 160-char mark for a `.`/`!`/`?` that is actually
    // a sentence end (followed by a space or end-of-string) rather than one
    // buried in an email/URL/abbreviation like "askwisdom.ai" or "e.g.".
    let cut = -1;
    for (let i = Math.min(159, paragraph.length - 1); i >= 0; i--) {
      const ch = paragraph[i];
      const isSentenceEnd = (ch === "." || ch === "!" || ch === "?") &&
        (i + 1 === paragraph.length || paragraph[i + 1] === " ");
      if (isSentenceEnd) {
        cut = i + 1;
        break;
      }
    }
    if (cut > 50) {
      desc = paragraph.slice(0, cut);
    } else {
      // No usable sentence boundary in range; hard-truncate at a word boundary.
      const hardCut = paragraph.slice(0, 157);
      const lastSpace = hardCut.lastIndexOf(" ");
      desc = (lastSpace > 100 ? hardCut.slice(0, lastSpace) : hardCut) + "...";
    }
  }

  desc = desc.replace(/\s+/g, " ").trim();
  if (desc.length < 50) return null; // not enough material to hit the recommended floor
  return desc;
}

// ---------- Main ----------

const files = globSync("**/*.{md,mdx}", {
  cwd: root,
  ignore: ["node_modules/**", ".git/**", "**/snippets/**"],
});

const changedFiles = [];
const skippedFiles = [];
let filesWritten = 0;

for (const file of files) {
  if (EXCLUDE_BASENAMES.has(path.basename(file))) {
    skippedFiles.push({ file, reason: "not a Mintlify content page (excluded outright)" });
    continue;
  }

  const fullPath = path.join(root, file);
  const raw = fs.readFileSync(fullPath, "utf8");
  const hasFrontmatterBlock = raw.trimStart().startsWith("---");

  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    skippedFiles.push({
      file,
      reason: `UNPARSEABLE_FRONTMATTER (${e.message}) — needs a manual YAML fix before anything else can be applied`,
    });
    continue;
  }

  const fm = { ...parsed.data };
  const body = parsed.content;
  const notes = [];

  // --- Missing frontmatter block / title ---
  if (!hasFrontmatterBlock) {
    notes.push("added missing frontmatter block");
  }
  if (!fm.title) {
    fm.title = titleFromFilename(file);
    notes.push(`added title "${fm.title}" (derived from filename)`);
  } else if (typeof fm.title !== "string") {
    skippedFiles.push({ file, reason: `title is not a string (${JSON.stringify(fm.title)}) — needs manual fix` });
    continue;
  }

  // --- Description ---
  const descLen = (fm.description || "").length;
  if (!fm.description || descLen < 50 || descLen > 160) {
    const generated = buildDescription(body);
    if (generated) {
      const prev = fm.description ? `"${fm.description}"` : "(none)";
      fm.description = generated;
      notes.push(`set description from ${prev} to "${generated}" (${generated.length} chars)`);
    } else {
      skippedFiles.push({
        file,
        reason: fm.description
          ? `description is ${descLen} chars and body has too little prose to safely regenerate one in the 50-160 range — needs a manual rewrite`
          : "no description and body has too little prose to safely auto-generate one (thin/placeholder content) — needs a manual write",
      });
    }
  }

  // --- Keywords ---
  if (Array.isArray(fm.keywords)) {
    if (fm.keywords.length === 0) {
      delete fm.keywords;
      notes.push("removed empty keywords array");
    } else {
      const titleKey = normTitle(fm.title);
      const kept = fm.keywords.filter((k) => normTitle(k) !== titleKey);
      const dropped = fm.keywords.filter((k) => normTitle(k) === titleKey);
      if (dropped.length) {
        if (kept.length) {
          fm.keywords = kept;
        } else {
          delete fm.keywords;
        }
        notes.push(`removed keyword(s) duplicating the title: [${dropped.join(", ")}]`);
      }
    }
  } else if (fm.keywords !== undefined) {
    skippedFiles.push({ file, reason: `keywords is not an array (${JSON.stringify(fm.keywords)}) — needs manual fix` });
  }

  // --- Boost ---
  if (fm.boost !== undefined) {
    if (typeof fm.boost !== "number") {
      skippedFiles.push({ file, reason: `boost is not numeric (${JSON.stringify(fm.boost)}) — needs manual fix` });
    } else if (fm.boost <= 0) {
      notes.push(`removed boost (was ${fm.boost}, must be > 0)`);
      delete fm.boost;
    } else if (fm.boost > 10) {
      notes.push(`clamped boost from ${fm.boost} to 5 (Mintlify recommends using boost sparingly)`);
      fm.boost = 5;
    }
  }

  if (notes.length === 0) {
    continue; // nothing to do, don't even log — keeps output focused on real changes
  }

  changedFiles.push({ file, notes });

  if (!dryRun) {
    const output = matter.stringify(body, fm);
    fs.writeFileSync(fullPath, output);
    filesWritten++;
  }
}

// ---------- Report ----------

console.log(`Mintlify SEO Auto-Fixer — ${files.length} pages scanned under ${root}${dryRun ? " (dry run, no files written)" : ""}\n`);

if (changedFiles.length) {
  console.log(`=== FIXED (${changedFiles.length}) ===`);
  for (const { file, notes } of changedFiles) {
    console.log(`- ${file}`);
    for (const n of notes) console.log(`    ${n}`);
  }
} else {
  console.log("=== FIXED (0) ===\nNothing to fix — all auto-fixable issues are already clean.");
}

if (skippedFiles.length) {
  console.log(`\n=== SKIPPED (${skippedFiles.length}) — needs manual attention ===`);
  for (const { file, reason } of skippedFiles) {
    console.log(`- ${file}\n    ${reason}`);
  }
}

console.log(
  `\n${filesWritten} file(s) written. ${skippedFiles.length} skipped. Re-run any time — it's idempotent.`
);
console.log(
  "\nReminder: DUPLICATE_TITLE, ORPHAN_PAGE, and THIN_CONTENT findings from seo-audit-report.md still need manual content/navigation decisions."
);
