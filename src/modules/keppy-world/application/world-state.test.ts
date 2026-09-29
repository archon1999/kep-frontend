import assert from 'node:assert/strict';
import test from 'node:test';
import { mapWorld } from '../data-access/mappers/world.mapper.ts';
import type { CommunityWorld, WorldQuest } from '../domain/entities/world.types.ts';
import { availablePlayerQuests, latestCommunityWorld } from './world-state.ts';

test('a delayed room poll cannot undo a reward or close an unlocked area', () => {
  const awarded: CommunityWorld = mapWorld({
    totalXp: 1000,
    stage: 1,
    nextThreshold: 5000,
    zones: ['plaza', 'harbor'],
  });
  const oldRoom = { ...awarded, totalXp: 950, stage: 0, zones: ['plaza'] };
  assert.equal(latestCommunityWorld(awarded, oldRoom), awarded);
  const peerReward = { ...awarded, totalXp: 1080 };
  assert.equal(latestCommunityWorld(awarded, peerReward), peerReward);
});

test('a shared quest broadcast excludes personal daily completions and current claims', () => {
  const base = {
    kind: 'daily-task',
    title: 'Daily',
    difficulty: 1,
    xp: 50,
    position: { x: 0, z: 0 },
    zone: 'plaza',
  } as const;
  const quests: WorldQuest[] = [
    { ...base, id: 'done', dailyTaskId: 8 },
    { ...base, id: 'new', dailyTaskId: 9 },
    { ...base, id: 'claimed', kind: 'cargo' },
    { ...base, id: 'free', kind: 'bug-hunt' },
  ];
  assert.deepEqual(
    availablePlayerQuests(quests, [8], 'claimed').map((quest) => quest.id),
    ['new', 'free'],
  );
  assert.equal(availablePlayerQuests(quests, []).length, 4);
});

test('world progress measures the current level instead of total lifetime XP', () => {
  const boundary = mapWorld({ totalXp: 35000, stage: 4, nextThreshold: 70000, zones: ['garden'] });
  assert.equal(boundary.level, 5);
  assert.equal(boundary.progress, 0);
  assert.equal(boundary.levelXp, 0);
  const midpoint = mapWorld({ totalXp: 52500, stage: 4, nextThreshold: 70000, zones: ['garden'] });
  assert.equal(midpoint.progress, 0.5);
  const complete = mapWorld({ totalXp: 501000, stage: 9, nextThreshold: null, zones: ['citadel'] });
  assert.equal(complete.progress, 1);
  assert.equal(complete.nextLevelXp, null);
  assert.equal(complete.milestones.length, 10);
  assert.equal(complete.level, 10);
  assert.equal(complete.levelStartXp, 500000);
});

test('shared room quests respect the current player daily per-kind allowance', () => {
  const common = { title: 'Quest', difficulty: 1, xp: 10, position: { x: 0, z: 0 }, zone: 'plaza' };
  const quests: WorldQuest[] = [
    { ...common, id: 'math-1', kind: 'quick-math' },
    { ...common, id: 'math-2', kind: 'quick-math' },
    { ...common, id: 'matrix', kind: 'memory-matrix' },
  ];
  assert.deepEqual(
    availablePlayerQuests(quests, [], undefined, { 'quick-math': 3, 'memory-matrix': 2 }, 3).map(
      (quest) => quest.id,
    ),
    ['matrix'],
  );
  assert.equal(availablePlayerQuests(quests, []).length, 3, 'A fresh day restores all kinds.');
});

test('world progress uses server milestones when configured thresholds change', () => {
  const world = mapWorld({
    totalXp: 400,
    stage: 1,
    nextThreshold: 1000,
    zones: ['plaza', 'harbor'],
    milestones: [
      { level: 1, requiredXp: 0, zone: 'plaza' },
      { level: 2, requiredXp: 200, zone: 'harbor' },
      { level: 3, requiredXp: 1000, zone: 'bridge' },
    ],
  });
  assert.equal(world.levelStartXp, 200);
  assert.equal(world.progress, 0.25);
  assert.equal(world.maxLevel, 3);
});
