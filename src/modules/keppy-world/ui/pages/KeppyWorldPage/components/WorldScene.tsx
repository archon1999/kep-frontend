import { Suspense, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { WORLD_INTERACT_DISTANCE } from 'modules/keppy-world/domain/utils/terrain';
import { mascotVisuals as defaultVisuals } from 'modules/keppy-world/ui/shared/helpers/mascot-visuals';
import { questPresentation } from 'modules/keppy-world/ui/shared/helpers/quest-presentation';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { WorldAvatar } from './WorldAvatar';
import { WorldEnvironment } from './WorldEnvironment';
import type { WorldMoveIntent, WorldSceneProps, WorldSceneQuest } from './world-scene.types';

export type {
  WorldScenePlayer,
  WorldSceneQuest,
  WorldSceneProps,
  MascotVisual,
} from './world-scene.types';

type Controls = { up: boolean; down: boolean; left: boolean; right: boolean; jump: boolean };
const emptyControls = (): Controls => ({
  up: false,
  down: false,
  left: false,
  right: false,
  jump: false,
});
const movementKeys: Record<string, keyof Controls> = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'jump',
};
const isEditing = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'));

const QuestMarker = memo(
  ({
    quest,
    nearby,
    disabled,
    onSelect,
  }: {
    quest: WorldSceneQuest;
    nearby: boolean;
    disabled: boolean;
    onSelect: (id: string) => void;
  }) => {
    const { color, path } = questPresentation(quest.kind);
    const texture = useMemo(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 192;
      canvas.height = 192;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#ffffff';
        context.translate(18, 18);
        context.scale(6.5, 6.5);
        context.fill(new Path2D(path));
      }
      const result = new THREE.CanvasTexture(canvas);
      result.colorSpace = THREE.SRGBColorSpace;
      return result;
    }, [path]);
    useEffect(() => () => texture.dispose(), [texture]);
    return (
      <group
        position={[quest.position.x, 0, quest.position.z]}
        onClick={(event) => {
          event.stopPropagation();
          if (nearby && !disabled) onSelect(quest.id);
        }}
      >
        <mesh position={[0, 0.023, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[nearby ? 0.93 : 0.75, nearby ? 1.02 : 0.8, 24]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={nearby ? 0.9 : 0.4}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.72, 0.82, 0.2, 12]} />
          <meshStandardMaterial color="#dce8db" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 1, 6]} />
          <meshStandardMaterial color={color} flatShading roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.19, 0]}>
          <cylinderGeometry args={[0.42, 0.3, 0.16, 6]} />
          <meshStandardMaterial color="#ebeee0" roughness={0.8} />
        </mesh>
        <sprite position={[0, 1.85, 0]} scale={[0.86, 0.86, 1]}>
          <spriteMaterial
            map={texture}
            transparent
            depthWrite={false}
            depthTest={false}
            color="#ffffff"
            toneMapped={false}
          />
        </sprite>
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry args={[0.4, 12, 8]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      </group>
    );
  },
);

