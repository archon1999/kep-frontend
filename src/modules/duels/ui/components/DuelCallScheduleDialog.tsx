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
import { useTranslation } from 'react-i18next';
import { DuelInvitation } from '../../domain/index.ts';

type Props = {
  open: boolean;
  mode: 'accept' | 'counter';
  invitation?: DuelInvitation | null;
  value: string;
  minStartTime: string;
  loading?: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const DuelCallScheduleDialog = ({
  open,
  mode,
  invitation,
  value,
  minStartTime,
  loading,
  onChange,
  onClose,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const isAccept = mode === 'accept';
  const title = isAccept ? t('duels.acceptCallTitle') : t('duels.suggestNewTime');
  const description = isAccept
    ? t('duels.acceptCallDescription', {
        username: invitation?.challenger.displayName || invitation?.challenger.username || '',
      })
    : t('duels.suggestNewTimeDescription', {
        username: invitation?.otherUser?.displayName || invitation?.otherUser?.username || '',
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
            onChange={(event) => onChange(event.target.value)}
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
          onClick={onSubmit}
          disabled={!value || loading}
          sx={{ borderRadius: 999 }}
        >
          {isAccept ? t('duels.sendTimeProposal') : t('duels.sendCounterOffer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuelCallScheduleDialog;
