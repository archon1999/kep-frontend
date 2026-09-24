import { gamesRepository } from '../data-access';
import type { GameId } from '../domain';

export const submitGameScore = (id: GameId, score: number) =>
  gamesRepository.submitScore(id, score);
