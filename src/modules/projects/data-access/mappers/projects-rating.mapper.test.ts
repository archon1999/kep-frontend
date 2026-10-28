import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapProjectsRating, mapProjectsRatingPage } from './projects-rating.mapper.ts';

const user = {
  username: 'rating-user',
  firstName: 'Nazarbek',
  lastName: 'Baltabaev',
  avatar: '',
  rank: 2,
  rating: 133,
  completedProjects: 0,
  ratedProjects: 1,
  passedTasks: 2,
};

test('the wire contract preserves a zero score and an unranked profile', () => {
  const rating = mapProjectsRating({
    ...user,
    rank: null,
    rating: 0,
    ratedProjects: 0,
    passedTasks: 0,
  });
  assert.equal(rating.rank, null);
  assert.equal(rating.rating, 0);
  assert.equal(rating.completedProjects, 0);
  assert.equal(rating.firstName, 'Nazarbek');
});

test('pagination and filtering preserve global tied ranks rather than row indexes', () => {
  const page = mapProjectsRatingPage({
    page: 3,
    pageSize: 10,
    total: 21,
    count: 1,
    pagesCount: 3,
    data: [{ ...user, rank: 17 }],
  });
  assert.equal(page.page, 3);
  assert.equal(page.pagesCount, 3);
  assert.equal(page.total, 21);
  assert.equal(page.data[0].rank, 17);
  assert.equal(page.data[0].rating, 133);
  assert.equal(page.data[0].passedTasks, 2);
});
