import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatesSetArg, EventInput } from '@fullcalendar/core/index.js';
import ruLocale from '@fullcalendar/core/locales/ru';
import uzLocale from '@fullcalendar/core/locales/uz';
import ReactFullCalendar from '@fullcalendar/react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { normalizeSupportedLocale } from 'app/locales/locale';
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

const calendarLocales = {
  'en-US': 'en',
  'ru-RU': ruLocale,
  'uz-UZ': uzLocale,
};

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
  const { events, isLoading, error, mutate, periodEvents, range, setRange } = useCalendarPage();

  const { t, i18n } = useTranslation();
  const calendarRef = useRef<ReactFullCalendar | null>(null);
  const [view, setView] = useState<CalendarView>('dayGridMonth');
  const theme = useTheme();
  const calendarLocale = calendarLocales[normalizeSupportedLocale(i18n.resolvedLanguage)];
  const rangeLabel = formatRangeLabel(range.start, range.end, view);

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
    setView(info.view.type as CalendarView);
    setRange({ start: info.view.currentStart, end: info.view.currentEnd });
  };

  const handleViewChange = (nextView: CalendarView) => {
    calendarRef.current?.getApi().changeView(nextView);
  };

  const handleToday = () => {
    calendarRef.current?.getApi().today();
  };

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
  };

  const handleNext = () => {
    calendarRef.current?.getApi().next();
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
                locale={calendarLocale}
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
