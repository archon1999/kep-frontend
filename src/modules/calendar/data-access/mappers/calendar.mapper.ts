import type { CalendarEvent } from 'shared/api/orval/generated/endpoints/index.schemas';
import type { CalendarEventEntity } from '../../domain';

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
