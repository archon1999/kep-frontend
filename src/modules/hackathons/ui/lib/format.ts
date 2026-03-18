import { HackathonProject } from '../domain/entities/hackathon-project.entity';

const normalizeLocale = (locale?: string | null) => {
  if (!locale) return undefined;
  if (locale.includes('-')) return locale;

  const match = locale.match(/^([a-z]{2,3})([A-Z]{2})$/);
  if (!match) return locale;

  return `${match[1]}-${match[2]}`;
};

export const formatHackathonDateTime = (value?: string | null, locale?: string) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(normalizeLocale(locale), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
};

export const formatHackathonDuration = (value?: string | null) => {
  if (!value) return null;

  const normalized = value.trim();
  const match = normalized.match(/^(?:(\d+)\s+)?(\d{1,3}):(\d{2}):(\d{2})(?:\.\d+)?$/);

  if (!match) {
    return normalized;
  }

  const [, days = '0', hours = '0', minutes = '00', seconds = '00'] = match;
  const totalHours = Number(days) * 24 + Number(hours);

  return `${String(totalHours).padStart(2, '0')}:${minutes}:${seconds}`;
};

export const getHackathonProjectPoints = (hackathonProject?: HackathonProject | null) =>
  hackathonProject?.maxPoints
  ?? hackathonProject?.taskPoints?.reduce((sum, task) => sum + (task.points ?? 0), 0)
  ?? 0;
