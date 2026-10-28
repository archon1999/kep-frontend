const dayLength = 86_400_000;
const dateParts = (value?: string) => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
  if (!match) return;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return;
  return { year, time: date.getTime() };
};

/** Compare calendar dates in the platform timezone, independent of the viewer's timezone. */
export const getBirthdayDetails = (date?: string, dateOfBirth?: string, now = new Date()) => {
  const upcoming = dateParts(date);
  if (!upcoming || !Number.isFinite(now.getTime())) return {};
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const today = Date.UTC(value('year'), value('month') - 1, value('day'));
  const daysRemaining = Math.round((upcoming.time - today) / dayLength);
  if (daysRemaining < 0) return {};
  const birth = dateParts(dateOfBirth);
  const age = birth ? upcoming.year - birth.year : undefined;
  return {
    daysRemaining,
    turningAge: age !== undefined && age > 0 && age <= 130 ? age : undefined,
  };
};
