import { Arena, ArenaStatus } from '../entities/arena.entity';
import { ArenaPlayer } from '../entities/arena-player.entity';
import { ArenaPlayerStatistics } from '../entities/arena-player-statistics.entity';
import { ArenaStatistics } from '../entities/arena-statistics.entity';
import { ArenaChallenge } from '../entities/arena-challenge.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface ArenaListFilters {
  status?: ArenaStatus;
  title?: string;
  page?: number;
  pageSize?: number;
}

export interface ArenaPlayersFilters {
  page?: number;
  pageSize?: number;
}

export interface ArenaChallengesFilters {
  page?: number;
  pageSize?: number;
}

export interface ArenaRepository {
  listArenas: (filters?: ArenaListFilters) => Promise<PageResult<Arena>>;
  getArena: (arenaId: number | string) => Promise<Arena>;
  register: (arenaId: number | string) => Promise<void>;
  pause: (arenaId: number | string) => Promise<void>;
  start: (arenaId: number | string) => Promise<void>;
  loadNextChallenge: (arenaId: number | string) => Promise<{ challengeId?: number } | undefined>;
  listPlayers: (arenaId: number | string, filters?: ArenaPlayersFilters) => Promise<PageResult<ArenaPlayer>>;
  listChallenges: (arenaId: number | string, filters?: ArenaChallengesFilters) => Promise<PageResult<ArenaChallenge>>;
  getPlayerStatistics: (
    arenaId: number | string,
    username: string,
  ) => Promise<ArenaPlayerStatistics>;
  getTopPlayers: (arenaId: number | string) => Promise<ArenaPlayerStatistics[]>;
  getArenaStatistics: (arenaId: number | string) => Promise<ArenaStatistics>;
}
