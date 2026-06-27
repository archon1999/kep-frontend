import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { toast } from 'sonner';
import { resources } from 'app/routes/resources';
import { useJoinTeam } from 'modules/account-settings/application';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const TeamJoinPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { trigger, isMutating } = useJoinTeam();
  const [error, setError] = useState('');

  const teamCode = id?.trim() ?? '';

  const handleJoin = async () => {
    if (!teamCode) return;

    setError('');

    try {
      await trigger(teamCode);
      toast.success(t('settings.saved'));
      navigate(resources.SettingsTeams);
    } catch {
      setError(t('settings.teamJoinFailed'));
    }
  };

  return (
    <Box sx={{ ...responsivePagePaddingSx, maxWidth: 720, mx: 'auto' }}>
      <Card background={1} sx={{ outline: 'none' }}>
        <CardHeader title={t('settings.joinTeam')} />
        <CardContent>
          <Stack spacing={2}>
            <Typography color="text.secondary">
              {t('settings.teamJoinInviteDescription')}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {t('settings.teamCodeLabel')}: {teamCode || '--'}
            </Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={() => navigate(resources.SettingsTeams)} disabled={isMutating}>
            {t('settings.cancel')}
          </Button>
          <Button variant="contained" onClick={handleJoin} disabled={!teamCode || isMutating}>
            {t('settings.join')}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default TeamJoinPage;
