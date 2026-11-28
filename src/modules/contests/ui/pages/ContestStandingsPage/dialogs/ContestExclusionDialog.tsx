import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useContestExclusionMutation } from 'modules/contests/application/mutations';
import type { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import { toast } from 'sonner';

interface Props {
  contestId: number;
  contestant: ContestantEntity;
  contestantId: number;
  onClose: () => void;
}

export default function ContestExclusionDialog({
  contestId,
  contestant,
  contestantId,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [saveError, setSaveError] = useState(false);
  const { trigger, isMutating } = useContestExclusionMutation(contestId, contestantId);
  const reinstate = Boolean(contestant.hasContestExclusion);
  const action = reinstate ? 'reinstate' : 'exclude';
  const title = t(reinstate ? 'admin.integrity.reinstate' : 'admin.integrity.exclude');
  const name = contestant.team?.name || contestant.username || `#${contestantId}`;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedReason = reason.trim();
    if (!trimmedReason || isMutating) return;
    setSaveError(false);
    try {
      await trigger({ action, reason: trimmedReason });
      toast.success(
        t(
          reinstate ? 'contests.standings.entrantReinstated' : 'contests.standings.entrantExcluded',
        ),
      );
      onClose();
    } catch {
      setSaveError(true);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="xs"
      aria-labelledby="contest-exclusion-title"
      onClose={() => {
        if (!isMutating) onClose();
      }}
    >
      <Stack component="form" onSubmit={submit}>
        <DialogTitle id="contest-exclusion-title">{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography fontWeight={700}>{name}</Typography>
              {!reinstate && (
                <Typography variant="body2" color="text.secondary">
                  {t('admin.integrity.exclusionEffect')}
                </Typography>
              )}
            </Stack>
            <TextField
              autoFocus
              required
              multiline
              minRows={2}
              label={t('admin.integrity.reason')}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={isMutating}
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />
            {saveError && <Alert severity="error">{t('contests.standings.moderationError')}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={isMutating} onClick={onClose}>
            {t('admin.integrity.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={reinstate ? 'primary' : 'error'}
            loading={isMutating}
            disabled={!reason.trim()}
          >
            {title}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
