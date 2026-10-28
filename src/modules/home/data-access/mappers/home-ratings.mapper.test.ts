import assert from 'node:assert/strict';
import test from 'node:test';
import { mapHomeUserRatings } from './home-ratings.mapper.ts';

test('home ratings use the nested ratings response instead of the generated user-list shape', () => {
  const result = mapHomeUserRatings({
    skillsRating: { value: 72.3, rank: 7, percentile: 97.7 },
    activityRating: { value: 0, rank: 301, percentile: 0 },
    contestsRating: { value: 1869, rank: 14, title: 'Expert' },
  });
  assert.equal(result.skillsRating.value, 72.3);
  assert.equal(result.contestsRating.title, 'Expert');
  assert.equal(result.activityRating.value, 0);
  assert.equal(result.activityRating.percentile, 0);
  assert.equal(result.challengesRating.value, undefined);
});

test('missing or malformed ratings never become fabricated scores', () => {
  assert.equal(mapHomeUserRatings(null).skillsRating.value, undefined);
  const result = mapHomeUserRatings({
    skillsRating: { value: NaN, rank: '7' },
    contestsRating: 1869,
  });
  assert.equal(result.skillsRating.value, undefined);
  assert.equal(result.skillsRating.rank, undefined);
  assert.equal(result.contestsRating.value, undefined);
});
