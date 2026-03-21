import useSWR from 'swr';
import { calendarRepository } from '../data-access';
import { calendarKeys } from './keys';
import type { CalendarEventEntity } from '../domain';

export const useCalendarEvents = () =>
  useSWR<CalendarEventEntity[]>(calendarKeys.detail('events'), () => calendarRepository.getEvents(), {
    suspense: false,
  });
