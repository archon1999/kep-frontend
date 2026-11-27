import { useState } from 'react';
import { useCalendarEvents } from 'modules/calendar/application';

export const initialCalendarDate = new Date();

export const useCalendarPage = () => {
  const { data: events, isLoading, error, mutate } = useCalendarEvents();

  const [range, setRange] = useState({
    start: new Date(initialCalendarDate.getFullYear(), initialCalendarDate.getMonth(), 1),
    end: new Date(initialCalendarDate.getFullYear(), initialCalendarDate.getMonth() + 1, 1),
  });

  const periodEvents = (events ?? [])
    .filter((event) => {
      if (!event.startTime) return false;
      const start = new Date(event.startTime).getTime();
      const end = event.finishTime ? new Date(event.finishTime).getTime() : start;
      return start < range.end.getTime() && end >= range.start.getTime();
    })
    .sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime());
  return { events, isLoading, error, mutate, periodEvents, range, setRange };
};
