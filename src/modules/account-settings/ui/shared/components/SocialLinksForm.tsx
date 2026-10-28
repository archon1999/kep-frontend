import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Grid, LinearProgress, Stack, TextField } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useAccountSocial, useUpdateSocial } from 'modules/account-settings/application';
import type { AccountSocialLinks } from 'modules/account-settings/domain';
import { toast } from 'sonner';
import ConnectedAccountsPanel from './ConnectedAccountsPanel.tsx';
import SettingsSection from './SettingsSection';

const SocialLinksForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, error: loadError, mutate } = useAccountSocial(username);
  const { trigger, isMutating } = useUpdateSocial();
  const [formState, setFormState] = useState<AccountSocialLinks | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>();

  useEffect(() => {
    if (data) setFormState({ ...data });
  }, [data]);

  const handleChange =
    (field: keyof AccountSocialLinks) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev!, [field]: event.target.value }));
    };

  const handleReset = () => setFormState(data || null);

  const handleSave = async () => {
    if (!username || !formState) return;
    try {
      await trigger({ username, payload: formState });
      await mutate();
      setErrors(undefined);
      toast.success(t('settings.saved'));
    } catch (error: any) {
      setErrors(error?.data);
      toast.error(t('settings.error'));
    }
  };

  if (loadError)
    return (
      <SettingsSection title={t('settings.socialLinks')}>
        <Alert
          severity="error"
          action={<Button onClick={() => mutate()}>{t('common.retry')}</Button>}
        >
          {t('common.loadFailed')}
        </Alert>
      </SettingsSection>
    );

  return (
    <Stack direction="column" spacing={0}>
      <ConnectedAccountsPanel />

      <SettingsSection title={t('settings.socialLinks')}>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('settings.publicTelegram')}
                value={formState?.telegram || ''}
                onChange={handleChange('telegram')}
                error={Boolean(errors?.telegram?.length)}
                helperText={errors?.telegram?.[0]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('settings.codeforcesHandle')}
                value={formState?.codeforcesHandle || ''}
                onChange={handleChange('codeforcesHandle')}
                error={Boolean(errors?.codeforcesHandle?.length)}
                helperText={errors?.codeforcesHandle?.[0]}
              />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={isLoading || isMutating}
            >
              {t('settings.reset')}
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!formState || isLoading || isMutating}
            >
              {t('settings.save')}
            </Button>
          </Stack>
        </Stack>
      </SettingsSection>
    </Stack>
  );
};

export default SocialLinksForm;
