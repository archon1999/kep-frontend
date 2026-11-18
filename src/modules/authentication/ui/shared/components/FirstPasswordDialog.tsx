import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useSetFirstPassword } from 'modules/authentication/application';
import type { AuthUser } from 'modules/authentication/domain';
import PasswordTextField from 'shared/components/common/PasswordTextField';
import { toast } from 'sonner';

const passwordErrors = {
  password_too_short: 'tooShort',
  password_too_common: 'tooCommon',
  password_entirely_numeric: 'onlyNumbers',
  password_too_similar: 'tooSimilar',
} as const;

const FirstPasswordDialog = ({ user }: { user: AuthUser }) => {
  const { t } = useTranslation();
  const { setCurrentUser, refreshCurrentUser, signout } = useAuth();
  const { trigger, isMutating } = useSetFirstPassword();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string>();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isMutating) return;
    if (password !== confirmation) {
      setError('mismatch');
      return;
    }

    setError(undefined);
    try {
      const updatedUser = await trigger({ sub: String(user.id), password });
      setCurrentUser(updatedUser);
      toast.success(t('auth.firstPassword.saved'));
      void refreshCurrentUser().catch(() => {});
    } catch (failure) {
      const { status, data } = failure as {
        status?: number;
        data?: { errors?: (keyof typeof passwordErrors)[] };
      };
      const validationError = data?.errors?.[0];
      if (status === 409) void refreshCurrentUser().catch(() => {});
      setError((validationError && passwordErrors[validationError]) || 'saveError');
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="xs"
      aria-labelledby="first-password-title"
      aria-describedby="first-password-description"
    >
      <Box component="form" onSubmit={submit}>
        <DialogTitle id="first-password-title">{t('auth.firstPassword.title')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText id="first-password-description">
              {t('auth.firstPassword.description', { username: user.username })}
            </DialogContentText>
            {error && <Alert severity="error">{t(`auth.firstPassword.${error}`)}</Alert>}
            <input
              type="text"
              name="username"
              value={user.username}
              autoComplete="username"
              readOnly
              hidden
            />
            <PasswordTextField
              autoFocus
              fullWidth
              required
              autoComplete="new-password"
              name="password"
              label={t('auth.firstPassword.newPassword')}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isMutating}
            />
            <PasswordTextField
              fullWidth
              required
              autoComplete="new-password"
              name="confirmPassword"
              label={t('auth.firstPassword.confirmPassword')}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={isMutating}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={isMutating} onClick={() => void signout()}>
            {t('auth.firstPassword.signOut')}
          </Button>
          <Button type="submit" variant="contained" loading={isMutating}>
            {t('auth.firstPassword.save')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default FirstPasswordDialog;
