import {
  type ComponentProps,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useWorldMusic, useWorldSession } from 'modules/games/application';
import {
  type WorldPoint,
  type WorldTerminal,
  isWorldTerminalAnswerFormat,
  worldBeacons,
  worldBridge,
  worldBridgeGaps,
  worldBridgePointAt,
  worldCoastline,
  worldDistance,
  worldRoutes,
  worldSecondCoastline,
  worldShards,
  worldSlowZones,
  worldStations,
  worldTerminals,
} from 'modules/games/domain/world/world';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MiniGameIntro from '../GamePlayPage/components/MiniGameIntro';
import KepperWorldScene, { type MoveControls } from './components/KepperWorldScene';

const MemoizedKepperWorldScene = memo(KepperWorldScene);

const WorldSceneMount = ({
  initialPosition,
  ...props
}: ComponentProps<typeof KepperWorldScene>) => {
  const [spawnPosition] = useState(initialPosition);
  return <MemoizedKepperWorldScene initialPosition={spawnPosition} {...props} />;
};

type Props = {
  onScore: (score: number) => void;
  best: number;
  player?: string;
};

const controlsForKey: Record<string, keyof MoveControls> = {
  w: 'forward',
  arrowup: 'forward',
  s: 'backward',
  arrowdown: 'backward',
  a: 'left',
  arrowleft: 'left',
  d: 'right',
  arrowright: 'right',
};

const timeLabel = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

const coastPoints = [...worldCoastline, ...worldSecondCoastline];
const mapBounds = {
  minX: Math.min(...coastPoints.map((point) => point.x)) - 1,
  maxX: Math.max(...coastPoints.map((point) => point.x)) + 1,
  minZ: Math.min(...coastPoints.map((point) => point.z)) - 1,
  maxZ: Math.max(...coastPoints.map((point) => point.z)) + 1,
};
const mapWidth = mapBounds.maxX - mapBounds.minX;
const mapHeight = mapBounds.maxZ - mapBounds.minZ;
const mapViewHeight = (mapHeight / mapWidth) * 100;
const mapPoint = (point: WorldPoint) => ({
  left: `${((point.x - mapBounds.minX) / mapWidth) * 100}%`,
  top: `${((point.z - mapBounds.minZ) / mapHeight) * 100}%`,
});
const mapSvgPoint = (point: WorldPoint) => ({
  x: ((point.x - mapBounds.minX) / mapWidth) * 100,
  y: ((point.z - mapBounds.minZ) / mapWidth) * 100,
});
const miniCoastPoints = (coastline: readonly WorldPoint[]) =>
  coastline
    .map((point) => {
      const { x, y } = mapSvgPoint(point);
      return `${x},${y}`;
    })
    .join(' ');
const mapEllipse = (x: number, z: number, radiusX: number, radiusZ: number) => ({
  cx: mapSvgPoint({ x, z }).x,
  cy: mapSvgPoint({ x, z }).y,
  rx: (radiusX / mapWidth) * 100,
  ry: (radiusZ / mapWidth) * 100,
});
const bridgeStartSvg = mapSvgPoint(worldBridge.start);
const bridgeEndSvg = mapSvgPoint(worldBridge.end);
const bridgeGapStartSvg = mapSvgPoint(worldBridgePointAt(worldBridgeGaps[0].startT));
const bridgeGapEndSvg = mapSvgPoint(worldBridgePointAt(worldBridgeGaps[0].endT));

