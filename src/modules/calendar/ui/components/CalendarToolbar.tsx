import { ToggleButton, ToggleButtonGroup, Stack, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';

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
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', md: 'center' }}
      justifyContent="space-between"
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          {currentRangeLabel}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="outlined" color="neutral" onClick={onToday} size="small">
            {t('calendar.today')}
          </Button>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Button shape="square" color="neutral" onClick={onPrev} size="small">
              <IconifyIcon icon="material-symbols:chevron-left-rounded" />
            </Button>
            <Button shape="square" color="neutral" onClick={onNext} size="small">
              <IconifyIcon icon="material-symbols:chevron-right-rounded" />
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <ToggleButtonGroup
        exclusive
        value={view}
        onChange={(_, nextView) => {
          if (!nextView) return;
          onChangeView(nextView);
        }}
        color="primary"
        size="small"
      >
        <ToggleButton value="dayGridMonth">{t('calendar.monthView')}</ToggleButton>
        <ToggleButton value="timeGridWeek">{t('calendar.weekView')}</ToggleButton>
        <ToggleButton value="timeGridDay">{t('calendar.dayView')}</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};

export default CalendarToolbar;
