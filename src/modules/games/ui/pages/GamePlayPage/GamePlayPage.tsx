import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Link as RouterLink, useParams } from 'react-router';
import { Alert, Box, Button, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { useGameAudio, useGameScore } from 'modules/games/application';
import { type GameId, gameIds } from 'modules/games/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { LeaderboardCard } from '../../shared';
import { BugHuntGame, LogicCircuitGame, MemoryGridGame } from './components';

const CodeIslandsGame = lazy(
  () => import('modules/kepper-game/ui/pages/KepperGamePage/KepperGamePage'),
);
const KepperWorldGame = lazy(() => import('../KepperWorldPage/KepperWorldGame'));

const GameContent = ({ id }: { id: GameId }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const score = useGameScore(id, currentUser?.username);
  const audio = useGameAudio(id === 'keppy-world' ? null : id);
  const title = t(`games.catalog.${id}.title`);
  const fullWidthGame = id === 'code-islands' || id === 'keppy-world';
  const gameComponent = (() => {
    switch (id) {
      case 'code-islands':
        return (
          <CodeIslandsGame
            key={currentUser?.username ?? 'guest'}
            onScore={score.record}
            onAudioStart={audio.startFromGesture}
            onAudioStop={audio.stop}
            onAudioCue={audio.playCue}
            embedded
          />
        );
      case 'keppy-world':
        return (
          <KepperWorldGame
            onScore={score.record}
            best={score.best}
            player={currentUser?.username}
          />
        );
      case 'bug-hunt':
        return <BugHuntGame onScore={score.record} best={score.best} audio={audio} />;
      case 'logic-circuit':
        return <LogicCircuitGame onScore={score.record} best={score.best} audio={audio} />;
      case 'memory-grid':
        return <MemoryGridGame onScore={score.record} best={score.best} audio={audio} />;
    }
  })();

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack
        spacing={{ xs: 2, md: 2.5 }}
        sx={{ maxWidth: fullWidthGame ? 1440 : 1120, mx: 'auto', pb: 4 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <IconButton
            component={RouterLink}
            to={resources.Games}
            size="small"
            aria-label={t('games.back')}
            title={t('games.back')}
            sx={{ ml: -0.75, color: 'text.secondary' }}
          >
            <IconifyIcon icon="mdi:arrow-left" width={21} />
          </IconButton>
          <Typography
            component="h1"
            noWrap
            sx={{ minWidth: 0, flex: 1, fontSize: { xs: 21, md: 23 }, fontWeight: 700 }}
          >
            {title}
          </Typography>
          {id !== 'keppy-world' && (
            <IconButton
              size="small"
              aria-label={t(audio.muted ? 'games.world.musicOn' : 'games.world.musicOff')}
              aria-pressed={!audio.muted}
              title={t(audio.muted ? 'games.world.musicOn' : 'games.world.musicOff')}
              onClick={audio.toggleMuted}
              sx={{
                ml: 'auto',
                width: 38,
                height: 38,
                flex: '0 0 auto',
                color: audio.muted ? 'text.secondary' : 'primary.main',
              }}
            >
              <IconifyIcon
                icon={audio.muted ? 'mdi:music-note-off' : 'mdi:music-note'}
                width={19}
              />
            </IconButton>
          )}
        </Stack>
        {score.error && (
          <Alert
            severity="warning"
            action={
              <Button size="small" onClick={score.retry}>
                {t('games.retry')}
              </Button>
            }
          >
            {t('games.scoreError')}
          </Alert>
        )}
        <Stack spacing={{ xs: 2, md: 2.5 }}>
          <Box sx={{ minWidth: 0, width: '100%' }}>
            <Suspense fallback={<Skeleton height={520} variant="rounded" />}>
              {gameComponent}
            </Suspense>
          </Box>
          <Box sx={{ minWidth: 0, width: '100%' }}>
            <LeaderboardCard id={id} compact />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

const GamePlayPage = () => {
  const { gameId } = useParams();
  if (gameId === 'kepper-world') return <Navigate to={`${resources.Games}/keppy-world`} replace />;
  if (!gameId || !gameIds.includes(gameId as GameId))
    return <Navigate to={resources.NotFound} replace />;
  return <GameContent id={gameId as GameId} />;
};

export default GamePlayPage;
