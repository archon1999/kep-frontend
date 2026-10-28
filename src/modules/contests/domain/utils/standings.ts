import type { ContestantEntity } from '../entities/contestant.entity';

export const getStandingsRowId = (row: ContestantEntity) =>
  `${row.rowType ?? 'official'}-${row.id ?? row.username}-${row.virtualTime ?? ''}`;

export const normalizeUsername = (value?: string | null) => value?.trim().toLowerCase() ?? '';

export const contestantMatchesUsername = (row: ContestantEntity, normalizedUsername: string) => {
  if (!normalizedUsername) {
    return false;
  }

  if (normalizeUsername(row.username) === normalizedUsername) {
    return true;
  }

  return Boolean(
    row.team?.members?.some((member) => normalizeUsername(member.username) === normalizedUsername),
  );
};
