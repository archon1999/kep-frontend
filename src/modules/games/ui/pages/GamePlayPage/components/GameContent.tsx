import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useGamePlaySession } from 'modules/games/application/hooks/useGamePlaySession';
import { type GameId } from 'modules/games/domain';
import {
  BrainGame,
  BugHuntGame,
  LogicCircuitGame,
  MemoryGridGame,
} from 'modules/games/ui/pages/GamePlayPage/components';
import { LeaderboardCard } from 'modules/games/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import BackToListButton from 'shared/components/sections/common/BackToListButton';
import { responsivePagePaddingSx } from 'shared/lib/styles';

const CodeIslandsGame = lazy(
  () => import('modules/kepper-game/ui/pages/KepperGamePage/KepperGamePage'),
);
const KepperWorldGame = lazy(
  () => import('modules/games/ui/pages/KepperWorldPage/KepperWorldGame'),
);

const GameContent = ({ id }: { id: GameId }) => {
  const { t } = useTranslation();
  const { currentUser, score, audio } = useGamePlaySession(id);
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
      case 'math-compare':
      case 'quick-math':
      case 'number-sequence':
      case 'number-hunt':
      case 'memory-matrix':
        return (
          <BrainGame key={id} id={id} onScore={score.record} best={score.best} audio={audio} />
        );
    }
  })();

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack
        spacing={{ xs: 2, md: 2.5 }}
        sx={{ maxWidth: fullWidthGame ? 1440 : 1120, mx: 'auto', pb: 4 }}
      >
        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap" sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{ minWidth: 0, flex: '1 1 200px', fontSize: { xs: 21, md: 23 }, fontWeight: 700 }}
          >
            {title}
          </Typography>
          <BackToListButton to={resources.Games} />
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

export { GameContent };
