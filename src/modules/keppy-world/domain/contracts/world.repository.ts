import type {
  WorldBootstrap,
  WorldLeaderboard,
  WorldProfile,
  WorldResult,
  WorldRun,
  WorldTicket,
} from '../entities';

export interface WorldRepository {
  bootstrap(): Promise<WorldBootstrap>;
  profile(selection: Pick<WorldProfile, 'mascotId' | 'equippedCosmetic'>): Promise<WorldProfile>;
  ticket(): Promise<WorldTicket>;
  claim(id: string): Promise<WorldRun>;
  submit(id: string, answer: unknown): Promise<WorldResult>;
  abandon(id: string): Promise<void>;
  leaderboard(period: 'week' | 'all', page?: number): Promise<WorldLeaderboard>;
}
