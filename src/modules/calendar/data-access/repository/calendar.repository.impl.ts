import { apiClient } from 'shared/api';
import { mapCalendarEventDtoToEntity } from '../mappers/calendar.mapper';
import type { CalendarEventEntity, CalendarRepository } from '../../domain';

export class CalendarRepositoryImpl implements CalendarRepository {
  async getEvents(): Promise<CalendarEventEntity[]> {
    const events = await apiClient.apiCalendarEventsList();

    return (events ?? []).map(mapCalendarEventDtoToEntity);
  }
}

export const calendarRepository = new CalendarRepositoryImpl();
