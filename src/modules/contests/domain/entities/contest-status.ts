export enum ContestStatus {
  NotStarted = -1,
  Already = 0,
  Finished = 1,
}

export const parseContestStatus = (value: unknown): ContestStatus => {
  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return ContestStatus.Already;
  }

  if (numeric === ContestStatus.NotStarted) return ContestStatus.NotStarted;
  if (numeric === ContestStatus.Finished) return ContestStatus.Finished;

  return ContestStatus.Already;
};
