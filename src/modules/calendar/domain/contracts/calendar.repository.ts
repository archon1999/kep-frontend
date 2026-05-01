import type { CalendarEventEntity } from '../entities';

export interface CalendarRepository {
  getEvents: () => Promise<CalendarEventEntity[]>;
}
