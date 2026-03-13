import { CalendarEventEntity } from '../entities/calendar-event.entity';

export interface CalendarRepository {
  getEvents: () => Promise<CalendarEventEntity[]>;
}
