#!/usr/bin/env node
/**
 * Checks every internal link/image/href in the docs for:
 *   1. The target file doesn't exist ("broken link").
 *   2. The link is missing its leading slash (e.g. "integrations/foo" instead
 *      of "/integrations/foo") — this is valid-looking but resolves as a
 *      relative URL in the browser, so it 404s on any page not at the site
 *      root. This is exactly the bug reported by a user on 2026-07-30 for
 *      /integrations/embeddings/embedding.
 *   3. (--check-anchors) The #anchor fragment doesn't match any heading slug
 *      in the target file, using the same slugger Mintlify/GitHub use.
 *
 * Usage:
 *   node scripts/check-links.js                 # file-existence + leading-slash checks
 *   node scripts/check-links.js --check-anchors  # also validate #anchor fragments
 *
 * Exits 1 if any issues are found (for use as a CI gate), 0 otherwise.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slug as slugify } from 'github-slugger';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXCLUDE_DIRS = new Set(['.git', '.claude', 'node_modules', '.mintlify', '.vscode']);
const PAGE_EXT = ['.mdx', '.md'];
const CHECK_ANCHORS = process.argv.includes('--check-anchors');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (PAGE_EXT.includes(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function stripCodeBlocks(content) {
  // Fenced code blocks (```...``` or ~~~...~~~) often contain example JSON/markdown
  // with link-like syntax that isn't a real navigable link. Blank them out but
  // keep line breaks so line numbers in other tooling stay meaningful.
  return content.replace(/(^|\n)(```|~~~)[\s\S]*?\n\2/g, (match) => match.replace(/[^\n]/g, ''));
}

function extractLinks(content) {
  const stripped = stripCodeBlocks(content);
  const links = [];
  const mdLinkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const attrRe = /\b(?:href|src)=(["'])(.*?)\1/g;
  let m;
  while ((m = mdLinkRe.exec(stripped))) links.push(m[1]);
  while ((m = attrRe.exec(stripped))) links.push(m[2]);
  return links;
}

function isExternal(url) {
  return /^(https?:|mailto:|tel:)/i.test(url) || url.startsWith('//');
}

function isSkippable(url) {
  if (!url) return true;
  if (url.startsWith('{')) return true; // JSX expression, e.g. href={someVar}
  if (url.startsWith('data:')) return true;
  return false;
}

function resolveInternalPath(urlPath) {
  const rel = urlPath.slice(1); // strip leading slash
  if (rel === '') return path.join(ROOT, 'index.mdx');

  for (const ext of PAGE_EXT) {
    const p = path.join(ROOT, rel + ext);
    if (fs.existsSync(p)) return p;
  }
  const asIs = path.join(ROOT, rel);
  if (fs.existsSync(asIs) && fs.statSync(asIs).isFile()) return asIs;
  for (const ext of PAGE_EXT) {
    const p = path.join(ROOT, rel, 'index' + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const headingSlugCache = new Map();
function getHeadingSlugs(filePath) {
  if (headingSlugCache.has(filePath)) return headingSlugCache.get(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const slugs = new Set();
  const headingRe = /^#{1,6}\s+(.+)$/gm;
  let m;
  while ((m = headingRe.exec(content))) {
    const text = m[1].trim();
    const customId = text.match(/\{#([\w-]+)\}\s*$/);
    slugs.add(customId ? customId[1] : slugify(text));
  }
  headingSlugCache.set(filePath, slugs);
  return slugs;
}

const files = walk(ROOT);
const report = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const links = extractLinks(content);
  const issues = [];
  const seen = new Set();

  for (const raw of links) {
    if (isSkippable(raw) || isExternal(raw)) continue;
    if (seen.has(raw)) continue;
    seen.add(raw);

    if (raw.startsWith('#')) {
      if (CHECK_ANCHORS) {
        const hash = raw.slice(1);
        const slugs = getHeadingSlugs(file);
        if (hash && !slugs.has(hash)) {
          issues.push(`${raw} — anchor "#${hash}" not found among headings in this file`);
        }
      }
      continue;
    }

    const [pathPart, hash] = raw.split('#');
    const queryless = pathPart.split('?')[0];
    if (queryless === '') continue;

    if (!queryless.startsWith('/')) {
      issues.push(`${raw} — missing leading slash (resolves as a relative link and 404s once the page isn't at the site root)`);
      continue;
    }

    const resolved = resolveInternalPath(queryless);
    if (!resolved) {
      issues.push(`${raw} — target not found`);
      continue;
    }

    if (CHECK_ANCHORS && hash) {
      const ext = path.extname(resolved);
      if (PAGE_EXT.includes(ext)) {
        const slugs = getHeadingSlugs(resolved);
        if (!slugs.has(hash)) {
          issues.push(`${raw} — anchor "#${hash}" not found among headings in ${path.relative(ROOT, resolved)}`);
        }
      }
    }
  }

  if (issues.length) {
    report.push({ file: path.relative(ROOT, file), issues });
  }
}

if (report.length === 0) {
  console.log('No broken links found.');
  process.exit(0);
}

const totalIssues = report.reduce((n, r) => n + r.issues.length, 0);
console.log(`Found ${totalIssues} link issue(s) in ${report.length} file(s):\n`);
for (const { file, issues } of report) {
  console.log(file);
  for (const issue of issues) console.log(`  - ${issue}`);
  console.log('');
}

process.exit(1);
