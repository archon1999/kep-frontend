export interface CalendarEventEntity {
  id?: number;
  uid: number;
  type: number;
  title?: string;
  startTime?: string | null;
  finishTime?: string | null;
}
