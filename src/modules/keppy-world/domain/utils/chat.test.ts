import assert from 'node:assert/strict';
import test from 'node:test';
import { chatLength, chatParts } from './chat.ts';

test('KEP emoji tokens count as one character and Unicode symbols are not split', () => {
  assert.equal(chatLength('a'.repeat(49) + ':kep-10:'), 50);
  assert.equal(chatLength('a'.repeat(50) + ':kep-1:'), 51);
  assert.equal(chatLength('😀'), 1);
  assert.equal(chatLength(':kep-999:'), 9);
});

test('only known KEP tokens become images; HTML and unknown tokens remain plain text', () => {
  const parts = chatParts('<script>:kep-4::kep-999:');
  assert.equal(parts[0].text, '<script>');
  assert.equal(parts[0].emoji, undefined);
  assert.equal(parts[1].emoji?.name, 'AC');
  assert.equal(parts[2].text, ':kep-999:');
  assert.equal(parts[2].emoji, undefined);
});
