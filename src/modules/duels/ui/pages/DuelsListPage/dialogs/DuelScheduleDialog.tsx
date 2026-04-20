import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DuelInvitation } from 'modules/duels/domain/index.ts';

type Props = {
  open: boolean;
  mode: 'accept' | 'counter';
  invitation?: DuelInvitation | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
};

const formatDateInput = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toBackendDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (num: number) => num.toString().padStart(2, '0');
  const local = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);
  return `${local}${sign}${offsetHours}:${offsetMinutes}`;
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
  const [value, setValue] = useState('');
  const minStartTime = useMemo(() => {
    const start = new Date();
    start.setMinutes(start.getMinutes() + 5);
    start.setSeconds(0, 0);
    return formatDateInput(start);
  }, []);

  useEffect(() => {
    if (!open) return;
    setValue(
      invitation?.proposedStartTime
        ? formatDateInput(new Date(invitation.proposedStartTime))
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
          <TextField
            label={t('duels.startTime')}
            type="datetime-local"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            inputProps={{ min: minStartTime }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={onClose}>
          {t('duels.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(toBackendDate(value))}
          disabled={!value || loading}
          sx={{ borderRadius: 999 }}
        >
          {isAccept ? t('duels.sendTimeProposal') : t('duels.sendCounterOffer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuelScheduleDialog;
