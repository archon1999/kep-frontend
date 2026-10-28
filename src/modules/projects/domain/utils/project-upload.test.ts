import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  MAX_PROJECT_FILE_SIZE,
  isProjectFileAccepted,
  resolveProjectFileAccept,
  validateProjectFile,
} from './project-upload.ts';

test('missing or blank project file restrictions default to ZIP', () => {
  assert.equal(resolveProjectFileAccept(), '.zip');
  assert.equal(resolveProjectFileAccept('  '), '.zip');
  assert.equal(isProjectFileAccepted({ name: 'solution.ZIP', type: '' }), true);
  assert.equal(isProjectFileAccepted({ name: 'solution.zip.exe', type: '' }), false);
});

test('extension lists and MIME restrictions accept only matching files', () => {
  assert.equal(
    isProjectFileAccepted({ name: 'solution.TAR.GZ', type: '' }, ' .zip, .tar.gz '),
    true,
  );
  assert.equal(
    isProjectFileAccepted({ name: 'source', type: 'APPLICATION/ZIP' }, 'application/zip'),
    true,
  );
  assert.equal(isProjectFileAccepted({ name: 'photo', type: 'image/png' }, 'image/*'), true);
  assert.equal(
    isProjectFileAccepted({ name: 'photo', type: 'application/image' }, 'image/*'),
    false,
  );
  assert.equal(isProjectFileAccepted({ name: 'source', type: '' }, ', ,'), false);
  assert.equal(isProjectFileAccepted({ name: 'source', type: '' }, '*/*'), true);
});

test('submission validation accepts the size limit and rejects oversized or unsupported files', () => {
  const file = { name: 'solution.zip', type: 'application/zip', size: MAX_PROJECT_FILE_SIZE };
  assert.equal(validateProjectFile(file), null);
  assert.equal(validateProjectFile({ ...file, size: MAX_PROJECT_FILE_SIZE + 1 }), 'too-large');
  assert.equal(validateProjectFile({ ...file, name: 'solution.exe' }), 'unsupported-type');
  assert.equal(
    validateProjectFile({ ...file, size: MAX_PROJECT_FILE_SIZE + 1, name: 'solution.exe' }),
    'too-large',
  );
});
