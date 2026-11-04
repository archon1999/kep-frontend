export enum ContestStatus {
  NotStarted = -1,
  Already = 0,
  Finished = 1,
}

export const getContestScheduleStatus = (
  startTime?: string | null,
  finishTime?: string | null,
  now = Date.now(),
): ContestStatus | undefined => {
  const start = Date.parse(startTime ?? '');
  const finish = Date.parse(finishTime ?? '');

  if (finish <= now) return ContestStatus.Finished;
  if (start > now) return ContestStatus.NotStarted;
  if (start <= now && finish > now) return ContestStatus.Already;
  return undefined;
};

export const parseContestStatus = (value: unknown): ContestStatus => {
  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return ContestStatus.Already;
  }

  if (numeric === ContestStatus.NotStarted) return ContestStatus.NotStarted;
  if (numeric === ContestStatus.Finished) return ContestStatus.Finished;

  return ContestStatus.Already;
};
