import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity';

export const mapArenaPlayerStatistics = (data: any): ArenaPlayerStatistics => {
  const { perfomance, performance, ...rest } = data ?? {};
  const safeNumber = (value: any) => (typeof value === 'number' ? value : Number(value) || 0);

  return {
    username: rest.username ?? '',
    avatar: rest.avatar ?? undefined,
    rating: safeNumber(rest.rating),
    rankTitle: rest.rankTitle ?? '',
    performance: safeNumber(performance ?? perfomance),
    challenges: safeNumber(rest.challenges),
    wins: safeNumber(rest.wins),
    draws: safeNumber(rest.draws),
    losses: safeNumber(rest.losses),
    winRate: safeNumber(rest.winRate ?? rest.win_rate),
    drawRate: safeNumber(rest.drawRate ?? rest.draw_rate),
    lossRate: safeNumber(rest.lossRate ?? rest.loss_rate),
    opponents: Array.isArray(rest.opponents)
      ? rest.opponents.map((opponent: any) => ({
          username: opponent?.username ?? '',
          avatar: opponent?.avatar ?? undefined,
          rankTitle: opponent?.rankTitle ?? opponent?.rank_title ?? '',
          rating: safeNumber(opponent?.rating),
          result: safeNumber(opponent?.result ?? opponent?.status),
          playerScore: safeNumber(opponent?.playerScore ?? opponent?.player_score),
          opponentScore: safeNumber(opponent?.opponentScore ?? opponent?.opponent_score),
        }))
      : [],
  };
};