const CameraAndInput = memo(
  ({
    controls,
    movement,
    position,
    onMove,
    disabled,
  }: {
    controls: React.RefObject<Controls>;
    movement: React.RefObject<WorldMoveIntent>;
    position: React.RefObject<THREE.Vector3>;
    onMove: WorldSceneProps['onMove'];
    disabled: boolean;
  }) => {
    const orbit = useRef<OrbitControlsImpl>(null);
    const camera = useThree((state) => state.camera);
    const forward = useMemo(() => new THREE.Vector3(), []);
    const right = useMemo(() => new THREE.Vector3(), []);
    const shift = useMemo(() => new THREE.Vector3(), []);
    const target = useMemo(() => new THREE.Vector3(), []);
    const elapsed = useRef(0);
    const callback = useRef(onMove);
    callback.current = onMove;
    useFrame((_, delta) => {
      if (orbit.current) {
        target.copy(position.current);
        target.y = 0.65;
        shift.copy(orbit.current.target);
        orbit.current.target.lerp(target, 1 - Math.exp(-6 * Math.min(delta, 0.1)));
        shift.sub(orbit.current.target);
        camera.position.sub(shift);
      }
      if (disabled) return;
      const keys = controls.current;
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      right.set(-forward.z, 0, forward.x);
      const horizontal = Number(keys.right) - Number(keys.left);
      const vertical = Number(keys.up) - Number(keys.down);
      let x = forward.x * vertical + right.x * horizontal;
      let z = forward.z * vertical + right.z * horizontal;
      const length = Math.hypot(x, z);
      if (length > 1) {
        x /= length;
        z /= length;
      }
      movement.current.x = x;
      movement.current.z = z;
      elapsed.current += Math.min(delta, 0.1);
      if (elapsed.current >= 0.05) {
        elapsed.current %= 0.05;
        movement.current.seq += 1;
        movement.current.jump = keys.jump;
        callback.current({ ...movement.current });
        keys.jump = false;
        movement.current.jump = false;
      }
    }, -2);
    return (
      <OrbitControls
        ref={orbit}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={10}
        maxDistance={135}
        minPolarAngle={0.35}
        maxPolarAngle={1.12}
        enabled={!disabled}
        target={[0, 0.65, 0]}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
    );
  },
);

const SceneDiagnostics = () => {
  const next = useRef(0);
  useFrame(({ gl, clock }) => {
    if (clock.elapsedTime < next.current) return;
    next.current = clock.elapsedTime + 1;
    // Development-only counters let the local browser check actual render
    // complexity without adding a stats overlay to the game interface.
    gl.domElement.dataset.worldDrawCalls = String(gl.info.render.calls);
    gl.domElement.dataset.worldTriangles = String(gl.info.render.triangles);
    gl.domElement.dataset.worldTextures = String(gl.info.memory.textures);
    gl.domElement.dataset.worldGeometries = String(gl.info.memory.geometries);
  });
  return null;
};

const TouchControls = memo(
  ({ controls, disabled }: { controls: React.RefObject<Controls>; disabled: boolean }) => {
    const { t } = useTranslation();
    const buttons: {
      direction: 'up' | 'down' | 'left' | 'right';
      icon: string;
      left: number;
      top: number;
    }[] = [
      { direction: 'up', icon: 'mdi:chevron-up', left: 48, top: 0 },
      { direction: 'left', icon: 'mdi:chevron-left', left: 0, top: 48 },
      { direction: 'right', icon: 'mdi:chevron-right', left: 96, top: 48 },
      { direction: 'down', icon: 'mdi:chevron-down', left: 48, top: 96 },
    ];
    return (
      <>
        <Box
          sx={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            width: 144,
            height: 144,
            touchAction: 'none',
          }}
        >
          {buttons.map(({ direction, icon, left, top }) => (
            <IconButton
              key={direction}
              disabled={disabled}
              aria-label={t(`keppyWorld.controls.${direction}`)}
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                controls.current[direction] = true;
              }}
              onPointerUp={() => {
                controls.current[direction] = false;
              }}
              onPointerCancel={() => {
                controls.current[direction] = false;
              }}
              onLostPointerCapture={() => {
                controls.current[direction] = false;
              }}
              onKeyDown={(event) => {
                if (event.code === 'Enter' || event.code === 'Space') {
                  event.preventDefault();
                  controls.current[direction] = true;
                }
              }}
              onKeyUp={(event) => {
                if (event.code === 'Enter' || event.code === 'Space') {
                  event.preventDefault();
                  controls.current[direction] = false;
                }
              }}
              onBlur={() => {
                controls.current[direction] = false;
              }}
              sx={{
                position: 'absolute',
                left,
                top,
                width: 48,
                height: 48,
                bgcolor: 'rgba(248,252,252,.88)',
                color: '#34556b',
                '&:active': { bgcolor: '#d5ebf5' },
              }}
            >
              <IconifyIcon icon={icon} width={30} />
            </IconButton>
          ))}
        </Box>
        <IconButton
          disabled={disabled}
          aria-label={t('keppyWorld.jump')}
          onPointerDown={(event) => {
            event.preventDefault();
            controls.current.jump = true;
          }}
          onClick={(event) => {
            if (event.detail === 0) controls.current.jump = true;
          }}
          sx={{
            position: 'absolute',
            bottom: 88,
            right: 22,
            width: 64,
            height: 64,
            bgcolor: 'rgba(248,252,252,.9)',
            color: '#34556b',
            touchAction: 'none',
          }}
        >
          <IconifyIcon icon="mdi:arrow-up-bold-outline" width={30} />
        </IconButton>
      </>
    );
  },
);

