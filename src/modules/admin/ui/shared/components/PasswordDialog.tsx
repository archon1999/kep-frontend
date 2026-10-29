import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from '@mui/material';
import { changeAdminPassword } from 'modules/admin/application';
import DialogHeader from 'shared/components/common/DialogHeader';
import { errorText, getFieldErrors } from '../helpers';
import { ConsoleError } from './ConsoleState';

export default function PasswordDialog({
  id,
  open,
  onClose,
}: {
  id: string;
  open: boolean;
  onClose: (changed?: boolean) => void;
}) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [done, setDone] = useState(false);
  const close = () => {
    if (busy) return;
    setPassword('');
    setConfirmation('');
    setError(null);
    setDone(false);
    onClose(done);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await changeAdminPassword(id, password, confirmation);
      setPassword('');
      setConfirmation('');
      setDone(true);
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  };
  const fields = getFieldErrors(error);
  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="xs"
      aria-labelledby="admin-password-title"
    >
      <DialogHeader
        id="admin-password-title"
        title={t('admin.actions.changePassword')}
        onClose={close}
        closeDisabled={busy}
      />
      <Stack component="form" onSubmit={submit}>
        <DialogContent>
          {done ? (
            <Alert severity="success">{t('admin.console.saved')}</Alert>
          ) : (
            <Stack spacing={2}>
              <TextField
                autoFocus
                type="password"
                autoComplete="new-password"
                required
                label={t('admin.console.fields.password')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={Boolean(fields.password)}
                helperText={errorText(fields.password)}
              />
              <TextField
                type="password"
                autoComplete="new-password"
                required
                label={t('admin.console.fields.password2')}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                error={Boolean(fields.confirmation)}
                helperText={errorText(fields.confirmation)}
              />
            </Stack>
          )}
          <ConsoleError error={error} />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>{t('common.close')}</Button>
          {!done && (
            <Button type="submit" variant="contained" loading={busy}>
              {t('admin.actions.changePassword')}
            </Button>
          )}
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
