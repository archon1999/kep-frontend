import { calendarApiClient } from '../api/calendar.client';
import { mapCalendarEventDtoToEntity } from '../mappers/calendar.mapper';
import { CalendarRepository } from '../../domain/ports/calendar.repository';
import { CalendarEventEntity } from '../../domain/entities/calendar-event.entity';

export class HttpCalendarRepository implements CalendarRepository {
  async getEvents(): Promise<CalendarEventEntity[]> {
    const events = await calendarApiClient.listEvents();

    return (events ?? []).map(mapCalendarEventDtoToEntity);
  }
}
