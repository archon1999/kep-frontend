import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentGridSx, contentInsetSx } from 'app/theme/styles/content';
import { useGamesPage } from 'modules/games/application/hooks/useGamesPage';
import { gamesCatalog } from 'modules/games/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import FeaturedWorldTile from './components/FeaturedWorldTile';
import GameTile from './components/GameTile';
import OverallRankingPanel from './components/OverallRankingPanel';

const GamesPage = () => {
  const {
    currentUser,
    leaderboard,
    leaderboardError,
    isLoading,
    mutate,
    overview,
    overviewError,
    overviewLoading,
    refreshOverview,
  } = useGamesPage();

  const { t } = useTranslation();

  return (
    <FramedPage>
      <PageHeader title={t('games.title')} subtitle={t('games.subtitle')} variant="detail" />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={2}
        alignItems={{ sm: 'center' }}
        sx={{ ...contentInsetSx, borderBottom: 1, borderColor: 'divider' }}
      >
        <Box
          component="img"
          src="/mascot/world/09-kepper.webp"
          alt=""
          sx={{ width: 56, height: 56, display: { xs: 'none', sm: 'block' } }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">
            <MixedText>Keppy World</MixedText>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('keppyWorld.intro')}
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to={resources.KeppyWorld}
          variant="contained"
          endIcon={<IconifyIcon icon="mdi:arrow-right" />}
        >
          {t('keppyWorld.enterWorld')}
        </Button>
      </Stack>
      <SectionHeader title={t('games.featured')} />
      <Box
        sx={{
          ...contentGridSx,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <FeaturedWorldTile best={overview.bestByGame['keppy-world']} />
        <GameTile id="code-islands" best={overview.bestByGame['code-islands']} featured />
      </Box>
      <Box
        sx={{ ...contentGridSx, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' } }}
      >
        <Box component="section" aria-labelledby="quick-games-heading">
          <SectionHeader id="quick-games-heading" title={t('games.quickGames')} />
          <Box
            sx={{
              ...contentGridSx,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
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
      </Box>
    </FramedPage>
  );
};

export default GamesPage;
