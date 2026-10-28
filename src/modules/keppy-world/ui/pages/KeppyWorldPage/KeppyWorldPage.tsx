import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentEntranceStyles } from 'app/theme/styles/transitions';
import { useKeppyWorldPage } from 'modules/keppy-world/application/hooks/useKeppyWorldPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { mascotPortraits, mascotVisuals } from '../../shared/helpers/mascot-visuals';
import { questPresentation } from '../../shared/helpers/quest-presentation';
import MascotPicker from './components/MascotPicker';
import PointRewardStatus from './components/PointRewardStatus';
import QuestChallenge from './components/QuestChallenge';
import WorldChat from './components/WorldChat';
import WorldMap from './components/WorldMap';
import {
  WorldGrowthDetails,
  WorldProgressCard,
  WorldUnlockNotice,
} from './components/WorldProgress';
import WorldRanking from './components/WorldRanking';

const WorldScene = lazy(() => import('./components/WorldScene'));
const surface = {
  bgcolor: 'background.default',
  border: 1,
  borderColor: 'divider',
  boxShadow: 'none',
  borderRadius: 0,
};
const KeppyWorldPage = () => {
  const {
    currentUser,
    isAuthLoading,
    game,
    audio,
    entered,
    setEntered,
    profile,
    run,
    saveProfile,
    resetProfileDraft,
    openPanel,
    closePanel,
    selectQuest,
    errorKey,
    connectionStatus,
    completedRun,
    mascot,
    setMascot,
    cosmetic,
    setCosmetic,
    panel,
    setPanel,
  } = useKeppyWorldPage();

  const { t } = useTranslation();
  const frame = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [profileCollapsed, setProfileCollapsed] = useState(false);
  const [chatFocused, setChatFocused] = useState(false);
  const toggleCollapsed = useCallback(() => setCollapsed((current) => !current), []);
  const tooltipContainer = useCallback(() => frame.current, []);
  const start = async () => {
    audio.startFromGesture();
    if (frame.current && !document.fullscreenElement)
      void frame.current.requestFullscreen?.().catch(() => undefined);
    const saved = await saveProfile();
    if (!saved) return;
    setEntered(true);
    await game.connect();
  };
  const exit = () => {
    game.leave();
    setEntered(false);
    setPanel(null);
    resetProfileDraft();
    if (document.fullscreenElement === frame.current)
      void document.exitFullscreen().catch(() => undefined);
  };

  return (
    <FramedPage>
      <PageHeader variant="detail" title={t('keppyWorld.welcome')} backTo={resources.Games} />
      <Box
        ref={frame}
        sx={{
          position: 'relative',
          minHeight: { xs: '78dvh', md: 700 },
          height: entered ? 'calc(100dvh - 145px)' : 'auto',
          borderRadius: 0,
          overflow: 'hidden',
          bgcolor: 'background.default',
          '&:fullscreen': {
            height: '100dvh',
            borderRadius: 0,
            overflowY: entered ? 'hidden' : 'auto',
          },
        }}
      >
        {!entered ? (
          <Box
            sx={{
              ...contentEntranceStyles,
              maxWidth: 1120,
              mx: 'auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '0.8fr 1.2fr' },
              gap: { xs: 3, md: 5 },
              p: { xs: 2, md: 5 },
              alignItems: 'center',
            }}
          >
            <Stack spacing={2.5}>
              <Box
                component="img"
                src="/games/keppy-world-preview.webp"
                alt=""
                sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 0 }}
              />
              <Box>
                <Typography
                  component="h2"
                  fontSize={{ xs: 26, md: 32 }}
                  lineHeight={1.15}
                  fontWeight={700}
                  mb={1.5}
                >
                  {t('keppyWorld.welcome')}
                </Typography>
                <Typography color="text.secondary" lineHeight={1.7} fontSize={15}>
                  {t('keppyWorld.intro')}
                </Typography>
              </Box>
              {game.world && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      {t('keppyWorld.growth.worldLevel', { count: game.world.level })}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {game.world.totalXp.toLocaleString()} XP
                    </Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={game.world.progress * 100} />
                </Box>
              )}
            </Stack>
            <Stack spacing={2.5}>
              {isAuthLoading || game.isLoading ? (
                <Skeleton variant="rounded" height={320} />
              ) : !currentUser ? (
                <Stack spacing={2}>
                  <Typography>{t('keppyWorld.signInDescription')}</Typography>
                  <Button
                    component={RouterLink}
                    to={`${resources.Login}?next=${encodeURIComponent(resources.KeppyWorld)}`}
                    variant="contained"
                  >
                    {t('keppyWorld.signIn')}
                  </Button>
                </Stack>
              ) : !game.data ? (
                <Alert
                  severity="warning"
                  action={
                    <Button onClick={() => void game.mutate()}>{t('keppyWorld.retry')}</Button>
                  }
                >
                  {t('keppyWorld.loadError')}
                </Alert>
              ) : (
                <>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography component="h3" fontSize={18} fontWeight={600}>
                      {t('keppyWorld.chooseMascot')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('keppyWorld.level', { count: profile?.level })}
                    </Typography>
                  </Stack>
                  <MascotPicker
                    mascotId={mascot}
                    cosmetic={cosmetic}
                    cosmetics={game.data.cosmetics}
                    disabled={game.pending}
                    onMascot={setMascot}
                    onCosmetic={setCosmetic}
                  />
                  {errorKey && <Alert severity="warning">{errorKey}</Alert>}
                  <Button
                    variant="contained"
                    size="large"
                    disabled={game.pending}
                    onClick={() => void start()}
                    startIcon={
                      game.pending ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <IconifyIcon icon="mdi:play" />
                      )
                    }
                  >
                    {t('keppyWorld.enterWorld')}
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        ) : (
          <>
            <Suspense
              fallback={
                <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                  <CircularProgress />
                </Box>
              }
            >
              {game.world && (
                <WorldScene
                  players={game.connection.players}
                  selfSessionId={game.connection.sessionId}
                  timeOffset={game.timeOffset}
                  quests={game.quests}
                  kioskQuests={game.connection.quests ?? game.quests}
                  world={game.world}
                  mascotVisuals={mascotVisuals}
                  onMove={game.move}
                  onQuestSelect={(id) => void selectQuest(id)}
                  disabled={
                    panel !== null ||
                    chatFocused ||
                    game.pending ||
                    connectionStatus !== 'connected'
                  }
                />
              )}
            </Suspense>
            {profile && (
              <Paper
                sx={{
                  ...surface,
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  width: profileCollapsed ? 'auto' : { xs: 200, md: 236 },
                  p: 1.5,
                }}
              >
                <Stack direction="row" alignItems="center" gap={1.25}>
                  <Box
                    component="img"
                    src={mascotPortraits[profile.mascotId]}
                    alt=""
                    sx={{ width: 42, height: 42, objectFit: 'contain' }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1, display: profileCollapsed ? 'none' : 'block' }}>
                    <Typography noWrap fontSize={14} fontWeight={700}>
                      {profile.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('keppyWorld.level', { count: profile.level })} ·{' '}
                      {profile.xp.toLocaleString()} XP
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    aria-label={t(
                      profileCollapsed ? 'keppyWorld.expandProfile' : 'keppyWorld.collapseProfile',
                    )}
                    aria-expanded={!profileCollapsed}
                    aria-controls="world-player-progress"
                    onClick={() => setProfileCollapsed((current) => !current)}
                  >
                    <IconifyIcon
                      icon={profileCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}
                      width={18}
                    />
                  </IconButton>
                </Stack>
                <Box id="world-player-progress" hidden={profileCollapsed}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.max(
                      0,
                      Math.min(100, (100 * profile.levelXp) / Math.max(1, profile.nextLevelXp)),
                    )}
                    sx={{ my: 1.25 }}
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      {t('keppyWorld.pointsReady')}
                    </Typography>
                    <Typography variant="caption" fontWeight={700}>
                      {game.quests.filter((quest) => quest.rewardEligible !== false).length} /{' '}
                      {game.pointCount}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            )}
            {game.world && (
              <>
                <WorldProgressCard
                  world={game.world}
                  collapsed={collapsed}
                  onCollapse={toggleCollapsed}
                  onPanel={openPanel}
                  tooltipContainer={tooltipContainer}
                />
                <WorldUnlockNotice
                  world={game.world}
                  active={connectionStatus === 'connected' && game.connection.world !== null}
                  onCue={() => audio.playCue('complete')}
                  onDetails={() => setPanel('growth')}
                />
              </>
            )}
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              sx={{ ...surface, position: 'absolute', bottom: 16, right: 16, px: 1, py: 0.5 }}
            >
              <Typography variant="caption" sx={{ px: 0.75, display: { xs: 'none', sm: 'block' } }}>
                {t('keppyWorld.online', { count: game.connection.players.length })}
              </Typography>
              <IconButton
                size="small"
                aria-label={t('keppyWorld.wave')}
                onClick={() => game.emote('wave')}
              >
                <IconifyIcon icon="mdi:hand-wave-outline" width={20} />
              </IconButton>
              <IconButton
                size="small"
                aria-label={t('keppyWorld.music')}
                aria-pressed={!audio.muted}
                onClick={audio.toggleMuted}
              >
                <IconifyIcon
                  icon={audio.muted ? 'mdi:music-note-off' : 'mdi:music-note'}
                  width={20}
                />
              </IconButton>
              <IconButton
                size="small"
                aria-label={t('keppyWorld.fullscreen')}
                onClick={() => {
                  if (document.fullscreenElement) void document.exitFullscreen();
                  else void frame.current?.requestFullscreen?.();
                }}
              >
                <IconifyIcon icon="mdi:fullscreen" width={20} />
              </IconButton>
              <IconButton size="small" aria-label={t('keppyWorld.leave')} onClick={exit}>
                <IconifyIcon icon="mdi:exit-to-app" width={20} />
              </IconButton>
            </Stack>
            {run && panel !== 'run' && (
              <Button
                variant="contained"
                onClick={() => setPanel('run')}
                startIcon={<IconifyIcon icon="mdi:flag-outline" />}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 72,
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                }}
              >
                {t(completedRun ? 'keppyWorld.completed' : 'keppyWorld.resume')}
              </Button>
            )}
            <WorldChat
              messages={game.connection.chatMessages ?? []}
              error={game.connection.chatError ?? null}
              connected={connectionStatus === 'connected'}
              hidden={panel !== null}
              onSend={game.chat}
              onFocusChange={setChatFocused}
            />
            {connectionStatus !== 'connected' && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(20,40,55,.5)',
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 10,
                }}
              >
                <Paper sx={{ ...surface, p: 3, maxWidth: 360, mx: 2 }}>
                  <Stack alignItems="center" spacing={2}>
                    {connectionStatus === 'error' ? (
                      <>
                        <Typography>
                          {t(`keppyWorld.${game.connection.error ?? 'connectionError'}`, {
                            defaultValue: t('keppyWorld.connectionError'),
                          })}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => void game.connect()}
                          disabled={game.pending}
                        >
                          {t('keppyWorld.retry')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <CircularProgress size={28} />
                        <Typography>
                          {t(
                            connectionStatus === 'reconnecting'
                              ? 'keppyWorld.reconnecting'
                              : 'keppyWorld.connecting',
                          )}
                        </Typography>
                      </>
                    )}
                    <Button onClick={exit}>{t('keppyWorld.leave')}</Button>
                  </Stack>
                </Paper>
              </Box>
            )}
            {errorKey && (
              <Alert
                severity="warning"
                onClose={game.clearError}
                sx={{ position: 'absolute', top: 180, left: 16, maxWidth: 360, zIndex: 15 }}
              >
                {errorKey}
              </Alert>
            )}
          </>
        )}
        <Dialog
          aria-labelledby="keppy-world-panel-title"
          open={panel !== null}
          disableRestoreFocus
          onClose={closePanel}
          container={() => frame.current}
          sx={{ position: 'absolute', '& .MuiBackdrop-root': { position: 'absolute' } }}
          maxWidth={panel === 'ranking' || panel === 'quests' ? 'xs' : 'sm'}
          fullWidth
          slotProps={{
            paper: {
              sx: { maxHeight: 'calc(100% - 40px)', m: 2, width: 'calc(100% - 32px)' },
            },
          }}
        >
          <DialogHeader
            id="keppy-world-panel-title"
            title={
              panel === 'run' && run
                ? t(`keppyWorld.kinds.${run.kind}`, { defaultValue: run.title })
                : t(`keppyWorld.${panel === 'growth' ? 'growth.title' : (panel ?? 'quests')}`)
            }
            icon={
              <IconifyIcon
                icon={
                  panel === 'run'
                    ? questPresentation(run?.kind ?? '').icon
                    : panel === 'ranking'
                      ? 'mdi:trophy-outline'
                      : panel === 'profile'
                        ? 'mdi:hanger'
                        : panel === 'map'
                          ? 'mdi:map-outline'
                          : panel === 'growth'
                            ? 'mdi:city-variant-outline'
                            : 'mdi:compass-outline'
                }
                width={23}
              />
            }
            onClose={closePanel}
          />
          <DialogContent sx={{ pb: 3 }}>
            {errorKey && (
              <Alert severity="warning" onClose={game.clearError} sx={{ mb: 2 }}>
                {errorKey}
              </Alert>
            )}
            {panel === 'ranking' && <WorldRanking />}
            {panel === 'map' && game.world && (
              <WorldMap
                world={game.world}
                players={game.connection.players}
                quests={game.quests}
                selfId={game.connection.sessionId}
              />
            )}
            {panel === 'growth' && game.world && <WorldGrowthDetails world={game.world} />}
            {panel === 'profile' && game.data && (
              <Stack spacing={2.5}>
                <MascotPicker
                  mascotId={mascot}
                  cosmetic={cosmetic}
                  cosmetics={game.data.cosmetics}
                  disabled={game.pending}
                  onMascot={setMascot}
                  onCosmetic={setCosmetic}
                />
                <Button
                  variant="contained"
                  disabled={game.pending}
                  onClick={() => void saveProfile().then((saved) => saved && setPanel(null))}
                >
                  {t('keppyWorld.save')}
                </Button>
              </Stack>
            )}
            {panel === 'quests' && (
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {t('keppyWorld.questHelp')} {t('keppyWorld.pointRewardRule')}
                </Typography>
                {game.quests.map((quest) => (
                  <Stack
                    key={quest.id}
                    direction="row"
                    gap={1.5}
                    alignItems="center"
                    sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <IconifyIcon
                      icon={questPresentation(quest.kind).icon}
                      width={22}
                      sx={{
                        color: quest.rewardEligible === false ? 'success.main' : 'primary.main',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontSize={14} fontWeight={600}>
                        {quest.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('keppyWorld.difficulty', { count: quest.difficulty })}
                      </Typography>
                      {quest.rewardEligible === false && (
                        <PointRewardStatus
                          readyAt={quest.rewardAvailableAt}
                          timeOffset={game.timeOffset}
                        />
                      )}
                    </Box>
                    <Typography
                      fontSize={13}
                      fontWeight={700}
                      color={quest.rewardEligible === false ? 'success.main' : 'text.primary'}
                    >
                      {quest.rewardEligible === false ? t('keppyWorld.practice') : `${quest.xp} XP`}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
            {panel === 'run' && run && (
              <Stack spacing={2}>
                <QuestChallenge
                  key={run.id}
                  run={run}
                  pending={game.pending}
                  timeOffset={game.timeOffset}
                  onSubmit={game.submit}
                  onDone={() => void game.abandon().then((done) => done && setPanel(null))}
                />
                {!completedRun && (
                  <Button
                    color="inherit"
                    size="small"
                    disabled={game.pending}
                    onClick={() => void game.abandon().then((done) => done && setPanel(null))}
                  >
                    {t('keppyWorld.abandon')}
                  </Button>
                )}
              </Stack>
            )}
            {panel === 'run' && !run && (
              <Stack spacing={2}>
                <Alert severity="info">{t('keppyWorld.expired')}</Alert>
                <Button onClick={closePanel}>{t('keppyWorld.backToWorld')}</Button>
              </Stack>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </FramedPage>
  );
};
export default KeppyWorldPage;
