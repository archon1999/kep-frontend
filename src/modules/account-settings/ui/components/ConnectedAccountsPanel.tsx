import { Button, Card, CardContent, CardHeader, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import { useAccountConnections } from 'modules/kepcoin/application/queries';
import { useStartTask } from 'modules/kepcoin/application/mutations';

const ConnectedAccountsPanel = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { data, isLoading, mutate } = useAccountConnections();
  const { trigger: startTask, isMutating } = useStartTask();

  const resolveTaskUrl = (url?: string) => {
    if (!url) {
      return '';
    }

    return url.replace('{username}', currentUser?.username ?? '');
  };

  const handleConnect = async (taskSlug: string) => {
    try {
      const result = await startTask(taskSlug);
      if (!result?.url) {
        toast.error(t('settings.connectedAccountsStartError'));
        return;
      }

      const resolvedUrl = resolveTaskUrl(result.url);
      if (!resolvedUrl) {
        toast.error(t('settings.connectedAccountsStartError'));
        return;
      }

      if (result.actionType === 'redirect' || result.actionType === 'internal_link') {
        window.location.assign(resolvedUrl);
        return;
      }

      window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
      toast.success(t('settings.connectedAccountsOpened'));
      await mutate();
    } catch {
      toast.error(t('settings.connectedAccountsStartError'));
    }
  };

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader
        title={t('settings.connectedAccounts')}
        subheader={t('settings.connectedAccountsSubtitle')}
      />
      <CardContent>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}

        <Stack direction="column" spacing={2}>
          {(data?.connections ?? []).map((connection) => (
            <Stack
              key={connection.provider}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: 'background.level1',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="column" spacing={0.5}>
                <Typography variant="subtitle2">{connection.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {connection.isLinked && connection.username
                    ? connection.username
                    : t('settings.connectedAccountsNotLinked')}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  color={connection.isLinked ? 'success' : 'default'}
                  label={
                    connection.isLinked
                      ? t('settings.connectedAccountsLinked')
                      : t('settings.connectedAccountsNotLinked')
                  }
                />
                <Button variant="outlined" onClick={() => handleConnect(connection.taskSlug)}>
                  {connection.isLinked ? t('settings.reconnect') : t('settings.connect')}
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ConnectedAccountsPanel;
