import { DuelsRatingPageTableRow, DuelsRatingRow } from 'modules/duels/domain/index.ts';

export const mapDuelsRatingPageTableRows = (
  rows: DuelsRatingRow[],
): DuelsRatingPageTableRow[] =>
  rows.map((row) => ({
    id: `${row.user.username}-${row.rowIndex}`,
    username: row.user.username,
    avatar: row.user.avatar,
    contestsRating: row.user.contestsRating,
    contestsRatingTitle: row.user.contestsRatingTitle,
    duels: row.duels ?? 0,
    wins: row.wins ?? 0,
    draws: row.draws ?? 0,
    losses: row.losses ?? 0,
    rowIndex: row.rowIndex,
  }));
