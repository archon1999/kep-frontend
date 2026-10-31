import assert from 'node:assert/strict';
import test from 'node:test';
import type { AdminDetail, AdminField, AdminList } from '../../../domain/entities/console.types.ts';
import {
  defaultEditorLanguage,
  editorPresentation,
  listPresentation,
} from './resourcePresentation.ts';

const field = (name: string, kind = 'text'): AdminField => ({
  name,
  kind,
  label: name,
  required: false,
  readOnly: false,
  help: '',
});
const record = (fields: AdminField[], id: string | null = '42') => ({ fields, id }) as AdminDetail;

test('every allowed field has one reachable place, including future or readonly fields', () => {
  const source = [
    field('title_uz'),
    field('body_uz', 'richText'),
    field('author', 'relation'),
    field('hidden', 'boolean'),
    field('image', 'image'),
    field('future_setting'),
    { ...field('future_readonly'), readOnly: true },
    field('judge_summary', 'json'),
  ];
  const result = editorPresentation(record(source));
  const assigned = [...result.groups.flatMap((group) => group.fields), ...result.side];
  assert.deepEqual(
    assigned.map((item) => item.name).sort(),
    source.map((item) => item.name).sort(),
  );
  assert.equal(new Set(assigned).size, source.length);
});

test('a settings-only resource still opens an actual editor panel', () => {
  const result = editorPresentation(
    record([field('status', 'select'), field('hidden', 'boolean')]),
  );
  assert.equal(result.groups.length, 1);
  assert.equal(result.groups[0].key, 'settings');
  assert.equal(result.groups[0].fields.length, 2);
});

test('new-account credentials stay with the identity instead of disappearing into advanced settings', () => {
  const fields = [
    field('username'),
    field('usable_password', 'select'),
    field('password1', 'secret'),
    field('password2', 'secret'),
  ];
  const result = editorPresentation(record(fields, null));
  assert.deepEqual(
    result.groups.map((group) => group.key),
    ['content'],
  );
  assert.equal(result.groups[0].fields.length, 4);
});

test('list identity includes name context while optional data remains available in the column picker', () => {
  const data = {
    resource: { key: 'backend.user' },
    columns: [
      'id',
      'username',
      'get_full_name',
      'kepcoin',
      'streak',
      'get_last_seen',
      'another_metric',
    ].map((name) => ({ name, label: name, sortable: false })),
  } as AdminList;
  const result = listPresentation(data);
  assert.equal(result.identity, 'username');
  assert.equal(result.secondary, 'get_full_name');
  assert.deepEqual(result.columns, ['kepcoin', 'streak', 'get_last_seen', 'another_metric']);
});

test('opening an existing record starts with its actual content rather than an empty optional translation', () => {
  const detail = {
    ...record([field('title_uz'), field('title_ru'), field('title_en')]),
    values: { title_uz: 'Masala', title_en: '', title_ru: '' },
  };
  assert.equal(defaultEditorLanguage(detail, 'en'), 'uz');
  detail.values.title_en = 'Problem';
  assert.equal(defaultEditorLanguage(detail, 'en'), 'en');
});
