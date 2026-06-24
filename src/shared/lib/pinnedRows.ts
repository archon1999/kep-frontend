export const normalizePinnedRowUsername = (value?: string | null) =>
  value?.trim().toLowerCase() ?? '';

export const rowMatchesUsername = (row: unknown, username?: string | null): boolean => {
  const normalizedUsername = normalizePinnedRowUsername(username);
  if (!normalizedUsername || !row || typeof row !== 'object') {
    return false;
  }

  const rowData = row as Record<string, any>;
  const directUsername = normalizePinnedRowUsername(rowData.username);
  if (directUsername === normalizedUsername) {
    return true;
  }

  const userUsername = normalizePinnedRowUsername(rowData.user?.username);
  if (userUsername === normalizedUsername) {
    return true;
  }

  const teamMembers = rowData.team?.members;
  return Array.isArray(teamMembers)
    ? teamMembers.some(
        (member) => normalizePinnedRowUsername(member?.username) === normalizedUsername,
      )
    : false;
};

export const mergePinnedRows = <TRow>(
  rows: readonly TRow[],
  pinnedRows: readonly TRow[] | undefined,
  getRowId: (row: TRow) => string | number,
) => {
  if (!pinnedRows?.length) {
    return [...rows];
  }

  const rowIds = new Set(rows.map((row) => getRowId(row)));
  const uniquePinnedRows = pinnedRows.filter((row) => !rowIds.has(getRowId(row)));

  return [...uniquePinnedRows, ...rows];
};