export const WorldScene = ({
  players,
  selfSessionId,
  quests,
  kioskQuests = quests,
  world,
  onMove,
  onQuestSelect,
  disabled = false,
  mascotVisuals = defaultVisuals,
}: WorldSceneProps) => {
  const { t } = useTranslation();
  const touch = useMediaQuery('(pointer: coarse)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const container = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls>(emptyControls());
  const movement = useRef<WorldMoveIntent>({ x: 0, z: 0, jump: false, seq: 0 });
  const self = players.find((player) => player.sessionId === selfSessionId);
  const kiosks = useMemo(() => kioskQuests.map((quest) => quest.position), [kioskQuests]);
  const eligibleQuests = useMemo(() => new Set(quests.map((quest) => quest.id)), [quests]);
  const selfPosition = useRef<THREE.Vector3>(null!);
  if (!selfPosition.current)
    selfPosition.current = new THREE.Vector3(self?.x ?? 0, 0, self?.z ?? 0);
  const [loaded, setLoaded] = useState(false);
  const nearest = useMemo(() => {
    if (!self || self.falling || disabled) return null;
    let distance = WORLD_INTERACT_DISTANCE;
    let closest: WorldSceneQuest | null = null;
    for (const quest of quests) {
      const current = Math.hypot(quest.position.x - self.x, quest.position.z - self.z);
      if (current <= distance) {
        closest = quest;
        distance = current;
      }
    }
    return closest;
  }, [self, quests, disabled]);
  const nearestRef = useRef(nearest);
  nearestRef.current = nearest;
  const callbacks = useRef({ onMove, onQuestSelect });
  callbacks.current = { onMove, onQuestSelect };
  const selectQuest = useCallback((id: string) => callbacks.current.onQuestSelect(id), []);
  const stop = useCallback(() => {
    controls.current = emptyControls();
    movement.current = { x: 0, z: 0, jump: false, seq: movement.current.seq + 1 };
    callbacks.current.onMove({ ...movement.current });
  }, []);

  useEffect(() => {
    // A reconnect can replace sessionId while keeping server input sequence.
    movement.current.seq = Math.max(movement.current.seq, self?.lastSeq ?? 0);
  }, [self?.lastSeq, selfSessionId]);
  useEffect(() => {
    if (disabled) stop();
  }, [disabled, stop]);
  useEffect(() => {
    if (!disabled && selfSessionId) container.current?.focus({ preventScroll: true });
  }, [disabled, selfSessionId]);
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (disabled || event.ctrlKey || event.metaKey || event.altKey || isEditing(event.target))
        return;
      if (
        (event.code === 'Space' || event.code === 'Enter') &&
        event.target instanceof HTMLElement &&
        event.target.closest('button, a, [role="button"]')
      )
        return;
      const control = movementKeys[event.code];
      if (control) {
        event.preventDefault();
        if (control !== 'jump' || !event.repeat) controls.current[control] = true;
      }
      if (event.code === 'Enter' && nearestRef.current && !event.repeat) {
        event.preventDefault();
        callbacks.current.onQuestSelect(nearestRef.current.id);
      }
    };
    const up = (event: KeyboardEvent) => {
      const control = movementKeys[event.code];
      if (control && control !== 'jump') controls.current[control] = false;
    };
    const hidden = () => {
      if (document.hidden) stop();
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', hidden);
      stop();
    };
  }, [disabled, stop]);

  return (
    <Box
      ref={container}
      tabIndex={0}
      role="region"
      aria-label="Keppy World"
      data-testid="keppy-world-scene"
      sx={{
        position: 'relative',
        width: 1,
        height: 1,
        minHeight: 0,
        overflow: 'hidden',
        bgcolor: '#b5d5d7',
        outline: 'none',
        '&:focus-visible': { outline: '2px solid #588ab3', outlineOffset: -2 },
        '& canvas': { touchAction: 'none' },
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Canvas
        camera={{ position: [14, 21, 24], fov: 43, near: 0.1, far: 360 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#b5d5d7');
          setLoaded(true);
        }}
      >
        <fog attach="fog" args={['#b5d5d7', 115, 300]} />
        <hemisphereLight args={['#fff5df', '#80a6aa', 2.3]} />
        <directionalLight position={[-18, 28, 14]} intensity={2.25} color="#fff7e8" />
        {import.meta.env.DEV && <SceneDiagnostics />}
        <WorldEnvironment zones={world.zones} />
        <CameraAndInput
          controls={controls}
          movement={movement}
          position={selfPosition}
          onMove={onMove}
          disabled={disabled || !selfSessionId}
        />
        {kioskQuests.map((quest) => (
          <QuestMarker
            key={quest.id}
            quest={quest}
            nearby={nearest?.id === quest.id}
            disabled={disabled || !eligibleQuests.has(quest.id)}
            onSelect={selectQuest}
          />
        ))}
        {players.map((player) => (
          <Suspense key={player.sessionId} fallback={null}>
            <WorldAvatar
              player={player}
              peers={players}
              kiosks={kiosks}
              self={player.sessionId === selfSessionId}
              visual={mascotVisuals[player.mascotId] ?? defaultVisuals.keppy}
              zones={world.zones}
              movement={movement}
              selfPosition={selfPosition}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        ))}
      </Canvas>
      {!loaded && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeContent: 'center',
            gap: 2,
            bgcolor: '#e7f0ee',
            textAlign: 'center',
          }}
        >
          <CircularProgress size={28} sx={{ mx: 'auto' }} />
          <Typography variant="body2">{t('keppyWorld.loading')}</Typography>
        </Box>
      )}
      {nearest && (
        <Button
          onClick={() => onQuestSelect(nearest.id)}
          startIcon={<IconifyIcon icon="mdi:keyboard-return" width={22} />}
          sx={{
            position: 'absolute',
            bottom: touch ? 175 : 28,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100% - 32px)',
            bgcolor: 'rgba(248,252,252,.97)',
            color: '#23445c',
            borderRadius: 2,
            boxShadow: '0 5px 24px #294d5b18',
            px: 2.2,
            py: 1.2,
            textTransform: 'none',
            '&:hover': { bgcolor: '#fff' },
          }}
        >
          <Box sx={{ minWidth: 0, textAlign: 'left' }}>
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontWeight: 600,
                fontSize: 14,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {nearest.title}
            </Typography>
            <Typography component="span" sx={{ display: 'block', fontSize: 12, color: '#69818e' }}>
              {t('keppyWorld.interact')} · {nearest.xp} XP
            </Typography>
          </Box>
        </Button>
      )}
      {touch ? (
        <TouchControls controls={controls} disabled={disabled || !selfSessionId} />
      ) : (
        <Box
          sx={{
            position: 'absolute',
            left: 20,
            bottom: 18,
            display: 'flex',
            gap: 2,
            color: '#3d6470',
            pointerEvents: 'none',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <IconifyIcon icon="mdi:keyboard-outline" width={17} />
            WASD · {t('keppyWorld.move')}
          </Typography>
          <Typography sx={{ fontSize: 11 }}>
            {t('keppyWorld.keys.space')} · {t('keppyWorld.jump')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WorldScene;
