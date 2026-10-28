import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { useTeamJoinPage } from 'modules/account-settings/application/hooks/useTeamJoinPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';

const TeamJoinPage = () => {
  const { navigate, isMutating, teamCode, handleJoin, error } = useTeamJoinPage();

  const { t } = useTranslation();

  return (
    <FramedPage>
      <PageHeader variant="detail" title={t('settings.joinTeam')} />
      <Box sx={{ p: 'var(--kep-content-inset)', maxWidth: 720, mx: 'auto' }}>
        <Card variant="section">
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
    </FramedPage>
  );
};

export default TeamJoinPage;
