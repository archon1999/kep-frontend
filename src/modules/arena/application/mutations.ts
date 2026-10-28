import { arenaRepository } from '../data-access';
import type { ArenaRepository } from '../domain/contracts/arena.repository';

export const startArenaQueue = (...args: Parameters<ArenaRepository['start']>) =>
  arenaRepository.start(...args);

export const pauseArenaQueue = (...args: Parameters<ArenaRepository['pause']>) =>
  arenaRepository.pause(...args);

export const registerForArena = (...args: Parameters<ArenaRepository['register']>) =>
  arenaRepository.register(...args);

export const unregisterFromArena = (...args: Parameters<ArenaRepository['unregister']>) =>
  arenaRepository.unregister(...args);