const MiniMap = ({
  position,
  collected,
  solved,
  charged,
  beacons,
  routes,
}: {
  position: WorldPoint;
  collected: readonly string[];
  solved: readonly string[];
  charged: readonly string[];
  beacons: readonly string[];
  routes: readonly string[];
}) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box
        role="group"
        aria-label={t('games.world.map')}
        sx={{
          width: '100%',
          maxWidth: 244,
          aspectRatio: mapWidth / mapHeight,
          mx: 'auto',
          borderRadius: 1.5,
          position: 'relative',
          background: '#a9d2df',
          overflow: 'hidden',
        }}
      >
        <Box
          component="svg"
          viewBox={`0 0 100 ${mapViewHeight}`}
          aria-hidden="true"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <clipPath id="keppy-mini-main-coast">
              <polygon points={miniCoastPoints(worldCoastline)} />
            </clipPath>
            <clipPath id="keppy-mini-second-coast">
              <polygon points={miniCoastPoints(worldSecondCoastline)} />
            </clipPath>
          </defs>
          <line
            x1={bridgeStartSvg.x}
            y1={bridgeStartSvg.y}
            x2={bridgeGapStartSvg.x}
            y2={bridgeGapStartSvg.y}
            stroke="#d9b779"
            strokeWidth={(worldBridge.width / mapWidth) * 100}
          />
          <line
            x1={bridgeGapEndSvg.x}
            y1={bridgeGapEndSvg.y}
            x2={bridgeEndSvg.x}
            y2={bridgeEndSvg.y}
            stroke="#d9b779"
            strokeWidth={(worldBridge.width / mapWidth) * 100}
          />
          <polygon
            points={miniCoastPoints(worldCoastline)}
            fill="#d7e9dd"
            stroke="#a1cfc7"
            strokeWidth="0.9"
          />
          <g clipPath="url(#keppy-mini-main-coast)" opacity="0.78">
            <ellipse {...mapEllipse(-13, -6, 10, 8)} fill="#eadfc5" />
            <ellipse {...mapEllipse(2, -16, 11, 6)} fill="#b7dfda" />
            <ellipse {...mapEllipse(15, 0, 8, 12)} fill="#bdd8dc" />
            <ellipse {...mapEllipse(-1, 16, 15, 8)} fill="#cce7c7" />
          </g>
          <polygon
            points={miniCoastPoints(worldSecondCoastline)}
            fill="#eadfc7"
            stroke="#c7c9af"
            strokeWidth="0.9"
          />
          <g clipPath="url(#keppy-mini-second-coast)" opacity="0.72">
            <ellipse {...mapEllipse(40, -15, 7, 5)} fill="#c7e7d3" />
            <ellipse {...mapEllipse(50, -6, 7, 7)} fill="#c9dbd3" />
          </g>
        </Box>
        {worldSlowZones.map((zone) => (
          <Box
            key={`${zone.x}:${zone.z}`}
            component="span"
            sx={{
              position: 'absolute',
              ...mapPoint(zone),
              width: `${((zone.radius * 2) / mapWidth) * 100}%`,
              height: `${((zone.radius * 2) / mapHeight) * 100}%`,
              borderRadius: '50%',
              bgcolor: '#d7ceae99',
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }}
          />
        ))}
        {worldShards
          .filter((shard) => !collected.includes(shard.id))
          .map((shard) => (
            <Box
              key={shard.id}
              component="span"
              title={t('games.world.shard', { number: Number(shard.id.slice(1)) })}
              aria-label={t('games.world.shard', { number: Number(shard.id.slice(1)) })}
              sx={{
                position: 'absolute',
                ...mapPoint(shard),
                width: 11,
                height: 11,
                border: '2px solid white',
                borderRadius: 0.5,
                bgcolor: 'warning.main',
                transform: 'translate(-50%,-50%) rotate(45deg)',
              }}
            />
          ))}
        {worldTerminals.map((terminal, index) => (
          <Box
            key={terminal.id}
            component="span"
            title={t('games.world.relay', { number: index + 1 })}
            aria-label={t('games.world.relay', { number: index + 1 })}
            sx={{
              position: 'absolute',
              ...mapPoint(terminal),
              width: 16,
              height: 16,
              border: '2px solid white',
              borderRadius: '50%',
              bgcolor: solved.includes(terminal.id) ? 'success.main' : 'primary.main',
              transform: 'translate(-50%,-50%)',
            }}
          />
        ))}
        {worldStations.map((station, index) => (
          <Box
            key={station.id}
            component="span"
            title={t('games.world.station', { number: index + 1 })}
            sx={{
              position: 'absolute',
              ...mapPoint(station),
              width: 13,
              height: 13,
              border: '2px solid white',
              borderRadius: 0.75,
              bgcolor: charged.includes(station.id) ? 'success.main' : 'secondary.main',
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }}
          />
        ))}
        {worldBeacons
          .filter((beacon) => !beacons.includes(beacon.id))
          .map((beacon, index) => (
            <Box
              key={beacon.id}
              component="span"
              title={t('games.world.beacon', { number: index + 1 })}
              sx={{
                position: 'absolute',
                ...mapPoint(beacon),
                width: 12,
                height: 12,
                border: '2px solid white',
                borderRadius: 0.5,
                bgcolor: 'info.main',
                transform: 'translate(-50%,-50%) rotate(45deg)',
                pointerEvents: 'none',
              }}
            />
          ))}
        {worldRoutes
          .filter((route) => !routes.includes(route.id))
          .map((route, index) => (
            <Box
              key={route.id}
              component="span"
              title={t('games.world.routeTrial', { number: index + 1 })}
              sx={{
                position: 'absolute',
                ...mapPoint(route.checkpoints[0]),
                width: 14,
                height: 14,
                border: '2px solid white',
                borderRadius: '50%',
                bgcolor: 'warning.dark',
                transform: 'translate(-50%,-50%)',
                pointerEvents: 'none',
              }}
            />
          ))}
        <Box
          component="span"
          title={t('games.world.you')}
          sx={{
            position: 'absolute',
            ...mapPoint(position),
            width: 15,
            height: 15,
            border: '3px solid white',
            borderRadius: '50%',
            bgcolor: 'primary.dark',
            transform: 'translate(-50%,-50%)',
            zIndex: 2,
          }}
        />
      </Box>
    </Box>
  );
};

