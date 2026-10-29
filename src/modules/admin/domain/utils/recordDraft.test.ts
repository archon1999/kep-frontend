import assert from 'node:assert/strict';
import test from 'node:test';
import type { AdminDetail } from '../entities/console.types';
import { localizeAdminRecord } from './recordDraft.ts';

const record = (): AdminDetail => ({
  id: '7',
  label: 'Original',
  revision: 'version-before-edit',
  values: { name: 'Original' },
  fields: [],
  sections: [],
  actions: [],
  checks: [],
  publicPath: null,
  selectedOptions: {},
  readonly: {},
  canSave: true,
  permissions: { view: true, add: true, change: true, delete: true },
  inlines: [
    {
      prefix: 'children',
      key: 'example.child',
      name: 'Children',
      fields: [],
      readonlyFields: [],
      rows: [{ id: '2', values: { title: 'Original child' } }],
      total: 1,
      page: 1,
      pagesCount: 1,
      defaultValues: {},
      defaultSelectedOptions: {},
      permissions: { add: true, change: true, delete: true },
    },
  ],
});

test('translated metadata keeps the original version and inline snapshot for conflict detection', () => {
  const snapshot = record();
  const metadata = record();
  metadata.revision = 'concurrently-changed-version';
  metadata.values = { name: 'Somebody else edited this' };
  metadata.fields = [
    { name: 'name', label: 'Название', kind: 'text', required: true, readOnly: false, help: '' },
  ];
  metadata.inlines[0].name = 'Дочерние записи';
  metadata.inlines[0].rows = [];
  metadata.canSave = false;
  const result = localizeAdminRecord(snapshot, metadata);
  assert.equal(result.revision, 'version-before-edit');
  assert.equal(result.values, snapshot.values);
  assert.equal(result.fields[0].label, 'Название');
  assert.equal(result.inlines[0].name, 'Дочерние записи');
  assert.equal(result.inlines[0].rows, snapshot.inlines[0].rows);
  assert.equal(result.canSave, false);
});

test('a newly created record keeps its saved identity until the edit route loads', () => {
  const snapshot = record();
  const metadata = { ...record(), id: null, revision: null };
  assert.equal(localizeAdminRecord(snapshot, metadata), snapshot);
});
