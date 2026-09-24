import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useGameSession } from 'modules/kepper-game/application';
import { codeIslandsScore } from 'modules/kepper-game/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import GameWorld from './components/GameWorld.tsx';
import LevelNavigator from './components/LevelNavigator.tsx';
import ProgramEditor from './components/ProgramEditor.tsx';

type KepperGamePageProps = {
  onScore?: (score: number) => void;
  onAudioStart?: () => void;
  onAudioStop?: () => void;
  onAudioCue?: (kind: 'run' | 'correct' | 'wrong') => void;
  embedded?: boolean;
};

const KepperGamePage = ({
  onScore,
  onAudioStart,
  onAudioStop,
  onAudioCue,
  embedded = false,
}: KepperGamePageProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const game = useGameSession(currentUser?.username);
  const [showHint, setShowHint] = useState(false);
  const [speedAnchor, setSpeedAnchor] = useState<HTMLElement | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const revealBoardOnRunRef = useRef(false);
  const score = codeIslandsScore(game.progress);

  const runProgram = () => {
    if (game.playing) return;
    onAudioStart?.();
    onAudioCue?.('run');
    revealBoardOnRunRef.current = window.matchMedia('(max-width: 899.95px)').matches;
    if (
      revealBoardOnRunRef.current &&
      document.activeElement instanceof HTMLElement &&
      document.activeElement.matches('input, textarea, [contenteditable="true"]')
    ) {
      document.activeElement.blur();
    }
    game.run();
  };

  useEffect(() => setShowHint(false), [game.level.id]);
  useEffect(() => {
    if (score > 0) onScore?.(score);
  }, [onScore, score]);
  useEffect(() => {
    if (game.feedback?.kind === 'win') onAudioCue?.('correct');
    else if (game.feedback && game.feedback.kind !== 'unavailable') onAudioCue?.('wrong');
  }, [game.feedback, onAudioCue]);
  useEffect(() => {
    if (game.progress.completed.length === game.levels.length) onAudioStop?.();
  }, [game.progress.completed.length, game.levels.length, onAudioStop]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        runProgram();
      }
      if (event.key === 'Escape' && game.playing) game.stop();
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable || target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!typing && !game.playing && event.key === 'ArrowLeft')
        game.seekFrame(game.frameIndex - 1);
      if (!typing && !game.playing && event.key === 'ArrowRight')
        game.seekFrame(game.frameIndex + 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [game]);
  useEffect(() => {
    if (!game.playing || !revealBoardOnRunRef.current) return;
    revealBoardOnRunRef.current = false;
    const board = boardRef.current;
    if (!board) return;
    const bounds = board.getBoundingClientRect();
    const visibleHeight = window.visualViewport?.height ?? window.innerHeight;
    if (bounds.top < 80 || bounds.bottom > visibleHeight - 76) {
      board.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [game.playing]);

  const resultText =
    game.feedback?.kind === 'fail'
      ? t(`game.failures.${game.feedback.reason}`, { scenario: game.feedback.scenario })
      : game.feedback?.kind === 'syntax'
        ? t('game.syntaxError', { line: game.feedback.line })
        : game.feedback?.kind === 'unavailable'
          ? t('game.unavailable')
          : '';

  return (
    <Box
      sx={
        embedded
          ? { width: '100%', pb: { xs: 'calc(84px + env(safe-area-inset-bottom))', md: 0 } }
          : {
              ...responsivePagePaddingSx,
              maxWidth: 1660,
              mx: 'auto',
              pb: { xs: 'calc(84px + env(safe-area-inset-bottom))', md: 3, lg: 5 },
            }
      }
    >
      <Stack spacing={2}>
        {!embedded && (
          <PageHeader
            title={t('game.title')}
            paperSx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}
            actionComponent={
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Box
                  component="img"
                  src={`${import.meta.env.BASE_URL}mascot/kepper/game-idle.png`}
                  alt=""
                  sx={{ width: 58, height: 58, objectFit: 'contain' }}
                />
                <Stack spacing={0.25}>
                  <Typography variant="overline" color="primary.main" fontWeight={700}>
                    {t('game.chapter')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" maxWidth={380}>
                    {t('game.subtitle')}
                  </Typography>
                </Stack>
              </Stack>
            }
          />
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: 'minmax(0, 1.35fr) minmax(340px, .9fr)',
            },
            gap: { xs: 2.25, lg: 3 },
            alignItems: 'stretch',
          }}
        >
          <Paper
            ref={boardRef}
            background={0}
            sx={{
              minWidth: 0,
              overflow: 'hidden',
              borderRadius: 0,
              border: 0,
              outline: 'none',
              boxShadow: 'none',
              scrollMarginTop: { xs: 80, md: 0 },
            }}
          >
            <Box sx={{ pb: 1 }}>
              <LevelNavigator
                levels={game.levels}
                selected={game.level.id}
                unlocked={game.unlocked}
                completed={game.progress.completed}
                score={score}
                stars={game.progress.stars}
                playing={game.playing}
                onSelect={game.selectLevel}
              />
              <GameWorld
                map={game.map}
                frame={game.currentFrame}
                playing={game.playing}
                completed={game.feedback?.kind === 'win'}
                fallbackLabel={t('game.canvasFallback')}
                ariaLabel={t('game.worldLabel')}
              />
              {game.level.scenarios.length > 1 && (
                <Stack direction="row" alignItems="center" gap={0.75} sx={{ mt: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                    {t('game.testCases')}:
                  </Typography>
                  {game.level.scenarios.map((scenario, index) => (
                    <Button
                      key={scenario.id}
                      size="small"
                      disabled={game.playing}
                      variant={index === game.scenarioIndex ? 'contained' : 'text'}
                      onClick={() => game.selectScenario(index)}
                      sx={{ minWidth: 32, px: 0.8 }}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </Stack>
              )}
              {(game.map.crystals.size > 0 ||
                game.map.switches.size > 0 ||
                game.map.fragile.size > 0 ||
                game.map.teleports.size > 0 ||
                game.map.conveyors.size > 0) && (
                <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mt: 1.5 }}>
                  {game.map.crystals.size > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {t('game.tiles.crystal')}
                    </Typography>
                  )}
                  {game.map.switches.size > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {t('game.tiles.switchGate')}
                    </Typography>
                  )}
                  {game.map.fragile.size > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {t('game.tiles.fragile')}
                    </Typography>
                  )}
                  {game.map.teleports.size > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {t('game.tiles.teleport')}
                    </Typography>
                  )}
                  {game.map.conveyors.size > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {t('game.tiles.conveyor')}
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
            {game.trace && (
              <Box sx={{ px: { xs: 1.5, md: 2 }, py: 1.5 }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Tooltip title={t('game.stepBack')}>
                    <span>
                      <IconButton
                        size="small"
                        aria-label={t('game.stepBack')}
                        disabled={game.playing || !game.trace || game.frameIndex === 0}
                        onClick={() => game.seekFrame(game.frameIndex - 1)}
                      >
                        <IconifyIcon icon="mdi:step-backward" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Slider
                    size="small"
                    min={0}
                    max={Math.max(1, (game.trace?.length ?? 1) - 1)}
                    value={game.frameIndex}
                    disabled={game.playing || !game.trace}
                    onChange={(_, value) => game.seekFrame(value as number)}
                    aria-label={t('game.playback')}
                    sx={{ flex: 1, minWidth: 70 }}
                  />
                  <Tooltip title={t('game.stepForward')}>
                    <span>
                      <IconButton
                        size="small"
                        aria-label={t('game.stepForward')}
                        disabled={
                          game.playing ||
                          !game.trace ||
                          game.frameIndex >= (game.trace?.length ?? 1) - 1
                        }
                        onClick={() => game.seekFrame(game.frameIndex + 1)}
                      >
                        <IconifyIcon icon="mdi:step-forward" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: 50, textAlign: 'right' }}
                  >
                    {game.trace ? `${game.frameIndex + 1}/${game.trace.length}` : '—'}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Paper>
          <Box component="section" sx={{ minWidth: 0, py: { xs: 0, lg: 0.5 } }}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
              }}
            >
              <ProgramEditor
                level={game.level}
                program={game.program}
                source={game.source}
                mode={game.mode}
                disabled={game.playing}
                onProgramChange={game.changeProgram}
                onSourceChange={game.changeSource}
                onModeChange={game.changeMode}
              />
              <Stack
                direction="row"
                alignItems="center"
                gap={0.75}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={game.playing ? game.stop : runProgram}
                  startIcon={<IconifyIcon icon={game.playing ? 'mdi:stop' : 'mdi:play'} />}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 1.25,
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                    minHeight: 44,
                    px: 1.5,
                    '& .MuiButton-startIcon': { mr: 0.5 },
                  }}
                >
                  {t(game.playing ? 'game.stop' : 'game.runShort')}
                </Button>
                <Tooltip title={t('game.speed')}>
                  <span>
                    <Button
                      size="small"
                      disabled={game.playing}
                      onClick={(event) => setSpeedAnchor(event.currentTarget)}
                      aria-label={`${t('game.speed')}: ${game.playbackSpeed}×`}
                      sx={{ minWidth: 48, height: 44, px: 0.5, fontWeight: 700, fontSize: 12 }}
                    >
                      {game.playbackSpeed}×
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title={t('game.showHint')}>
                  <IconButton
                    onClick={() => setShowHint((value) => !value)}
                    aria-label={t(showHint ? 'game.hideHint' : 'game.showHint')}
                    sx={{
                      width: 44,
                      height: 44,
                      color: showHint ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    <IconifyIcon icon="mdi:lightbulb-outline" width={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('game.resetCode')}>
                  <span>
                    <IconButton
                      onClick={game.resetProgram}
                      disabled={game.playing}
                      aria-label={t('game.resetCode')}
                      sx={{ width: 44, height: 44 }}
                    >
                      <IconifyIcon icon="mdi:restore" width={20} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
              {showHint && (
                <Alert severity="info" sx={{ borderRadius: 1 }}>
                  {t(game.level.hintKey)}
                </Alert>
              )}
              {game.feedback?.kind === 'win' && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  <Typography fontWeight={800}>
                    {t('game.won')} {'★'.repeat(game.feedback.stars)}
                  </Typography>
                  <Typography variant="body2">
                    {t('game.allTestsPassed', { count: game.level.scenarios.length })}
                  </Typography>
                  {game.level.id < game.levels.length && (
                    <Button
                      size="small"
                      onClick={() => game.selectLevel(game.level.id + 1)}
                      sx={{ mt: 0.5, textTransform: 'none' }}
                    >
                      {t('game.nextLevel')}
                    </Button>
                  )}
                </Alert>
              )}
              {game.feedback && game.feedback.kind !== 'win' && (
                <Alert severity="warning" sx={{ borderRadius: 2 }} role="status">
                  {resultText}
                  {game.feedback.kind === 'fail' &&
                    game.feedback.scenario !== game.scenarioIndex + 1 && (
                      <Button
                        size="small"
                        onClick={() => {
                          const failure = game.feedback;
                          if (failure?.kind === 'fail') game.selectScenario(failure.scenario - 1);
                        }}
                        sx={{ display: 'block', mt: 0.5, textTransform: 'none' }}
                      >
                        {t('game.viewFailedMap', { scenario: game.feedback.scenario })}
                      </Button>
                    )}
                </Alert>
              )}
              {game.playing && !game.feedback && (
                <Typography variant="caption" color="text.secondary" role="status">
                  {t('game.running')}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Stack>
      <Menu anchorEl={speedAnchor} open={Boolean(speedAnchor)} onClose={() => setSpeedAnchor(null)}>
        {[0.5, 1, 2].map((speed) => (
          <MenuItem
            key={speed}
            selected={game.playbackSpeed === speed}
            onClick={() => {
              game.setPlaybackSpeed(speed);
              setSpeedAnchor(null);
            }}
          >
            {speed}×
          </MenuItem>
        ))}
      </Menu>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          px: 2,
          pt: 1,
          pb: 'calc(8px + env(safe-area-inset-bottom))',
          bgcolor: 'background.default',
          boxShadow: '0 -8px 24px rgba(16, 48, 80, .10)',
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={game.playing ? game.stop : runProgram}
          aria-label={t(game.playing ? 'game.stop' : 'game.run')}
          startIcon={<IconifyIcon icon={game.playing ? 'mdi:stop' : 'mdi:play'} />}
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 48,
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 1.25,
            whiteSpace: 'nowrap',
            fontSize: 14,
            px: 1,
            '& .MuiButton-startIcon': { mr: 0.5 },
          }}
        >
          {t(game.playing ? 'game.stop' : 'game.runShort')}
        </Button>
        <Button
          size="small"
          disabled={game.playing}
          onClick={(event) => setSpeedAnchor(event.currentTarget)}
          aria-label={`${t('game.speed')}: ${game.playbackSpeed}×`}
          sx={{ minWidth: 42, minHeight: 48, px: 0.5, fontWeight: 700 }}
        >
          {game.playbackSpeed}×
        </Button>
        <IconButton
          onClick={() => setShowHint((value) => !value)}
          aria-label={t(showHint ? 'game.hideHint' : 'game.showHint')}
          sx={{
            flexShrink: 0,
            width: 40,
            height: 48,
            color: showHint ? 'primary.main' : 'text.secondary',
          }}
        >
          <IconifyIcon icon="mdi:lightbulb-outline" width={19} />
        </IconButton>
        <IconButton
          onClick={game.resetProgram}
          disabled={game.playing}
          aria-label={t('game.resetCode')}
          sx={{ flexShrink: 0, width: 40, height: 48 }}
        >
          <IconifyIcon icon="mdi:restore" width={19} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default KepperGamePage;
