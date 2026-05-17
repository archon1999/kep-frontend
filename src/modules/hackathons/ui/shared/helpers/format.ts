import type { HackathonProject } from 'modules/hackathons/domain';
import { formatCalendarDateTime } from 'shared/lib/dateTime';

export const formatHackathonDateTime = (value?: string | null) =>
  formatCalendarDateTime(value);

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
