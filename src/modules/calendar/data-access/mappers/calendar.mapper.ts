import { CalendarEvent } from 'shared/api/orval/generated/endpoints/index.schemas';
import { CalendarEventEntity } from '../../domain/entities/calendar-event.entity';

export const mapCalendarEventDtoToEntity = (
  event: CalendarEvent,
): CalendarEventEntity => ({
  id: event.id,
  uid: event.uid,
  type: event.type,
  title: event.title ?? undefined,
  startTime: event.startTime ?? undefined,
  finishTime: event.finishTime ?? undefined,
});
