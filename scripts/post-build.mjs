/**
 * post-build.mjs
 * After `vite build`, copies dist/index.html into the route directory tree:
 *   dist/sa_en/index.html
 *   dist/sa_en/built-in-products/index.html
 *   dist/sa_en/faq/index.html
 *   dist/sa_en/e-catalogue/index.html
 *   dist/sa_en/installation-guides/index.html
 *   dist/sa_ar/index.html
 *   dist/sa_ar/built-in-products/index.html
 *   ...
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const srcHtml = path.join(distDir, 'index.html');

if (!fs.existsSync(srcHtml)) {
  console.error('ERROR: dist/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

const locales = ['sa_en', 'sa_ar'];

// All pages except individual kitchen-blog posts (slugs)
const pages = [
  '',                   // home  →  /sa_en/
  'built-in-products',
  'faq',
  'e-catalogue',
  'installation-guides',
  'kitchen-blog',       // listing page only, not individual posts
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyHtml(destDir) {
  ensureDir(destDir);
  const destFile = path.join(destDir, 'index.html');
  fs.copyFileSync(srcHtml, destFile);
  console.log(`  ✓  ${path.relative(distDir, destFile)}`);
}

console.log('\n📦  Generating static page directories...\n');

for (const locale of locales) {
  for (const page of pages) {
    const destDir = page
      ? path.join(distDir, locale, page)
      : path.join(distDir, locale);
    copyHtml(destDir);
  }
}

// Also copy a 404.html for servers that support custom error pages
const notFoundDest = path.join(distDir, '404.html');
fs.copyFileSync(srcHtml, notFoundDest);
console.log(`  ✓  404.html`);

console.log('\n✅  Static build complete!\n');
