import type { GameProgress } from '../contracts/game-progress.repository.ts';
import { levels } from './levels.ts';

export const codeIslandsScore = (progress: GameProgress): number => {
  const completed = new Set(progress.completed);
  const stars = levels.reduce((total, level) => {
    if (!completed.has(level.id)) return total;
    const saved = Number(progress.stars[level.id]);
    return total + Math.max(1, Math.min(3, Number.isFinite(saved) ? saved : 1));
  }, 0);
  return Math.round((stars / (levels.length * 3)) * 1000);
};
