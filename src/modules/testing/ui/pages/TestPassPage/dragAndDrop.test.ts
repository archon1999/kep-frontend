import assert from 'node:assert/strict';
import test from 'node:test';
import { moveClassificationItem, reorderItems } from './dragAndDrop.ts';

test('reorderItems moves only the selected item', () => {
  assert.deepEqual(reorderItems(['a', 'b', 'c'], 0, 2), ['b', 'c', 'a']);
  assert.deepEqual(reorderItems(['a', 'b', 'c'], 2, 0), ['c', 'a', 'b']);
});

test('reorderItems ignores a stale drag index', () => {
  const items = ['a', 'b'];
  assert.equal(reorderItems(items, 5, 0), items);
});

test('moveClassificationItem moves one value between groups', () => {
  const groups = [
    { key: 'first', values: ['a', 'b'] },
    { key: 'second', values: ['c'] },
  ];

  assert.deepEqual(moveClassificationItem(groups, { groupIndex: 0, itemIndex: 1 }, 1, 0), [
    { key: 'first', values: ['a'] },
    { key: 'second', values: ['b', 'c'] },
  ]);
  assert.deepEqual(groups, [
    { key: 'first', values: ['a', 'b'] },
    { key: 'second', values: ['c'] },
  ]);
});

test('moveClassificationItem ignores an invalid source', () => {
  const groups = [{ key: 'first', values: ['a'] }];
  assert.equal(
    moveClassificationItem(groups, { groupIndex: 0, itemIndex: 3 }, 0),
    groups,
  );
});
