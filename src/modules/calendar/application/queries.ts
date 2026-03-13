import useSWR from 'swr';
import { CalendarEventEntity } from '../domain/entities/calendar-event.entity';
import { HttpCalendarRepository } from '../data-access/repository/http.calendar.repository';

const repository = new HttpCalendarRepository();

export const useCalendarEvents = () =>
  useSWR<CalendarEventEntity[]>(['calendar-events'], () => repository.getEvents(), {
    suspense: false,
  });
