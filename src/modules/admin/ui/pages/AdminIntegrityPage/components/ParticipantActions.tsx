import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { moderateContestant } from 'modules/admin/application/integrity';
import type {
  ReviewPerson,
  Sanction,
  SanctionAction,
} from 'modules/admin/domain/entities/integrity.types';
import { ConsoleError } from 'modules/admin/ui/shared/components/ConsoleState';

interface Props {
  contest: number;
  person: ReviewPerson;
  history: Sanction[];
  onClose: () => void;
  onSaved: () => Promise<unknown>;
}
export default function ParticipantActions({ contest, person, history, onClose, onSaved }: Props) {
  const { t } = useTranslation();
  const [account, setAccount] = useState(person.accounts[0]?.id ?? 0);
  const [action, setAction] = useState<SanctionAction | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const active = history.filter((h) => !h.revoked);
  const contestSanction = active.find((h) => h.entry === person.id && !h.account);
  const accountSanction = active.find((h) => h.account === account);
  const selected = person.accounts.find((u) => u.id === account);
  const contestAction = contestSanction ? 'reinstate' : 'exclude';
  const accountAction = accountSanction ? 'unblock' : 'block';
  const isAccount = action === 'block' || action === 'unblock';
  const restoring = action === 'unblock' || action === 'reinstate';
  const apply = async () => {
    if (!action || !reason.trim()) return;
    setBusy(true);
    setError(undefined);
    try {
      await moderateContestant(contest, person.id, {
        action,
        reason: reason.trim(),
        account: isAccount ? account : undefined,
      });
      await onSaved();
      onClose();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{person.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <BoxAction
            title={t('admin.integrity.contestScope')}
            description={t('admin.integrity.exclusionEffect')}
            label={t('admin.integrity.' + contestAction)}
            selected={action === contestAction}
            onClick={() => setAction(contestAction)}
            disabled={busy}
          />
          {person.accounts.length > 1 && (
            <TextField
              select
              label={t('admin.integrity.account')}
              value={account}
              onChange={(e) => {
                setAccount(Number(e.target.value));
                setAction(null);
              }}
            >
              {person.accounts.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          {selected && (
            <BoxAction
              title={t('admin.integrity.account') + ' · ' + selected.name}
              description={t('admin.integrity.blockEffect')}
              label={t('admin.integrity.' + accountAction)}
              selected={action === accountAction}
              disabled={
                busy ||
                selected.protected ||
                (!selected.active && !accountSanction) ||
                !!(accountSanction && accountSanction.entry !== person.id)
              }
              onClick={() => setAction(accountAction)}
            />
          )}
          {accountSanction && accountSanction.entry !== person.id && (
            <Alert severity="info">
              {t('admin.integrity.origin', { id: accountSanction.contest })}
            </Alert>
          )}
          {action && (
            <TextField
              label={t('admin.integrity.reason')}
              required
              multiline
              minRows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />
          )}
          <ConsoleError error={error} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={busy} onClick={onClose}>
          {t('admin.integrity.cancel')}
        </Button>
        <Button
          variant="contained"
          color={restoring ? 'primary' : 'error'}
          disabled={busy || !action || !reason.trim()}
          onClick={apply}
        >
          {t('admin.integrity.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function BoxAction({
  title,
  description,
  label,
  selected,
  onClick,
  disabled,
}: {
  title: string;
  description: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Stack
      spacing={1}
      alignItems="flex-start"
      sx={{
        p: 1.5,
        border: 1,
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Button
        variant={selected ? 'contained' : 'outlined'}
        size="small"
        aria-pressed={selected}
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </Button>
    </Stack>
  );
}
