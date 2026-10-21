import type { ArenaPlayer } from '../../domain/entities/arena-player.entity.ts';

export const mapArenaPlayer = (data: any): ArenaPlayer => ({
  username: data?.username ?? '',
  avatar: data?.avatar ?? undefined,
  rankTitle: data?.rankTitle ?? data?.rank_title ?? '',
  rating: Number(data?.rating ?? 0),
  rank: data?.rank ?? null,
  points: data?.points ?? 0,
  performance: data?.performance == null ? null : Number(data.performance),
  averageOpponentRating: Number(data?.averageOpponentRating ?? data?.average_opponent_rating ?? 0),
  streak: Boolean(data?.streak),
  results: data?.results ?? [],
  isBot: Boolean(data?.isBot ?? data?.is_bot),
});
