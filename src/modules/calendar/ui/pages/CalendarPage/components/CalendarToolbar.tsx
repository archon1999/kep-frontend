import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@mui/material';
import { contentHeadingSx, contentInsetSx } from 'app/theme/styles/content';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';

export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
interface CalendarToolbarProps {
  currentRangeLabel: string;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  view: CalendarView;
  onChangeView: (view: CalendarView) => void;
}
const CalendarToolbar = ({
  currentRangeLabel,
  onToday,
  onNext,
  onPrev,
  onChangeView,
  view,
}: CalendarToolbarProps) => {
  const { t } = useTranslation();
  return (
    <Stack gap={2} sx={{ ...contentInsetSx, borderBottom: 1, borderColor: 'divider' }}>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Typography component="h2" aria-live="polite" sx={contentHeadingSx}>
          <MixedText>{currentRangeLabel}</MixedText>
        </Typography>
        <Stack direction="row" gap={1} alignItems="center">
          <Button variant="outlined" onClick={onToday} size="small">
            {t('calendar.today')}
          </Button>
          <Button
            shape="square"
            variant="outlined"
            color="neutral"
            onClick={onPrev}
            size="small"
            aria-label={t('common.pagination.previous')}
          >
            <IconifyIcon icon="mdi:chevron-left" />
          </Button>
          <Button
            shape="square"
            variant="outlined"
            color="neutral"
            onClick={onNext}
            size="small"
            aria-label={t('common.pagination.next')}
          >
            <IconifyIcon icon="mdi:chevron-right" />
          </Button>
        </Stack>
      </Stack>
      <ResponsiveTabs
        value={view}
        onChange={onChangeView}
        ariaLabel={t('calendar.title')}
        items={[
          { value: 'dayGridMonth', label: t('calendar.monthView') },
          { value: 'timeGridWeek', label: t('calendar.weekView') },
          { value: 'timeGridDay', label: t('calendar.dayView') },
        ]}
      />
    </Stack>
  );
};
export default CalendarToolbar;
