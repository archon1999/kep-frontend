import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Grid } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useChangePassword } from 'modules/account-settings/application';
import PasswordTextField from 'shared/components/common/PasswordTextField';
import { useScopedAsyncTask } from 'shared/hooks/useScopedAsyncTask';
import { getApiErrorMessage } from 'shared/lib/apiError';
import { toast } from 'sonner';
import SettingsSection from './SettingsSection';

const PasswordForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { trigger } = useChangePassword();
  const { isPending: isSaving, run } = useScopedAsyncTask(username ?? '');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState('');

  const passwordsMismatch = newPassword !== confirmPassword;
  const requiredError = (value: string) =>
    submitted && !value ? t('auth.requiredField') : undefined;
  const confirmationError =
    submitted && newPassword && confirmPassword && passwordsMismatch
      ? t('settings.confirmNewPasswordIncorrect')
      : requiredError(confirmPassword);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    setSubmitted(true);
    setSaveError('');
    if (!username || !oldPassword || !newPassword || !confirmPassword || passwordsMismatch) return;

    void run(() => trigger({ username, payload: { oldPassword, newPassword } }), {
      onSuccess: () => {
        toast.success(t('settings.saved'));
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSubmitted(false);
      },
      onError: (error) => {
        setSaveError(getApiErrorMessage(error, t('settings.changePasswordFailed')));
      },
    });
  };

  return (
    <SettingsSection title={t('settings.changePassword')}>
      <Box component="form" onSubmit={handleSave} aria-busy={isSaving}>
        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {saveError}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <PasswordTextField
              id="settings-old-password"
              fullWidth
              label={t('settings.oldPassword')}
              autoComplete="current-password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              error={Boolean(requiredError(oldPassword))}
              helperText={requiredError(oldPassword)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PasswordTextField
              id="settings-new-password"
              fullWidth
              label={t('settings.newPassword')}
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={Boolean(requiredError(newPassword))}
              helperText={requiredError(newPassword)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PasswordTextField
              id="settings-confirm-password"
              fullWidth
              label={t('settings.retypeNewPassword')}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={Boolean(confirmationError)}
              helperText={confirmationError}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          sx={{ mt: 3, '&[aria-disabled="true"]': { opacity: 0.65 } }}
          variant="contained"
          disabled={!username}
          aria-disabled={isSaving}
        >
          {t('settings.change')}
        </Button>
      </Box>
    </SettingsSection>
  );
};

export default PasswordForm;
