import { apiClient } from 'shared/api';

export const calendarApiClient = {
  listEvents: () => apiClient.apiCalendarEventsList(),
};
