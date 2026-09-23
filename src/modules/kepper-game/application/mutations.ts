import { gameProgressRepository } from '../data-access';
import type { GameProgress } from '../domain';
import { gamePlayerKey } from './keys';

export const saveGameProgress = (username: string | undefined, progress: GameProgress) =>
  gameProgressRepository.save(gamePlayerKey(username), progress);
