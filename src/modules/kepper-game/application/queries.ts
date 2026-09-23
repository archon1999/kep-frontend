import { gameProgressRepository } from '../data-access';
import { gamePlayerKey } from './keys';

export const loadGameProgress = (username?: string) =>
  gameProgressRepository.load(gamePlayerKey(username));
