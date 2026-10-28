import assert from 'node:assert/strict';
import test from 'node:test';
import { getBirthdayDetails } from './birthday.ts';

test('birthday today follows Tashkent midnight instead of the UTC date', () => {
  assert.deepEqual(
    getBirthdayDetails('2026-10-28', '2004-10-28', new Date('2026-10-27T19:05:00Z')),
    {
      daysRemaining: 0,
      turningAge: 22,
    },
  );
});
test('next-year birthdays use the age at that birthday', () => {
  assert.deepEqual(
    getBirthdayDetails('2027-01-02', '2000-01-02', new Date('2026-12-31T10:00:00Z')),
    {
      daysRemaining: 2,
      turningAge: 27,
    },
  );
});
test('unknown birth year never becomes an invented age', () => {
  assert.deepEqual(getBirthdayDetails('2026-10-29', undefined, new Date('2026-10-28T10:00:00Z')), {
    daysRemaining: 1,
    turningAge: undefined,
  });
});
test('leap days, invalid dates, and stale results are handled explicitly', () => {
  assert.equal(
    getBirthdayDetails('2028-02-29', '2000-02-29', new Date('2028-02-28T10:00:00Z')).daysRemaining,
    1,
  );
  assert.deepEqual(getBirthdayDetails('2027-02-29'), {});
  assert.deepEqual(
    getBirthdayDetails('2026-10-27', undefined, new Date('2026-10-28T10:00:00Z')),
    {},
  );
  assert.deepEqual(getBirthdayDetails(undefined), {});
});
