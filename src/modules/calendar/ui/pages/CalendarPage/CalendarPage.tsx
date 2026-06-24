import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatesSetArg, EventInput } from '@fullcalendar/core/index.js';
import ReactFullCalendar from '@fullcalendar/react';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCalendarEvents } from 'modules/calendar/application';
import type { CalendarEventEntity } from 'modules/calendar/domain';
import FullCalendar from 'shared/components/base/FullCalendar';
import { formatDateRange, formatDateTime } from 'shared/lib/dateTime';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import CalendarToolbar, { CalendarView } from './components/CalendarToolbar';

const initialCalendarDate = new Date();

const formatRangeLabel = (start: Date, end: Date, view: CalendarView) => {
  if (view === 'timeGridDay') {
    return formatDateTime(start, 'fullDate');
  }

  if (view === 'timeGridWeek') {
    return formatDateRange(start, end);
  }

  return formatDateTime(start, 'monthYear');
};

const mapToEventInput = (
  event: CalendarEventEntity,
  defaultTitle: string,
  color: string,
): EventInput => ({
  id: (event.id ?? event.uid).toString(),
  title: event.title || defaultTitle,
  start: event.startTime || undefined,
  end: event.finishTime || undefined,
  backgroundColor: color,
  borderColor: color,
  display: 'block',
});

const CalendarPage = () => {
  const { t } = useTranslation();
  const { data: events, isLoading, error } = useCalendarEvents();
  const calendarRef = useRef<ReactFullCalendar | null>(null);
  const [view, setView] = useState<CalendarView>('dayGridMonth');
  const [rangeLabel, setRangeLabel] = useState<string>(
    formatDateTime(initialCalendarDate, 'monthYear'),
  );
  const theme = useTheme();

  const eventColors = useMemo<Record<number, string>>(
    () => ({
      1: theme.palette.primary.main,
      2: theme.palette.info.main,
      3: theme.palette.warning.main,
      4: theme.palette.success.main,
    }),
    [
      theme.palette.info.main,
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ],
  );

  const calendarEvents = useMemo(() => {
    if (!events) return [];
    const fallbackTitle = t('calendar.untitled');

    return events
      .filter((event) => event.startTime)
      .map((event) =>
        mapToEventInput(
          event,
          fallbackTitle,
          eventColors[event.type] ?? theme.palette.primary.main,
        ),
      );
  }, [eventColors, events, t, theme.palette.primary.main]);

  const handleDatesSet = (info: DatesSetArg) => {
    setRangeLabel(formatRangeLabel(info.start, info.end, view));
  };

  const handleViewChange = (nextView: CalendarView) => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.changeView(nextView);
      setRangeLabel(formatRangeLabel(api.view.activeStart, api.view.activeEnd, nextView));
    }
    setView(nextView);
  };

  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    api?.today();
    if (api) {
      setRangeLabel(formatRangeLabel(api.view.activeStart, api.view.activeEnd, view));
    }
  };

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    api?.prev();
    if (api) {
      setRangeLabel(formatRangeLabel(api.view.activeStart, api.view.activeEnd, view));
    }
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    api?.next();
    if (api) {
      setRangeLabel(formatRangeLabel(api.view.activeStart, api.view.activeEnd, view));
    }
  };

  return (
    <Box sx={{ ...responsivePagePaddingSx, pt: { xs: 2, md: 4 } }}>
      <Stack direction="column" spacing={2}>
        <Stack direction="row">
          <Typography variant="h4" fontWeight={800}>
            {t('calendar.title')}
          </Typography>
        </Stack>

        <Stack direction="column" spacing={3}>
          <CalendarToolbar
            currentRangeLabel={rangeLabel}
            onToday={handleToday}
            onNext={handleNext}
            onPrev={handlePrev}
            onChangeView={handleViewChange}
            view={view}
          />

          <Box>
            {error ? (
              <Alert severity="error">{t('calendar.loadError')}</Alert>
            ) : isLoading ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ height: 420 }}
                spacing={1.5}
              >
                <CircularProgress color="primary" />
                <Typography variant="body2" color="text.secondary">
                  {t('calendar.loading')}
                </Typography>
              </Stack>
            ) : calendarEvents.length === 0 ? (
              <Stack direction="column" spacing={2}>
                <FullCalendar
                  ref={calendarRef}
                  events={calendarEvents}
                  initialDate={initialCalendarDate}
                  initialView={view}
                  datesSet={handleDatesSet}
                  height="auto"
                  expandRows
                  eventOverlap
                />
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {t('calendar.emptyTitle')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('calendar.emptySubtitle')}
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <FullCalendar
                ref={calendarRef}
                events={calendarEvents}
                initialDate={initialCalendarDate}
                initialView={view}
                datesSet={handleDatesSet}
                height="auto"
                expandRows
                eventOverlap
              />
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CalendarPage;
