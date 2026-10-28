import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatesSetArg, EventInput } from '@fullcalendar/core/index.js';
import ReactFullCalendar from '@fullcalendar/react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { contentGridSx, contentInsetSx } from 'app/theme/styles/content';
import {
  initialCalendarDate,
  useCalendarPage,
} from 'modules/calendar/application/hooks/useCalendarPage';
import type { CalendarEventEntity } from 'modules/calendar/domain';
import FullCalendar from 'shared/components/base/FullCalendar';
import EmptyState from 'shared/components/common/EmptyState';
import DefaultLoader from 'shared/components/loading/DefaultLoader';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { formatDateRange, formatDateTime, formatDateTimePattern } from 'shared/lib/dateTime';
import CalendarToolbar, { CalendarView } from './components/CalendarToolbar';

const formatRangeLabel = (start: Date, end: Date, view: CalendarView) => {
  if (view === 'timeGridDay') {
    return formatDateTime(start, 'fullDate');
  }

  if (view === 'timeGridWeek') {
    return formatDateRange(start, new Date(end.getTime() - 1));
  }

  return formatDateTime(start, 'monthYear');
};

const mapToEventInput = (
  event: CalendarEventEntity,
  defaultTitle: string,
  color: string,
  textColor: string,
): EventInput => ({
  id: (event.id ?? event.uid).toString(),
  title: event.title || defaultTitle,
  start: event.startTime || undefined,
  end: event.finishTime || undefined,
  backgroundColor: alpha(color, 0.12),
  borderColor: alpha(color, 0.45),
  textColor,
  display: 'block',
});

const CalendarPage = () => {
  const { events, isLoading, error, mutate, periodEvents, setRange, rangeLabel, setRangeLabel } =
    useCalendarPage();

  const { t } = useTranslation();
  const calendarRef = useRef<ReactFullCalendar | null>(null);
  const [view, setView] = useState<CalendarView>('dayGridMonth');
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
          theme.vars.palette.text.primary,
        ),
      );
  }, [eventColors, events, t, theme.palette.primary.main, theme.vars.palette.text.primary]);

  const handleDatesSet = (info: DatesSetArg) => {
    const currentView = info.view.type as CalendarView;

    setView(currentView);
    setRange({ start: info.view.currentStart, end: info.view.currentEnd });
    setRangeLabel(formatRangeLabel(info.view.currentStart, info.view.currentEnd, currentView));
  };

  const handleViewChange = (nextView: CalendarView) => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.changeView(nextView);
      setRangeLabel(formatRangeLabel(api.view.currentStart, api.view.currentEnd, nextView));
    }
  };

  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    api?.today();
    if (api) {
      setRangeLabel(formatRangeLabel(api.view.currentStart, api.view.currentEnd, view));
    }
  };

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    api?.prev();
    if (api) {
      setRangeLabel(formatRangeLabel(api.view.currentStart, api.view.currentEnd, view));
    }
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    api?.next();
    if (api) {
      setRangeLabel(formatRangeLabel(api.view.currentStart, api.view.currentEnd, view));
    }
  };

  return (
    <FramedPage>
      <PageHeader title={t('calendar.title')} subtitle={t('calendar.subtitle')} variant="detail" />
      {error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => void mutate()}>{t('common.retry')}</Button>}
        >
          {t('calendar.loadError')}
        </Alert>
      ) : isLoading ? (
        <Box sx={{ height: 420 }}>
          <DefaultLoader />
        </Box>
      ) : (
        <Box
          sx={{ ...contentGridSx, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 300px' } }}
        >
          <Box>
            <CalendarToolbar
              currentRangeLabel={rangeLabel}
              onToday={handleToday}
              onNext={handleNext}
              onPrev={handlePrev}
              onChangeView={handleViewChange}
              view={view}
            />
            <Box
              sx={{ overflowX: 'auto', '& > div': { minWidth: view === 'timeGridWeek' ? 620 : 0 } }}
            >
              <FullCalendar
                ref={calendarRef}
                events={calendarEvents}
                initialDate={initialCalendarDate}
                initialView={view}
                datesSet={handleDatesSet}
                height="auto"
                expandRows
                eventOverlap
                dayMaxEventRows={2}
                selectable={false}
              />
            </Box>
          </Box>
          <Box component="aside">
            <SectionHeader title={t('calendar.agenda')} description={rangeLabel} />
            {periodEvents.length ? (
              <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {periodEvents.map((event) => (
                  <Stack
                    component="li"
                    key={`${event.type}-${event.uid}`}
                    direction="row"
                    gap={2}
                    sx={{ ...contentInsetSx, borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Stack
                      alignItems="center"
                      sx={{ flexShrink: 0, width: 44, color: 'primary.main' }}
                    >
                      <Typography variant="metric" fontSize={30}>
                        {new Date(event.startTime!).getDate()}
                      </Typography>
                      <Typography variant="label">
                        {formatDateTimePattern(event.startTime, 'MMM')}
                      </Typography>
                    </Stack>
                    <Stack gap={1} sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ overflowWrap: 'anywhere' }}
                      >
                        {event.title || t('calendar.untitled')}
                      </Typography>
                      <Typography
                        component="time"
                        dateTime={event.startTime!}
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDateTime(event.startTime!, 'compactDateTimeNoComma')}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Box>
            ) : (
              <Box sx={contentInsetSx}>
                <EmptyState
                  compact
                  title={t('calendar.periodEmpty')}
                  description={t('calendar.periodEmptyHint')}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </FramedPage>
  );
};
export default CalendarPage;
