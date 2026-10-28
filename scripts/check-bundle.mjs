import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const output = path.resolve(process.argv[2] || 'dist');
const manifest = JSON.parse(await readFile(path.join(output, '.vite/manifest.json'), 'utf8'));
const entry = Object.keys(manifest).find((key) => manifest[key].isEntry);
assert.ok(entry, 'Build the application before checking its entry bundle.');
const initial = new Set();
const visit = (key) => {
  if (initial.has(key)) return;
  assert.ok(manifest[key], `Missing imported chunk: ${key}`);
  initial.add(key);
  manifest[key].imports?.forEach(visit);
};
visit(entry);

// These budgets include the shared runtimes, but exclude deferred page/engine chunks.
const budgets = { entryGzip: 140 * 1024, initialGzip: 450 * 1024, chunk: 512 * 1024 };
const sizes = await Promise.all(
  Object.entries(manifest).map(async ([key, chunk]) => {
    const bytes = await readFile(path.join(output, chunk.file));
    return { key, file: chunk.file, raw: bytes.length, gzip: gzipSync(bytes).length };
  }),
);
const javascript = sizes.filter((chunk) => chunk.file.endsWith('.js'));
for (const chunk of javascript)
  assert.ok(chunk.raw <= budgets.chunk, `${chunk.file} exceeds the 512 KiB JavaScript budget.`);
const entrySize = sizes.find((chunk) => chunk.key === entry);
const initialGzip = sizes
  .filter((chunk) => initial.has(chunk.key) && chunk.file.endsWith('.js'))
  .reduce((total, chunk) => total + chunk.gzip, 0);
assert.ok(entrySize.gzip <= budgets.entryGzip, 'Entry JavaScript exceeds the 140 KiB gzip budget.');
assert.ok(
  initialGzip <= budgets.initialGzip,
  'Initial JavaScript exceeds the 450 KiB gzip budget.',
);
console.log(
  `Bundle checks passed: entry ${(entrySize.gzip / 1024).toFixed(1)} KiB gzip; initial ${(initialGzip / 1024).toFixed(1)} KiB gzip; ${javascript.length} JavaScript chunks.`,
);
