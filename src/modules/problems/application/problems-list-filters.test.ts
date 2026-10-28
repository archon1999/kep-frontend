import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildAdvisorFilterPatch,
  buildProblemsListFilter,
  buildProblemsListPatch,
  problemsListQueryDefaults,
} from './problems-list-filters.ts';

test('cleared catalog filters become absent API values while zero status stays valid', () => {
  const patch = buildProblemsListPatch({
    category: undefined,
    tags: undefined,
    groups: undefined,
    favorites: undefined,
    status: 0,
    problem_rating_min: undefined,
  });
  const request = buildProblemsListFilter({ ...problemsListQueryDefaults, ...patch });
  assert.equal(request.category, undefined);
  assert.deepEqual(request.tags, []);
  assert.deepEqual(request.groups, []);
  assert.equal(request.favorites, undefined);
  assert.equal(request.status, 0);
  assert.equal(request.problem_rating_min, undefined);
});

test('advisor replaces its managed criteria without losing user search, favorites, tab, or page size', () => {
  const previous = {
    ...problemsListQueryDefaults,
    search: 'graph',
    favorites: true,
    activeTab: 'mostViewed' as const,
    page: 7,
    pageSize: 50,
    category: '3',
    tags: [2],
    lang: 'cpp',
    difficulty: '5',
    has_checker: 'true',
  };
  const next = {
    ...previous,
    ...buildAdvisorFilterPatch({
      problem_rating_min: '1200',
      problem_rating_max: '1600',
      groups: [9],
    }),
  };
  assert.equal(next.page, 1);
  assert.equal(next.pageSize, 50);
  assert.equal(next.search, 'graph');
  assert.equal(next.favorites, true);
  assert.equal(next.activeTab, 'mostViewed');
  assert.equal(next.lang, '');
  assert.equal(next.category, '');
  assert.equal(next.difficulty, '');
  assert.equal(next.has_checker, '');
  assert.deepEqual(next.tags, []);
  assert.deepEqual(next.groups, [9]);
  assert.equal(next.problem_rating_min, '1200');
  assert.equal(next.problem_rating_max, '1600');
});
