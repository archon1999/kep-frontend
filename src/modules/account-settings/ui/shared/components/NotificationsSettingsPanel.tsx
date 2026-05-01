import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useAccountGeneralInfo, useUpdateGeneralInfo } from 'modules/account-settings/application';

const NotificationsSettingsPanel = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;
  const [telegramNotificationsEnabled, setTelegramNotificationsEnabled] = useState(true);
  const { data: generalInfo, isLoading, mutate } = useAccountGeneralInfo(username);
  const { trigger: updateGeneralInfo, isMutating } = useUpdateGeneralInfo();

  useEffect(() => {
    if (generalInfo?.telegramNotificationsEnabled === undefined) return;
    setTelegramNotificationsEnabled(generalInfo.telegramNotificationsEnabled);
  }, [generalInfo?.telegramNotificationsEnabled]);

  const handleTelegramNotificationsChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!username || !generalInfo) return;

    const nextValue = event.target.checked;
    const previousValue = generalInfo.telegramNotificationsEnabled ?? true;

    setTelegramNotificationsEnabled(nextValue);

    try {
      await updateGeneralInfo({
        username,
        payload: {
          ...generalInfo,
          telegramNotificationsEnabled: nextValue,
        },
      });
      await mutate();
      toast.success(t('settings.saved'));
    } catch {
      setTelegramNotificationsEnabled(previousValue);
      toast.error(t('settings.error'));
    }
  };

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader
        title={t('notifications.title')}
        subheader={t('settings.botNotificationsSubtitle')}
      />
      <CardContent>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">{t('settings.botNotifications')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('settings.botNotificationsSubtitle')}
            </Typography>
          </Stack>
          <FormControlLabel
            control={(
              <Switch
                checked={telegramNotificationsEnabled}
                onChange={handleTelegramNotificationsChange}
                disabled={!username || isLoading || isMutating}
              />
            )}
            label={telegramNotificationsEnabled ? t('settings.enabled') : t('settings.disabled')}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettingsPanel;
