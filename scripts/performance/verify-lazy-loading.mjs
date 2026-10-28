import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'dist');
const manifest = JSON.parse(await readFile(path.join(output, '.vite/manifest.json'), 'utf8'));
const entry = Object.keys(manifest).find((key) => manifest[key].isEntry);
assert.ok(entry, 'Build the application before checking lazy loading.');
const initial = new Set();
const visit = (key) => {
  if (initial.has(key)) return;
  assert.ok(manifest[key], `Missing imported chunk: ${key}`);
  initial.add(key);
  manifest[key].imports?.forEach(visit);
};
visit(entry);

const pages = [
  'ProblemsListPage',
  'ProblemDetailPage',
  'ContestsListPage',
  'ContestProblemPage',
  'ChallengesListPage',
  'ChallengeDetailPage',
  'DuelsListPage',
  'DuelDetailPage',
  'ArenaListPage',
  'HackathonsListPage',
  'HackathonProjectPage',
  'TournamentsListPage',
  'ProjectsListPage',
  'ProjectDetailPage',
  'TestsListPage',
  'UserProfilePage',
  'AccountSettingsPage',
  'BlogListPage',
  'ShopPage',
  'CalendarPage',
  'GamesPage',
];
for (const page of pages) {
  const key = Object.keys(manifest).find((key) => key.endsWith(`/${page}.tsx`));
  assert.ok(key, `Missing built page chunk: ${page}`);
  assert.ok(manifest[key].isDynamicEntry, `${page} must load through a dynamic import.`);
  assert.ok(!initial.has(key), `${page} is eagerly included in the application shell.`);
}
for (const language of ['en', 'uz', 'ru']) {
  const key = `src/app/locales/langs/${language}/index.ts`;
  assert.ok(manifest[key]?.isDynamicEntry, `${language} translations must load on demand.`);
  assert.ok(!initial.has(key), `${language} translations are bundled into the shell.`);
}
for (const key of initial) {
  const file = manifest[key].file;
  assert.doesNotMatch(
    file,
    /(?:monaco|editor\.api|echarts|chart-renderer|three-core|three-renderer|react-three|fullcalendar)/i,
    `A feature engine is eagerly loaded: ${file}`,
  );
}
console.log(
  `Lazy-loading checks passed for ${pages.length} pages, 3 languages, and the shell's engine boundaries.`,
);
