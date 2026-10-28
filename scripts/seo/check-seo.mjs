import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SITE_NAME, SITE_URL, publicSeoRoutes } from '../../src/app/seo/routes.ts';

const output = path.resolve(process.argv[2] || 'dist');
const { pageTitles } = JSON.parse(
  await readFile('src/app/locales/langs/en/page-titles.json', 'utf8'),
);
const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(new Set(urls), new Set(publicSeoRoutes.map((route) => SITE_URL + route.path)));

for (const route of publicSeoRoutes) {
  const canonical = SITE_URL + route.path;
  const html = await readFile(path.join(output, route.path.slice(1), 'index.html'), 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  assert.equal(document.title, `${pageTitles[route.key]} - ${SITE_NAME}`, canonical);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1, canonical);
  assert.equal(document.querySelector('link[rel="canonical"]').href, canonical);
  assert.ok(!document.querySelector('meta[name="robots"]').content.includes('noindex'), canonical);
  assert.ok(document.querySelector('meta[name="description"]').content.length > 60, canonical);
  assert.equal(document.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(document.querySelector('meta[property="og:title"]').content, document.title);
  assert.equal(document.querySelector('meta[name="twitter:title"]').content, document.title);
  assert.ok(document.querySelector('script[type="module"][src]'), canonical);
  assert.equal(Boolean(document.getElementById('kep-website-schema')), route.path === '/');
  dom.window.close();
}

const fallback = new JSDOM(await readFile(path.join(output, 'app.html'), 'utf8'));
assert.equal(fallback.window.document.title, SITE_NAME);
assert.equal(fallback.window.document.querySelector('link[rel="canonical"]'), null);
assert.equal(fallback.window.document.getElementById('kep-website-schema'), null);
assert.ok(
  !fallback.window.document.querySelector('meta[name="robots"]').content.includes('noindex'),
);
fallback.window.close();

const notFound = new JSDOM(await readFile(path.join(output, '404.html'), 'utf8'));
assert.equal(
  notFound.window.document.querySelector('meta[name="robots"]').content,
  'noindex, follow',
);
notFound.window.close();
assert.match(
  await readFile(path.join(output, 'robots.txt'), 'utf8'),
  /Sitemap: https:\/\/kep\.uz\/sitemap.xml/,
);
console.log(`SEO checks passed for ${urls.length} public pages, SPA fallback, and 404.`);
