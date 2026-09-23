import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useGameSession } from 'modules/kepper-game/application';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import GameWorld from './components/GameWorld.tsx';
import ProgramEditor from './components/ProgramEditor.tsx';

const KepperGamePage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const game = useGameSession(currentUser?.username);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => setShowHint(false), [game.level.id]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        game.run();
      }
      if (event.key === 'Escape' && game.playing) game.stop();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [game]);

  const resultText =
    game.feedback?.kind === 'fail'
      ? t(`game.failures.${game.feedback.reason}`, { scenario: game.feedback.scenario })
      : game.feedback?.kind === 'syntax'
        ? t('game.syntaxError', { line: game.feedback.line })
        : game.feedback?.kind === 'unavailable'
          ? t('game.unavailable')
          : '';

  return (
    <Box sx={{ ...responsivePagePaddingSx, maxWidth: 1660, mx: 'auto', color: '#172b48' }}>
      <Stack spacing={2.5}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            px: { xs: 2.5, md: 4 },
            py: { xs: 2.5, md: 3.5 },
            background: 'linear-gradient(115deg, #123d88, #2377dd 63%, #49a9ed)',
            color: 'white',
            boxShadow: '0 18px 42px #2b78cd2b',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 220,
              height: 220,
              border: '38px solid #ffffff16',
              borderRadius: '50%',
              right: -40,
              top: -95,
            }}
          />
          <Stack direction="row" alignItems="center" gap={2} sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}mascot/kepper/game-idle.png`}
              alt=""
              sx={{
                width: { xs: 72, md: 112 },
                height: { xs: 72, md: 112 },
                objectFit: 'contain',
                filter: 'drop-shadow(0 12px 15px #0b37716a)',
              }}
            />
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.9 }}>
                {t('game.chapter')}
              </Typography>
              <Typography
                component="h1"
                sx={{ fontSize: { xs: 27, md: 38 }, fontWeight: 900, lineHeight: 1.18 }}
              >
                {t('game.title')}
              </Typography>
              <Typography
                sx={{ opacity: 0.92, mt: 0.65, maxWidth: 700, fontSize: { xs: 13, md: 15 } }}
              >
                {t('game.subtitle')}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            bgcolor: '#f5faff',
            border: '1px solid #d9e9f8',
            borderRadius: 3,
            p: { xs: 1.5, md: 2 },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
            sx={{ mb: 1.5 }}
          >
            <Typography fontWeight={800}>{t('game.levelSelector')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('game.progress', {
                done: game.progress.completed.length,
                total: game.levels.length,
              })}
            </Typography>
          </Stack>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {game.levels.map((level) => {
              const locked = level.id > game.unlocked;
              const selected = level.id === game.level.id;
              const finished = game.progress.completed.includes(level.id);
              return (
                <Button
                  key={level.id}
                  disabled={locked || game.playing}
                  onClick={() => game.selectLevel(level.id)}
                  variant={selected ? 'contained' : 'outlined'}
                  startIcon={
                    <IconifyIcon
                      icon={
                        locked
                          ? 'mdi:lock-outline'
                          : finished
                            ? 'mdi:check-circle'
                            : 'mdi:circle-outline'
                      }
                      width={18}
                    />
                  }
                  sx={{
                    borderRadius: 2.2,
                    textTransform: 'none',
                    fontWeight: 800,
                    bgcolor: selected ? undefined : 'white',
                    minWidth: { xs: 'calc(50% - 4px)', sm: 140 },
                    justifyContent: 'flex-start',
                  }}
                >
                  {level.id}. {t(level.titleKey)}
                  {finished && (
                    <Box
                      component="span"
                      sx={{ ml: 0.5, color: selected ? '#fff7bf' : '#d89500', fontSize: 12 }}
                    >
                      {'★'.repeat(game.progress.stars[level.id] ?? 1)}
                    </Box>
                  )}
                </Button>
              );
            })}
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(game.progress.completed.length / game.levels.length) * 100}
            sx={{ mt: 1.75, height: 4, borderRadius: 2, bgcolor: '#dbe9fb' }}
          />
        </Box>

        <Stack direction={{ xs: 'column', lg: 'row' }} alignItems="stretch" gap={2.5}>
          <Box sx={{ minWidth: 0, flex: { lg: '1 1 60%' } }}>
            <Box
              sx={{
                bgcolor: 'white',
                border: '1px solid #dceaf7',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 12px 40px #14478a12',
                height: '100%',
              }}
            >
              <Box sx={{ p: { xs: 1.5, md: 2.2 } }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ sm: 'center' }}
                  gap={1}
                  sx={{ mb: 1.25 }}
                >
                  <Box>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Chip
                        size="small"
                        label={`${game.level.id} / ${game.levels.length}`}
                        sx={{ bgcolor: '#e3efff', color: '#1c62b7', fontWeight: 900 }}
                      />
                      <Typography variant="h6" fontWeight={900}>
                        {t(game.level.titleKey)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {t(game.level.descriptionKey)}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={t(game.level.conceptKey)}
                    sx={{
                      bgcolor: '#e5fbf5',
                      color: '#088e76',
                      fontWeight: 800,
                      alignSelf: 'flex-start',
                    }}
                  />
                </Stack>
                {game.level.scenarios.length > 1 && (
                  <Stack direction="row" alignItems="center" gap={0.75} sx={{ mb: 1.25 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      {t('game.testCases')}:
                    </Typography>
                    {game.level.scenarios.map((scenario, index) => (
                      <Button
                        key={scenario.id}
                        size="small"
                        disabled={game.playing}
                        variant={index === game.scenarioIndex ? 'contained' : 'outlined'}
                        onClick={() => game.selectScenario(index)}
                        sx={{ minWidth: 34, px: 0.8, borderRadius: 1.5 }}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </Stack>
                )}
                <GameWorld
                  map={game.map}
                  frame={game.currentFrame}
                  playing={game.playing}
                  completed={game.feedback?.kind === 'win'}
                  fallbackLabel={t('game.canvasFallback')}
                  ariaLabel={t('game.worldLabel')}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                  sx={{ mt: 1.3, px: 0.5 }}
                >
                  <Chip
                    size="small"
                    icon={<IconifyIcon icon="mdi:mouse" width={16} />}
                    label={t('game.rotateHint')}
                    sx={{ bgcolor: '#f1f7ff' }}
                  />
                  <Chip
                    size="small"
                    icon={<IconifyIcon icon="mdi:keyboard-outline" width={16} />}
                    label={t('game.keyboardHint')}
                    sx={{ bgcolor: '#f1f7ff' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {t('game.localSave')}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>

          <Box sx={{ minWidth: 0, flex: { lg: '1 1 40%' } }}>
            <Stack
              spacing={1.5}
              sx={{
                bgcolor: 'white',
                border: '1px solid #dceaf7',
                borderRadius: 4,
                p: { xs: 2, md: 2.5 },
                boxShadow: '0 12px 40px #14478a12',
                height: '100%',
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
              <Box sx={{ flex: 1 }} />
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={game.playing ? game.stop : game.run}
                  startIcon={<IconifyIcon icon={game.playing ? 'mdi:stop' : 'mdi:play'} />}
                  sx={{
                    flex: 1,
                    minWidth: 130,
                    textTransform: 'none',
                    fontWeight: 900,
                    borderRadius: 2,
                    boxShadow: '0 9px 20px #2d7fe045',
                  }}
                >
                  {t(game.playing ? 'game.stop' : 'game.run')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={game.resetProgram}
                  disabled={game.playing}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  {t('game.resetCode')}
                </Button>
              </Stack>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowHint((value) => !value)}
                sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
                startIcon={<IconifyIcon icon="mdi:lightbulb-outline" />}
              >
                {t(showHint ? 'game.hideHint' : 'game.showHint')}
              </Button>
              {showHint && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
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
                </Alert>
              )}
              {!game.feedback && (
                <Typography variant="caption" color="text.secondary" role="status">
                  {game.playing ? t('game.running') : t('game.runTip')}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default KepperGamePage;
