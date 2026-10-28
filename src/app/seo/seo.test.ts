import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { getPageHref } from '../../shared/lib/paginationLinks.ts';
import { applyDocumentMetadata } from './documentMetadata.ts';
import { publicSeoRoutes, resolveSeoRoute, websiteStructuredData } from './routes.ts';

const { JSDOM } = createRequire(import.meta.url)('jsdom') as {
  JSDOM: new (html: string) => { window: { document: Document; close: () => void } };
};

test('public routes have unique, translated titles and meaningful descriptions in all languages', () => {
  for (const language of ['en', 'uz', 'ru']) {
    const { seo } = JSON.parse(
      readFileSync(new URL(`../locales/langs/${language}/seo.json`, import.meta.url), 'utf8'),
    );
    const { pageTitles } = JSON.parse(
      readFileSync(
        new URL(`../locales/langs/${language}/page-titles.json`, import.meta.url),
        'utf8',
      ),
    );
    const titles = new Set();
    for (const route of publicSeoRoutes) {
      assert.ok(seo[route.key].description.length >= 60, `${language}: ${route.path}`);
      const title = pageTitles[route.key];
      assert.ok(title?.trim(), `${language}: missing page title for ${route.path}`);
      assert.ok(!titles.has(title), `${language}: duplicate title`);
      titles.add(title);
      assert.equal(resolveSeoRoute(route.path).indexable, true);
    }
  }
});

test('canonical pagination preserves page two instead of collapsing it into page one', () => {
  assert.equal(
    resolveSeoRoute('/contests/', '?page=2&utm_source=telegram').canonical,
    'https://kep.uz/contests?page=2',
  );
  assert.equal(resolveSeoRoute('/contests', '?page=1').canonical, 'https://kep.uz/contests');
  assert.equal(resolveSeoRoute('/contests', '?page=2').indexable, true);
  for (const query of [
    '?type=ACM10M',
    '?q=code',
    '?page=0',
    '?page=-1',
    '?page=1.5',
    '?page=99999999999999999999',
  ]) {
    assert.equal(resolveSeoRoute('/contests', query).indexable, false, query);
  }
});

test('private, editing, execution and unknown pages are not indexable', () => {
  for (const path of [
    '/settings',
    '/settings/teams',
    '/admin/problems',
    '/login',
    '/blog/new',
    '/blog/3/edit',
    '/tests/test-pass/1',
    '/contests/502/problem/A',
    '/problems/attempts/1',
    '/not-a-real-page',
  ]) {
    assert.equal(resolveSeoRoute(path).robots, 'noindex, follow', path);
  }
  for (const path of [
    '/problems/2349',
    '/contests/502',
    '/blog/123',
    '/projects/frontend-counter',
  ]) {
    assert.equal(resolveSeoRoute(path).indexable, true, path);
    assert.equal(resolveSeoRoute(path).canonical, `https://kep.uz${path}`);
  }
});

test('SPA metadata updates replace initial tags, clean up schema and track language', () => {
  const dom = new JSDOM(
    '<!doctype html><html><head><meta name="description" content="old"><meta name="description" content="duplicate"><link rel="canonical" href="https://kep.uz/"></head></html>',
  );
  const document = dom.window.document;
  const metadata = {
    title: 'KEP.uz',
    description: 'Practice programming',
    language: 'en-US',
    robots: 'index, follow',
    canonical: 'https://kep.uz/',
    structuredData: websiteStructuredData,
  };
  applyDocumentMetadata(document, metadata);
  assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(
    JSON.parse(document.getElementById('kep-website-schema')!.textContent!).name,
    'KEP.uz',
  );
  applyDocumentMetadata(document, {
    ...metadata,
    title: 'Контесты',
    language: 'ru-RU',
    canonical: 'https://kep.uz/contests',
    structuredData: undefined,
  });
  assert.equal(document.documentElement.lang, 'ru');
  assert.equal(document.title, 'Контесты');
  assert.equal(
    document.querySelector('meta[property="og:locale"]')?.getAttribute('content'),
    'ru_RU',
  );
  assert.equal(document.getElementById('kep-website-schema'), null);
  applyDocumentMetadata(document, {
    ...metadata,
    robots: 'noindex, follow',
    canonical: undefined,
    structuredData: undefined,
  });
  assert.equal(document.querySelector('link[rel="canonical"]'), null);
  assert.equal(document.querySelector('meta[property="og:url"]'), null);
  dom.window.close();
});

test('pagination links preserve filters and omit page one', () => {
  assert.equal(getPageHref('/contests', '?type=ACM10M&page=3', 2), '/contests?type=ACM10M&page=2');
  assert.equal(getPageHref('/contests', '?page=3', 1), '/contests');
  assert.equal(getPageHref('/blog', '', 2), '/blog?page=2');
});
