import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useGamesLeaderboard, useGamesOverview } from 'modules/games/application';
import { gamesCatalog } from 'modules/games/ui/shared';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import FeaturedWorldTile from './components/FeaturedWorldTile';
import GameTile from './components/GameTile';
import OverallRankingPanel from './components/OverallRankingPanel';

const GamesPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const {
    data: leaderboard,
    error: leaderboardError,
    isLoading,
    mutate,
  } = useGamesLeaderboard('overall');
  const {
    data: overview,
    error: overviewError,
    isLoading: overviewLoading,
    mutate: refreshOverview,
  } = useGamesOverview(currentUser?.username);

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ maxWidth: 1480, mx: 'auto', mb: 3 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 29, md: 35 },
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
          }}
        >
          {t('games.title')}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.elevation1' }}>
          <Box component="img" src="/mascot/world/09-kepper.webp" alt="" sx={{ width: 56, height: 56, display: { xs: 'none', sm: 'block' } }} />
          <Box sx={{ flex: 1 }}><Typography fontWeight={600}>Keppy World</Typography><Typography variant="body2" color="text.secondary">{t('keppyWorld.intro')}</Typography></Box>
          <Button component={RouterLink} to={resources.KeppyWorld} variant="contained" endIcon={<IconifyIcon icon="mdi:arrow-right" />}>{t('keppyWorld.enterWorld')}</Button>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 7fr) minmax(0, 5fr)' },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          <FeaturedWorldTile best={overview.bestByGame['keppy-world']} />
          <GameTile id="code-islands" best={overview.bestByGame['code-islands']} featured />
        </Box>

        <Box component="section" aria-labelledby="quick-games-heading">
          <Stack direction="row" alignItems="baseline" sx={{ mb: 1.5 }}>
            <Typography id="quick-games-heading" variant="h6" component="h2" fontWeight={600}>
              {t('games.quickGames')}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              '@media (max-width: 359px)': { gridTemplateColumns: 'minmax(0, 1fr)' },
              gap: { xs: 1.25, sm: 1.5, md: 2.5 },
            }}
          >
            {gamesCatalog
              .filter(({ id }) => id !== 'keppy-world' && id !== 'code-islands')
              .map(({ id }) => (
                <GameTile key={id} id={id} best={overview.bestByGame[id]} />
              ))}
          </Box>
        </Box>

        <OverallRankingPanel
          leaderboard={leaderboard}
          leaderboardError={leaderboardError}
          isLoading={isLoading}
          onRetryLeaderboard={() => void mutate()}
          overview={overview}
          overviewError={overviewError}
          overviewLoading={overviewLoading}
          onRetryOverview={() => void refreshOverview()}
          isAuthenticated={Boolean(currentUser)}
        />
      </Stack>
    </Box>
  );
};

export default GamesPage;
