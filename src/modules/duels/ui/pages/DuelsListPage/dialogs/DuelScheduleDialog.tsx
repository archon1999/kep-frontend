import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DuelInvitation } from 'modules/duels/domain/index.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import {
  DateTimePickerValue,
  formatDateTimePickerValue,
  parseDateTimePickerValue,
  toBackendOffsetDateTime,
} from 'shared/lib/dateTime';

type Props = {
  open: boolean;
  mode: 'accept' | 'counter';
  invitation?: DuelInvitation | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
};

const MIN_START_LEAD_MS = 5 * 60 * 1000;
const START_TIME_STEP_MS = 5 * 60 * 1000;

const getScheduleTimes = () => {
  const minimum = new Date(Date.now() + MIN_START_LEAD_MS);
  const initial = new Date(Math.ceil(minimum.getTime() / START_TIME_STEP_MS) * START_TIME_STEP_MS);

  return {
    minimum: parseDateTimePickerValue(minimum),
    initial: parseDateTimePickerValue(initial),
  };
};

const DuelScheduleDialog = ({ open, mode, invitation, loading, onClose, onSubmit }: Props) => {
  const { t } = useTranslation();
  const isAccept = mode === 'accept';
  const [value, setValue] = useState<DateTimePickerValue>(null);
  const scheduleTimes = useMemo(getScheduleTimes, [open]);

  useEffect(() => {
    if (!open) return;
    setValue(
      invitation?.proposedStartTime
        ? parseDateTimePickerValue(invitation.proposedStartTime)
        : scheduleTimes.initial,
    );
  }, [invitation?.proposedStartTime, open, scheduleTimes.initial]);

  const title = isAccept ? t('duels.acceptCallTitle') : t('duels.suggestNewTime');
  const description = isAccept
    ? t('duels.acceptCallDescription', {
        username: invitation?.challenger.username || '',
      })
    : t('duels.suggestNewTimeDescription', {
        username: invitation?.otherUser?.username || '',
      });

  return (
    <Dialog
      aria-labelledby="duel-schedule-title"
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogHeader
        id="duel-schedule-title"
        title={title}
        subtitle={description}
        icon={<IconifyIcon icon="mdi:calendar-clock-outline" color="primary.main" />}
        onClose={onClose}
      />
      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={2}>
          <DateTimePicker
            label={t('duels.startTime')}
            value={value}
            onChange={setValue}
            minDateTime={scheduleTimes.minimum ?? undefined}
            disablePast
            ampm={false}
            minutesStep={5}
            format="DD.MM.YYYY HH:mm"
            slotProps={{
              textField: { fullWidth: true },
              popper: { placement: 'bottom-start' },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose} autoFocus>
          {t('duels.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(toBackendOffsetDateTime(formatDateTimePickerValue(value)))}
          disabled={!value?.isValid() || loading}
          loading={loading}
          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
        >
          {isAccept ? t('duels.sendTimeProposal') : t('duels.sendCounterOffer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuelScheduleDialog;
