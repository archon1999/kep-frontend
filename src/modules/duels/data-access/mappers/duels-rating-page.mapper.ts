import { DuelsRatingPageTableRow, DuelsRatingRow } from 'modules/duels/domain/index.ts';

type Params = {
  page: number;
  pageSize: number;
};

export const mapDuelsRatingPageTableRows = (
  rows: DuelsRatingRow[],
  { page, pageSize }: Params,
): DuelsRatingPageTableRow[] =>
  rows.map((row, index) => ({
    id: `${row.user.username}-${row.rowIndex ?? (page - 1) * pageSize + index + 1}`,
    username: row.user.username,
    avatar: row.user.avatar,
    contestsRating: row.user.contestsRating,
    contestsRatingTitle: row.user.contestsRatingTitle,
    duels: row.duels ?? 0,
    wins: row.wins ?? 0,
    draws: row.draws ?? 0,
    losses: row.losses ?? 0,
    rowIndex: row.rowIndex ?? (page - 1) * pageSize + index + 1,
  }));
