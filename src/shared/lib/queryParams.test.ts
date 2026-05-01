import assert from 'node:assert/strict';
import test from 'node:test';
import {
  booleanFlagParam,
  enumParam,
  numberArrayParam,
  numberParam,
  stringArrayParam,
  stringParam,
} from './queryParams.ts';

test('stringParam parses and serializes empty values as missing', () => {
  const codec = stringParam();

  assert.equal(codec.parse(null), undefined);
  assert.equal(codec.parse('   '), undefined);
  assert.equal(codec.parse('abc'), 'abc');
  assert.equal(codec.serialize(''), null);
  assert.equal(codec.serialize('  '), null);
  assert.equal(codec.serialize('abc'), 'abc');
});

test('numberParam validates integer and range constraints', () => {
  const codec = numberParam({ min: 1, max: 10 });

  assert.equal(codec.parse('1'), 1);
  assert.equal(codec.parse('10'), 10);
  assert.equal(codec.parse('0'), undefined);
  assert.equal(codec.parse('11'), undefined);
  assert.equal(codec.parse('3.5'), undefined);
  assert.equal(codec.parse('abc'), undefined);
  assert.equal(codec.serialize(5), '5');
  assert.equal(codec.serialize(0), null);
  assert.equal(codec.serialize(11), null);
  assert.equal(codec.serialize(3.5), null);
});

test('enumParam accepts only declared values', () => {
  const codec = enumParam(['asc', 'desc'] as const);

  assert.equal(codec.parse('asc'), 'asc');
  assert.equal(codec.parse('desc'), 'desc');
  assert.equal(codec.parse('other'), undefined);
  assert.equal(codec.serialize('asc'), 'asc');
  assert.equal(codec.serialize('other' as 'asc'), null);
});

test('booleanFlagParam uses 1 for true and omits false', () => {
  const codec = booleanFlagParam();

  assert.equal(codec.parse('1'), true);
  assert.equal(codec.parse('true'), true);
  assert.equal(codec.parse('0'), false);
  assert.equal(codec.parse('false'), false);
  assert.equal(codec.parse('yes'), undefined);
  assert.equal(codec.serialize(true), '1');
  assert.equal(codec.serialize(false), null);
});

test('array codecs use stable comma-separated values and ignore invalid entries', () => {
  const strings = stringArrayParam();
  const numbers = numberArrayParam({ min: 1 });

  assert.deepEqual(strings.parse('dp, graphs , math'), ['dp', 'graphs', 'math']);
  assert.deepEqual(strings.parse('dp,,math'), ['dp', 'math']);
  assert.equal(strings.serialize([]), null);
  assert.equal(strings.serialize(['dp', 'graphs']), 'dp,graphs');
  assert.equal(strings.equals?.(['dp', 'graphs'], ['dp', 'graphs']), true);
  assert.equal(strings.equals?.(['dp'], ['graphs']), false);

  assert.deepEqual(numbers.parse('1,2,0,foo,3'), [1, 2, 3]);
  assert.equal(numbers.serialize([1, 2, 3]), '1,2,3');
  assert.equal(numbers.serialize([0]), null);
  assert.equal(numbers.equals?.([1, 2], [1, 2]), true);
  assert.equal(numbers.equals?.([1, 2], [2, 1]), false);
});