const WrittenTerminalAnswer = ({
  terminal,
  onAnswer,
}: {
  terminal: WorldTerminal;
  onAnswer: (response: string) => void;
}) => {
  const { t } = useTranslation();
  const [response, setResponse] = useState('');
  const valid = isWorldTerminalAnswerFormat(terminal, response);

  return (
    <Stack
      component="form"
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ sm: 'flex-start' }}
      spacing={1.25}
      onSubmit={(event) => {
        event.preventDefault();
        if (valid) onAnswer(response);
      }}
    >
      <TextField
        fullWidth
        autoComplete="off"
        label={t('games.world.answerLabel')}
        helperText={t(
          terminal.response === 'integer-list'
            ? 'games.world.answerListHint'
            : 'games.world.answerNumberHint',
        )}
        error={response.trim().length > 0 && !valid}
        value={response}
        onChange={(event) => setResponse(event.target.value)}
        slotProps={{
          htmlInput: { inputMode: terminal.response === 'integer' ? 'numeric' : 'text' },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!valid}
        sx={{ minWidth: 132, mt: { sm: 0.5 } }}
      >
        {t('games.world.submitAnswer')}
      </Button>
    </Stack>
  );
};

const KepperWorldGame = ({ onScore, best, player }: Props) => {
  const { t } = useTranslation();
  const session = useWorldSession(player ?? 'guest', onScore);
  const [started, setStarted] = useState(session.fallen);
  const music = useWorldMusic(started && !session.completed && !session.fallen);
  const [routesOpen, setRoutesOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [statsCollapsed, setStatsCollapsed] = useState(true);
  const fullscreenRootRef = useRef<HTMLDivElement>(null);
  const wasNativeFullscreen = useRef(false);
  const terminalOpenRef = useRef(session.openTerminal);
  const terminalEscapeAt = useRef(-Infinity);
  const controls = useRef<MoveControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });
  const sceneRef = useRef<HTMLDivElement>(null);
  terminalOpenRef.current = session.openTerminal;
  const terminal = worldTerminals.find((item) => item.id === session.openTerminal);
  const terminalNumber = terminal ? worldTerminals.indexOf(terminal) + 1 : 0;
  const totalObjectives =
    worldShards.length +
    worldTerminals.length +
    worldStations.length +
    worldBeacons.length +
    worldRoutes.length;
  const progress =
    ((session.collected.length +
      session.solved.length +
      session.charged.length +
      session.beacons.length +
      session.routes.length) /
      totalObjectives) *
    100;
  const remainingObjectives =
    totalObjectives -
    session.collected.length -
    session.solved.length -
    session.charged.length -
    session.beacons.length -
    session.routes.length;
  const lastHazardCueAt = useRef(-Infinity);
  const previouslyCompleted = useRef(session.completed);
  const resetRequiresConfirmation = progress > 0 || session.elapsed >= 20 || session.hits > 0;
  const canWalk =
    started && !session.openTerminal && !session.completed && !session.fallen && !resetOpen;
  const nearbyStation = worldStations.find(
    (station) =>
      !session.charged.includes(station.id) && worldDistance(session.position, station) < 1.9,
  );
  const terminalPrompt = useMemo(() => {
    if (session.completed) return undefined;
    if (session.nearbyTerminal) {
      return {
        id: session.nearbyTerminal.id,
        label: t('games.world.interact'),
        kind: 'interact' as const,
      };
    }
    if (session.nearbyLockedTerminal) {
      return {
        id: session.nearbyLockedTerminal.id,
        label: t('games.world.relayCooldown', { seconds: session.lockRemaining }),
        kind: 'locked' as const,
      };
    }
    return undefined;
  }, [
    session.completed,
    session.nearbyTerminal,
    session.nearbyLockedTerminal,
    session.lockRemaining,
    t,
  ]);
  const stationPrompt = useMemo(
    () =>
      nearbyStation &&
      !session.fallen &&
      !session.completed &&
      !session.nearbyTerminal &&
      !session.nearbyLockedTerminal
        ? { id: nearbyStation.id, label: t('games.world.stationNearHint') }
        : undefined,
    [
      nearbyStation,
      session.fallen,
      session.completed,
      session.nearbyTerminal,
      session.nearbyLockedTerminal,
      t,
    ],
  );
  const handleCollect = useCallback(
    (id: string) => {
      session.collect(id);
      if (remainingObjectives > 1) music.playCue('cell', Math.max(0, Number(id.slice(1)) - 1));
    },
    [session.collect, remainingObjectives, music.playCue],
  );
  const handleChargeStation = useCallback(
    (id: string) => {
      session.chargeStation(id);
      if (remainingObjectives > 1) music.playCue('correct');
    },
    [session.chargeStation, remainingObjectives, music.playCue],
  );
  const handleCollectBeacon = useCallback(
    (id: string) => {
      session.collectBeacon(id);
      if (remainingObjectives > 1) music.playCue('correct');
    },
    [session.collectBeacon, remainingObjectives, music.playCue],
  );
  const handleCompleteRoute = useCallback(
    (id: string) => {
      session.completeRoute(id);
      if (remainingObjectives > 1) music.playCue('correct');
    },
    [session.completeRoute, remainingObjectives, music.playCue],
  );
  const handleHazardHit = useCallback(() => {
    session.hitHazard();
    const now = performance.now();
    if (now - lastHazardCueAt.current > 5000) {
      music.playCue('wrong');
      lastHazardCueAt.current = now;
    }
  }, [session.hitHazard, music.playCue]);
  const handleFall = useCallback(() => {
    session.fall();
    music.playCue('wrong');
  }, [session.fall, music.playCue]);
  const handleInteract = useCallback(() => {
    session.interact();
    music.playCue('select');
  }, [session.interact, music.playCue]);
  const closeTerminal = useCallback(() => {
    session.setOpenTerminal(null);
    window.requestAnimationFrame(() => sceneRef.current?.focus({ preventScroll: true }));
  }, [session.setOpenTerminal]);
  const exitImmersive = () => {
    setImmersive(false);
    if (document.fullscreenElement === fullscreenRootRef.current) {
      void document.exitFullscreen().catch(() => undefined);
    }
    sceneRef.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const onFullscreenChange = () => {
      if (document.fullscreenElement === fullscreenRootRef.current) {
        wasNativeFullscreen.current = true;
      } else if (wasNativeFullscreen.current) {
        wasNativeFullscreen.current = false;
        if (terminalOpenRef.current || performance.now() - terminalEscapeAt.current < 600) {
          closeTerminal();
          window.setTimeout(() => sceneRef.current?.focus({ preventScroll: true }), 100);
        } else {
          setImmersive(false);
        }
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [closeTerminal]);
  useEffect(() => {
    if (!immersive) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !session.openTerminal) {
        terminalEscapeAt.current = -Infinity;
      }
      if (
        event.key === 'Escape' &&
        document.fullscreenElement !== fullscreenRootRef.current &&
        !resetOpen &&
        !session.openTerminal
      ) {
        setImmersive(false);
      }
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [immersive, resetOpen, session.openTerminal]);
  useEffect(() => {
    if (started) sceneRef.current?.focus({ preventScroll: true });
  }, [started]);
  useEffect(() => {
    if (started && !previouslyCompleted.current && session.completed) {
      music.playCue('complete');
    }
    previouslyCompleted.current = session.completed;
  }, [music.playCue, session.completed, started]);
  useEffect(() => {
    const isEditable = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      Boolean(target.closest('input, textarea, [contenteditable="true"]'));
    const down = (event: KeyboardEvent) => {
      if (isEditable(event.target)) return;
      const key = event.key.toLowerCase();
      const direction = controlsForKey[key];
      const sceneHasFocus = sceneRef.current?.contains(document.activeElement);
      if (direction && canWalk && sceneHasFocus) {
        event.preventDefault();
        controls.current[direction] = true;
      }
      if (key === ' ' && canWalk && sceneHasFocus) {
        event.preventDefault();
        if (!event.repeat) controls.current.jump = true;
      }
      if (
        (key === 'enter' || key === 'e') &&
        session.nearbyTerminal &&
        canWalk &&
        document.activeElement === sceneRef.current
      ) {
        event.preventDefault();
        session.interact();
        music.playCue('select');
      }
    };
    const up = (event: KeyboardEvent) => {
      const direction = controlsForKey[event.key.toLowerCase()];
      if (direction) controls.current[direction] = false;
      if (event.key === ' ') controls.current.jump = false;
    };
    const clear = () => {
      controls.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
      };
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
      clear();
    };
  }, [canWalk, music.playCue, session.interact, session.nearbyTerminal]);

  const pad = useMemo(
    () => [
      {
        key: 'forward' as const,
        icon: 'mdi:chevron-up',
        label: t('games.world.moveForward'),
        row: 1,
        col: 2,
      },
      {
        key: 'left' as const,
        icon: 'mdi:chevron-left',
        label: t('games.world.moveLeft'),
        row: 2,
        col: 1,
      },
      {
        key: 'backward' as const,
        icon: 'mdi:chevron-down',
        label: t('games.world.moveBackward'),
        row: 2,
        col: 2,
      },
      {
        key: 'right' as const,
        icon: 'mdi:chevron-right',
        label: t('games.world.moveRight'),
        row: 2,
        col: 3,
      },
    ],
    [t],
  );

  return (
    <Box
      ref={fullscreenRootRef}
      sx={
        immersive
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 1500,
              width: '100%',
              height: '100vh',
              '@supports (height: 100dvh)': { height: '100dvh' },
              overflow: 'hidden',
              bgcolor: '#d8ecf8',
            }
          : undefined
      }
    >
      {!started ? (
        <MiniGameIntro
          id="keppy-world"
          title={t('games.world.section')}
          description={t('games.world.intro')}
          action={t('gamesMinis.common.start')}
          onStart={() => {
            session.start();
            if (!session.completed) music.startFromGesture();
            setStatsCollapsed(true);
            setImmersive(true);
            const root = fullscreenRootRef.current;
            if (root?.requestFullscreen) {
              void root.requestFullscreen().catch(() => undefined);
            }
            setStarted(true);
          }}
        />
      ) : (
        <>
          <Box
            sx={{
              position: 'relative',
              minWidth: 0,
              height: immersive ? '100%' : undefined,
            }}
          >
            <Box
              ref={sceneRef}
              tabIndex={0}
              aria-label={t('games.world.walkHint')}
              onPointerDownCapture={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.closest('button, [role="dialog"], .MuiBackdrop-root')
                )
                  return;
                event.currentTarget.focus({ preventScroll: true });
              }}
              onBlur={(event) => {
                if (event.currentTarget.contains(event.relatedTarget)) return;
                controls.current = {
                  forward: false,
                  backward: false,
                  left: false,
                  right: false,
                  jump: false,
                };
              }}
              sx={{
                minWidth: 0,
                position: 'relative',
                overflow: 'hidden',
                height: immersive ? '100%' : undefined,
                borderRadius: immersive ? 0 : 3,
                bgcolor: '#d8ecf8',
                scrollMarginTop: { xs: 80, md: 96 },
                '& > div:first-of-type': immersive ? { height: '100%' } : undefined,
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 3,
                },
              }}
            >
              <WorldSceneMount
                key={`${player ?? 'guest'}-${session.sceneKey}`}
                initialPosition={session.position}
                collected={session.collected}
                solved={session.solved}
                charged={session.charged}
                beacons={session.beacons}
                routes={session.routes}
                controls={controls}
                paused={!canWalk}
                onMove={session.move}
                onCollect={handleCollect}
                onChargeStation={handleChargeStation}
                onCollectBeacon={handleCollectBeacon}
                onCompleteRoute={handleCompleteRoute}
                onHazardHit={handleHazardHit}
                onFall={handleFall}
                terminalPrompt={terminalPrompt}
                stationPrompt={stationPrompt}
                onInteract={handleInteract}
                fallbackLabel={t('games.world.sceneFallback')}
                ariaLabel={t('games.world.sceneLabel')}
              />
              {immersive && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<IconifyIcon icon="mdi:fullscreen-exit" width={19} />}
                  aria-label={t('games.world.exitFullscreen')}
                  title={t('games.world.exitFullscreen')}
                  onClick={exitImmersive}
                  sx={{
                    position: 'absolute',
                    zIndex: 7,
                    top: { xs: 12, md: 18 },
                    right: { xs: 12, md: 18 },
                    minWidth: { xs: 38, sm: 0 },
                    minHeight: 38,
                    px: { xs: 1, sm: 1.25 },
                    borderRadius: 1.5,
                    bgcolor: '#163557e8',
                    color: 'common.white',
                    textTransform: 'none',
                    '& .MuiButton-startIcon': { mx: { xs: 0, sm: 0.5 } },
                    '&:hover': { bgcolor: '#163557' },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {t('games.world.exitFullscreen')}
                  </Box>
                </Button>
              )}
              {session.fallen && (
                <Box
                  role="alert"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 6,
                    display: 'grid',
                    placeItems: 'center',
                    p: 2,
                    bgcolor: '#102b45bf',
                  }}
                >
                  <Box
                    sx={{
                      width: 'min(100%, 360px)',
                      p: { xs: 2.5, sm: 3 },
                      borderRadius: 2.5,
                      bgcolor: 'background.paper',
                      boxShadow: '0 18px 50px #0d243c50',
                    }}
                  >
                    <IconifyIcon icon="mdi:terrain" width={34} color="#e58e3b" />
                    <Typography variant="h5" fontWeight={750} sx={{ mt: 1.5 }}>
                      {t('games.world.fallTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                      {t('games.world.fallDescription')}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="baseline"
                      spacing={1}
                      sx={{ mt: 2.5, mb: 2.5 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {t('games.world.fallScore')}
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight={750}
                        sx={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {session.score}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        / 1000
                      </Typography>
                    </Stack>
                    <Button
                      variant="contained"
                      onClick={() => {
                        exitImmersive();
                        session.reset();
                        setStarted(false);
                      }}
                    >
                      {t('games.world.replay')}
                    </Button>
                  </Box>
                </Box>
              )}
              <Stack
                direction="row"
                alignItems="baseline"
                spacing={0.75}
                role="status"
                aria-label={`${t('games.world.score')} ${session.score} / 1000`}
                sx={{
                  position: 'absolute',
                  top: { xs: 12, md: 18 },
                  left: { xs: 12, md: 18 },
                  px: 1.4,
                  py: 0.55,
                  borderRadius: 1.5,
                  bgcolor: '#102e47e8',
                  color: 'common.white',
                  boxShadow: '0 6px 20px #09273a30',
                  pointerEvents: 'none',
                }}
              >
                <IconifyIcon icon="mdi:star-four-points" width={15} color="#f6c662" />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1.2, fontSize: 20 }}
                >
                  {session.score}
                </Typography>
                <Typography variant="caption" sx={{ color: '#bbd1dc', fontSize: 11 }}>
                  / 1000
                </Typography>
              </Stack>
              {(session.lastHit || session.lastWrong) && (
                <Box
                  role="status"
                  sx={{
                    position: 'absolute',
                    top: { xs: 59, md: 67 },
                    left: { xs: 12, md: 18 },
                    right: 12,
                    maxWidth: 360,
                    zIndex: 3,
                    p: 1,
                    borderRadius: 1.5,
                    bgcolor: session.lastHit ? '#91293ae8' : '#8a5623e8',
                    color: 'common.white',
                    boxShadow: '0 5px 15px #153a4a33',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography variant="caption" fontWeight={700}>
                    {t(session.lastHit ? 'games.world.hitWarning' : 'games.world.wrong')}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: { xs: 'grid', md: 'none' },
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  gridTemplateColumns: 'repeat(3, 44px)',
                  gridTemplateRows: 'repeat(2, 44px)',
                  gap: 0.5,
                }}
              >
                {pad.map((direction) => (
                  <Box
                    key={direction.key}
                    component="button"
                    type="button"
                    aria-label={direction.label}
                    disabled={!canWalk}
                    onPointerDown={(event: React.PointerEvent) => {
                      event.preventDefault();
                      event.currentTarget.setPointerCapture(event.pointerId);
                      controls.current[direction.key] = true;
                    }}
                    onPointerUp={() => {
                      controls.current[direction.key] = false;
                    }}
                    onPointerCancel={() => {
                      controls.current[direction.key] = false;
                    }}
                    sx={{
                      gridRow: direction.row,
                      gridColumn: direction.col,
                      border: 0,
                      bgcolor: '#102e47ce',
                      borderRadius: '50%',
                      color: 'common.white',
                      boxShadow: '0 5px 16px #09273a35',
                      display: 'grid',
                      placeItems: 'center',
                      touchAction: 'none',
                      cursor: 'pointer',
                      '&:active': { bgcolor: '#1c6081', transform: 'scale(0.96)' },
                      '&:disabled': { opacity: 0.5 },
                    }}
                  >
                    <IconifyIcon icon={direction.icon} width={27} />
                  </Box>
                ))}
              </Box>
              <Box
                component="button"
                type="button"
                aria-label={t('games.world.jump')}
                disabled={!canWalk}
                onPointerDown={(event: React.PointerEvent) => {
                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  controls.current.jump = true;
                }}
                onPointerUp={() => {
                  controls.current.jump = false;
                }}
                onPointerCancel={() => {
                  controls.current.jump = false;
                }}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  position: 'absolute',
                  right: 16,
                  bottom: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  px: 1.25,
                  height: 44,
                  border: 0,
                  borderRadius: 1.5,
                  bgcolor: '#102e47ce',
                  color: 'common.white',
                  boxShadow: '0 5px 16px #09273a35',
                  touchAction: 'none',
                  cursor: 'pointer',
                  '&:active': { bgcolor: '#1c6081', transform: 'scale(0.96)' },
                  '&:disabled': { opacity: 0.5 },
                }}
              >
                <IconifyIcon icon="mdi:arrow-up-bold" width={20} />
                <Typography variant="caption" fontWeight={700}>
                  {t('games.world.jump')}
                </Typography>
              </Box>
              <Box
                title={t('games.world.walkHint')}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  gap: 0.75,
                  position: 'absolute',
                  bottom: 18,
                  left: 18,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1.5,
                  bgcolor: '#163557d9',
                  color: 'common.white',
                  pointerEvents: 'none',
                }}
              >
                <IconifyIcon icon="mdi:keyboard-outline" width={18} />
                <Typography variant="caption" fontWeight={600}>
                  WASD · Space
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                minWidth: 0,
                position: immersive ? 'absolute' : { xs: 'relative', lg: 'absolute' },
                top: immersive ? { xs: 62, md: 66 } : { lg: 16 },
                right: immersive ? { xs: 12, md: 18 } : { lg: 16 },
                zIndex: 4,
                width: statsCollapsed
                  ? 'fit-content'
                  : { xs: immersive ? 'min(258px, calc(100vw - 24px))' : 'auto', lg: 258 },
                maxHeight: immersive ? 'calc(100% - 78px)' : { lg: 'calc(100% - 32px)' },
                overflowY: immersive ? 'auto' : { lg: 'auto' },
                mt: immersive ? 0 : { xs: 1.5, lg: 0 },
                ml: statsCollapsed && !immersive ? 'auto' : undefined,
                borderRadius: 1.5,
                bgcolor: '#102e47ef',
                color: '#f1f8fa',
                boxShadow: '0 12px 34px #09273a42',
                backdropFilter: 'blur(12px)',
                p: statsCollapsed ? 0.5 : 1.75,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minHeight: 30 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    flex: 1,
                    fontSize: statsCollapsed ? 14 : 13,
                    fontWeight: 700,
                    letterSpacing: statsCollapsed ? 0 : 0.2,
                    color: '#f1f8fa',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {statsCollapsed ? `${Math.round(progress)}%` : t('games.world.section')}
                </Typography>
                {!statsCollapsed && (
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#f6c662', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {Math.round(progress)}%
                  </Typography>
                )}
                <IconButton
                  size="small"
                  aria-label={t(
                    statsCollapsed ? 'games.world.expandStats' : 'games.world.collapseStats',
                  )}
                  aria-expanded={!statsCollapsed}
                  aria-controls="world-stats-content"
                  title={t(
                    statsCollapsed ? 'games.world.expandStats' : 'games.world.collapseStats',
                  )}
                  onClick={() => setStatsCollapsed((value) => !value)}
                  sx={{
                    width: 30,
                    height: 30,
                    ml: statsCollapsed ? 0.5 : 0,
                    color: '#d3e7ef',
                    '&:hover': { bgcolor: '#ffffff1d' },
                  }}
                >
                  <IconifyIcon
                    icon={statsCollapsed ? 'mdi:chevron-left' : 'mdi:chevron-right'}
                    width={20}
                  />
                </IconButton>
              </Stack>
              <Box
                id="world-stats-content"
                sx={{
                  display: statsCollapsed ? 'none' : 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  aria-label={t('games.world.section')}
                  sx={{
                    height: 3,
                    borderRadius: 0,
                    bgcolor: '#ffffff30',
                    '& .MuiLinearProgress-bar': { bgcolor: '#f6c662' },
                  }}
                />
                <Stack spacing={0.55} sx={{ pt: 0.25 }}>
                  {[
                    {
                      label: t('games.world.shardShort'),
                      value: session.collected.length,
                      total: worldShards.length,
                      icon: 'mdi:diamond-stone',
                      color: '#f6c662',
                    },
                    {
                      label: t('games.world.relayShort'),
                      value: session.solved.length,
                      total: worldTerminals.length,
                      icon: 'mdi:radio-tower',
                      color: '#8bd4f3',
                    },
                    {
                      label: t('games.world.stationShort'),
                      value: session.charged.length,
                      total: worldStations.length,
                      icon: 'mdi:lightning-bolt-circle',
                      color: '#caa4f7',
                    },
                    {
                      label: t('games.world.beaconShort'),
                      value: session.beacons.length,
                      total: worldBeacons.length,
                      icon: 'mdi:arrow-up-bold-circle-outline',
                      color: '#86ead1',
                    },
                    {
                      label: t('games.world.routeShort'),
                      value: session.routes.length,
                      total: worldRoutes.length,
                      icon: 'mdi:map-marker-path',
                      color: '#a5d9f5',
                    },
                  ].map((metric) => (
                    <Stack
                      key={metric.label}
                      direction="row"
                      alignItems="center"
                      gap={1}
                      sx={{ minHeight: 25 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          color: metric.value === metric.total ? '#69dfa8' : metric.color,
                          flex: '0 0 auto',
                        }}
                      >
                        <IconifyIcon icon={metric.icon} width={16} />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#d4e5ec',
                        }}
                      >
                        {metric.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{
                          fontSize: 13,
                          fontVariantNumeric: 'tabular-nums',
                          color: metric.value === metric.total ? '#69dfa8' : '#f1f8fa',
                        }}
                      >
                        {metric.value}
                        <Box
                          component="span"
                          sx={{
                            color: metric.value === metric.total ? 'inherit' : '#9cb6c4',
                            fontWeight: 500,
                          }}
                        >
                          /{metric.total}
                        </Box>
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: 0.75,
                    pt: 1,
                    borderTop: '1px solid #ffffff24',
                  }}
                >
                  {[
                    {
                      label: t('games.world.elapsed'),
                      value: timeLabel(session.elapsed),
                      icon: 'mdi:timer-outline',
                      color: '#8bd4f3',
                    },
                    {
                      label: t('games.world.hitsShort'),
                      value: session.hits,
                      icon: 'mdi:shield-alert-outline',
                      color: '#f6c662',
                    },
                    {
                      label: t('games.world.recordShort'),
                      value: best,
                      icon: 'mdi:trophy-outline',
                      color: '#caa4f7',
                    },
                  ].map((metric) => (
                    <Box key={metric.label} sx={{ minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={0.35}>
                        <Box sx={{ display: 'flex', color: metric.color }}>
                          <IconifyIcon icon={metric.icon} width={13} />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#abc1cc',
                            fontSize: 10,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {metric.label}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#f1f8fa',
                          fontWeight: 700,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {metric.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {session.completed ? (
                  <Box sx={{ mt: 1, px: 1.25, py: 1.5, borderRadius: 1, bgcolor: '#1c5b4b' }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#adf3ce' }}>
                      {t('games.world.complete')}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, mb: 1.5, color: '#e4f6ee' }}>
                      {t('games.world.completeDescription')}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={session.reset}
                    >
                      {t('games.world.replay')}
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant="text"
                      aria-expanded={routesOpen}
                      aria-controls="world-map"
                      onClick={() => setRoutesOpen((value) => !value)}
                      startIcon={<IconifyIcon icon="mdi:map-outline" width={19} />}
                      endIcon={
                        <IconifyIcon
                          icon={routesOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                          width={19}
                        />
                      }
                      sx={{
                        display: 'inline-flex',
                        minHeight: 34,
                        px: 0.5,
                        justifyContent: 'space-between',
                        textTransform: 'none',
                        fontSize: 12,
                        color: '#d3e7ef',
                        '&:hover': { bgcolor: '#ffffff16' },
                      }}
                    >
                      {t('games.world.map')}
                    </Button>
                    <Box id="world-map" sx={{ display: routesOpen ? 'block' : 'none', pt: 0.25 }}>
                      <MiniMap
                        position={session.position}
                        collected={session.collected}
                        solved={session.solved}
                        charged={session.charged}
                        beacons={session.beacons}
                        routes={session.routes}
                      />
                    </Box>
                  </>
                )}
                {!session.completed && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={0.5}
                    sx={{ mt: 'auto', pt: 1, borderTop: '1px solid #ffffff24' }}
                  >
                    <Button
                      size="small"
                      color="inherit"
                      startIcon={<IconifyIcon icon="mdi:restart" width={18} />}
                      onClick={() => {
                        if (resetRequiresConfirmation) setResetOpen(true);
                        else session.reset();
                      }}
                      sx={{
                        minWidth: 0,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        bgcolor: '#ffffff10',
                        color: '#d3e7ef',
                        textAlign: 'left',
                        fontSize: 12,
                        '&:hover': { bgcolor: '#ffffff24' },
                      }}
                    >
                      {t('games.world.reset')}
                    </Button>
                    <IconButton
                      size="small"
                      aria-label={t(music.muted ? 'games.world.musicOn' : 'games.world.musicOff')}
                      aria-pressed={!music.muted}
                      title={t(music.muted ? 'games.world.musicOn' : 'games.world.musicOff')}
                      onClick={music.toggleMuted}
                      sx={{
                        ml: 'auto',
                        width: 36,
                        height: 36,
                        flex: '0 0 auto',
                        borderRadius: 2,
                        bgcolor: '#ffffff10',
                        color: music.muted ? '#9db5c2' : '#d3e7ef',
                        '&:hover': { bgcolor: '#ffffff24' },
                      }}
                    >
                      <IconifyIcon
                        icon={music.muted ? 'mdi:music-note-off' : 'mdi:music-note'}
                        width={18}
                      />
                    </IconButton>
                  </Stack>
                )}
              </Box>
            </Box>
          </Box>

          <Dialog
            open={resetOpen}
            onClose={() => setResetOpen(false)}
            container={() => fullscreenRootRef.current}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>{t('games.world.resetConfirmTitle')}</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary">
                {t('games.world.resetConfirmBody')}
              </Typography>
            </DialogContent>
            <DialogActions
              sx={{
                px: 3,
                pb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'stretch',
                gap: 1,
                '& > :not(style) ~ :not(style)': { ml: 0 },
              }}
            >
              <Button
                onClick={() => setResetOpen(false)}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                {t('games.world.cancel')}
              </Button>
              <Button
                variant="contained"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
                onClick={() => {
                  session.reset();
                  setResetOpen(false);
                }}
              >
                {t('games.world.resetConfirmAction')}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={Boolean(terminal)}
            onClose={(_, reason) => {
              if (reason === 'escapeKeyDown') terminalEscapeAt.current = performance.now();
              closeTerminal();
            }}
            container={() => sceneRef.current}
            disableRestoreFocus
            maxWidth="sm"
            fullWidth
            sx={{
              position: 'absolute',
              '& .MuiBackdrop-root': { position: 'absolute', bgcolor: '#102e47ad' },
              '& .MuiDialog-container': { p: { xs: 1.5, sm: 2.5 } },
              '& .MuiDialog-paper': {
                m: 0,
                maxHeight: '100%',
                borderRadius: 2,
                bgcolor: '#f7fbfc',
                boxShadow: '0 24px 72px #071f35a6',
              },
            }}
          >
            <DialogTitle sx={{ pb: 1, fontSize: { xs: 20, sm: 22 }, fontWeight: 700 }}>
              {t('games.world.puzzleTitle', { number: terminalNumber })}
            </DialogTitle>
            <DialogContent sx={{ pt: '8px !important' }}>
              {terminal && (
                <Stack spacing={1.75} sx={{ mb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {t(`games.world.terminals.${terminal.id}.intro`)}
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      px: { xs: 1.5, sm: 2 },
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: 'background.elevation2',
                      color: 'text.primary',
                      fontFamily: 'monospace',
                      fontSize: { xs: 12.5, sm: 14 },
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {t(`games.world.terminals.${terminal.id}.code`)}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.45 }}>
                    {t(`games.world.terminals.${terminal.id}.question`)}
                  </Typography>
                </Stack>
              )}
              {terminal?.response === 'choice' ? (
                <Stack spacing={1}>
                  {Array.from({ length: terminal.optionCount }, (_, index) => (
                    <Button
                      key={index}
                      variant="text"
                      onClick={() => {
                        const correct = session.answer(index);
                        if (!correct) music.playCue('wrong');
                        else if (remainingObjectives > 1) music.playCue('correct');
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        textTransform: 'none',
                        py: 1.2,
                        px: 2,
                        bgcolor: 'background.elevation1',
                        borderRadius: 1.5,
                      }}
                    >
                      {t(`games.world.terminals.${terminal.id}.options.${index}`)}
                    </Button>
                  ))}
                </Stack>
              ) : terminal ? (
                <WrittenTerminalAnswer
                  key={terminal.id}
                  terminal={terminal}
                  onAnswer={(response) => {
                    const correct = session.answer(response);
                    if (!correct) music.playCue('wrong');
                    else if (remainingObjectives > 1) music.playCue('correct');
                  }}
                />
              ) : null}
              {session.lastWrong && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {t('games.world.wrong')}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeTerminal}>{t('games.world.close')}</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default KepperWorldGame;
