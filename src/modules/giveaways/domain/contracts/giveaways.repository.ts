import type { Giveaway, GiveawaySummary } from '../entities/giveaway.types';

export interface GiveawaysRepository {
  get(id: string): Promise<Giveaway>;
  visit(id: string): Promise<Giveaway>;
  claimAnimation(id: string): Promise<Giveaway>;
  list(source: 'contest' | 'arena', id: string | number): Promise<GiveawaySummary[]>;
}
