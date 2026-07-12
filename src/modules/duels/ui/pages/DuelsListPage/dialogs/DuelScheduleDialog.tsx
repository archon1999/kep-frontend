import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DuelInvitation } from 'modules/duels/domain/index.ts';
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

const DuelScheduleDialog = ({
  open,
  mode,
  invitation,
  loading,
  onClose,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const isAccept = mode === 'accept';
  const [value, setValue] = useState<DateTimePickerValue>(null);
  const minStartTime = useMemo(() => {
    const start = new Date();
    // Keep a buffer over the backend's five-minute minimum so normal dialog
    // interaction and network latency cannot invalidate the selected time.
    start.setMinutes(start.getMinutes() + 10);
    start.setSeconds(0, 0);
    return parseDateTimePickerValue(start);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setValue(
      invitation?.proposedStartTime
        ? parseDateTimePickerValue(invitation.proposedStartTime)
        : minStartTime,
    );
  }, [invitation?.proposedStartTime, minStartTime, open]);

  const title = isAccept ? t('duels.acceptCallTitle') : t('duels.suggestNewTime');
  const description = isAccept
    ? t('duels.acceptCallDescription', {
        username: invitation?.challenger.username || '',
      })
    : t('duels.suggestNewTimeDescription', {
        username: invitation?.otherUser?.username || '',
      });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <DateTimePicker
            label={t('duels.startTime')}
            value={value}
            onChange={setValue}
            minDateTime={minStartTime ?? undefined}
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
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={onClose}>
          {t('duels.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            onSubmit(toBackendOffsetDateTime(formatDateTimePickerValue(value)))
          }
          disabled={!value?.isValid() || loading}
          sx={{ borderRadius: 999 }}
        >
          {isAccept ? t('duels.sendTimeProposal') : t('duels.sendCounterOffer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuelScheduleDialog;
