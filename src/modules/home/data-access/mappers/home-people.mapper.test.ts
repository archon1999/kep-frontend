import assert from 'node:assert/strict';
import test from 'node:test';
import { mapBirthdayProfile, mapNextBirthdays, mapOnlineUsers } from './home-people.mapper.ts';

test('community endpoints support both raw arrays and paginated responses', () => {
  const users = [{ username: 'coder', avatar: 'avatar.png', first_name: 'Coder' }];
  assert.deepEqual(mapOnlineUsers(users), mapOnlineUsers({ data: users }));
  assert.equal(mapOnlineUsers(users).data[0].firstName, 'Coder');
});
test('birthday occurrence and birth year remain separate', () => {
  const result = mapNextBirthdays([{ username: 'coder', date: '2026-10-29' }]);
  assert.equal(result.data[0].date, '2026-10-29');
  assert.equal(result.data[0].dateOfBirth, undefined);
  assert.equal(mapBirthdayProfile({ date_of_birth: '2000-10-29' }), '2000-10-29');
});
test('malformed community payloads never produce fabricated people', () => {
  assert.deepEqual(mapNextBirthdays(null), { data: [] });
  assert.deepEqual(mapOnlineUsers({ data: [null, {}, { username: '' }] }), { data: [] });
});
