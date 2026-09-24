import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  WORLD_JUMP_DURATION,
  WORLD_LAYOUT_SCALE,
  WORLD_SECOND_ISLAND_CENTER,
  WORLD_SENTRY_RADIUS,
  WORLD_STATION_HOLD,
  WORLD_STATION_RADIUS,
  type WorldBeacon,
  type WorldJumpBarrier,
  type WorldPoint,
  type WorldRoute,
  type WorldRouteProgress,
  type WorldSentry,
  type WorldStation,
  clampToWorld,
  initialWorldRouteProgress,
  worldAdvanceRoute,
  worldBeaconTriggered,
  worldBeacons,
  worldBridge,
  worldBridgeGapAt,
  worldBridgeGaps,
  worldBridgePointAt,
  worldChargeDelta,
  worldCoastline,
  worldDistance,
  worldIsOutside,
  worldJumpBarriers,
  worldJumpHeight,
  worldMoveSpeed,
  worldRoutes,
  worldSecondCoastline,
  worldSentries,
  worldSentryPosition,
  worldShards,
  worldSlowZones,
  worldStationPulse,
  worldStations,
  worldTerminals,
  worldTraverse,
} from 'modules/games/domain/world/world';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export type MoveControls = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
};

type SceneProps = {
  initialPosition: WorldPoint;
  collected: readonly string[];
  solved: readonly string[];
  charged: readonly string[];
  beacons: readonly string[];
  routes: readonly string[];
  controls: React.RefObject<MoveControls>;
  paused: boolean;
  onMove: (point: WorldPoint) => void;
  onCollect: (id: string) => void;
  onChargeStation: (id: string) => void;
  onHazardHit: () => void;
  onCollectBeacon: (id: string) => void;
  onCompleteRoute: (id: string) => void;
  onFall: () => void;
  terminalPrompt?: { id: string; label: string; kind: 'interact' | 'locked' };
  stationPrompt?: { id: string; label: string };
  onInteract: () => void;
};

const treePositions: readonly (readonly [number, number, number])[] = [
  [-9, -4, 0.82],
  [-8, 5, 1.06],
  [-6, -7, 0.74],
  [-6, 2, 0.9],
  [-4, 9, 0.82],
  [-2, -9, 0.75],
  [-1, 7, 0.86],
  [2, -9, 1.04],
  [2, 6, 0.78],
  [4, -6, 0.92],
  [5, 5, 0.88],
  [7, -8, 0.72],
  [8, 0, 0.98],
  [9, 8, 0.7],
  [-10, 0, 0.68],
  [-12, -4, 0.72],
  [-11, 9, 0.74],
  [-3, 12, 0.82],
  [2, 12, 0.76],
  [11, -7, 0.8],
  [12, 0, 0.7],
]
  .map(([x, z, scale]) => [x * WORLD_LAYOUT_SCALE, z * WORLD_LAYOUT_SCALE, scale] as const)
  .concat([
    [-19, -7, 0.92],
    [-18, 9, 0.78],
    [-11, -17, 0.95],
    [4, -19, 0.78],
    [18, -8, 0.9],
    [19, 7, 0.85],
    [9, 18, 1.05],
    [-7, 19, 0.83],
  ]);

const shrubs: readonly (readonly [number, number])[] = [
  [-10, -6],
  [-7, 0],
  [-8, 9],
  [-3, -8],
  [0, 9],
  [3, -3],
  [3, 9],
  [8, -4],
  [10, 1],
  [-11, -3],
  [-9, 11],
  [0, -12],
  [10, -9],
  [11, 6],
]
  .map(([x, z]) => [x * WORLD_LAYOUT_SCALE, z * WORLD_LAYOUT_SCALE] as const)
  .concat([
    [-18, -9],
    [-15, 14],
    [-4, -19],
    [17, -11],
    [16, 13],
    [3, 19],
  ]);

const Tree = ({ x, z, scale }: { x: number; z: number; scale: number }) => (
  <group position={[x, 0, z]} scale={scale}>
    <mesh castShadow position={[0, 0.48, 0]}>
      <cylinderGeometry args={[0.13, 0.18, 0.85, 8]} />
      <meshStandardMaterial color="#6f8291" roughness={0.9} />
    </mesh>
    <mesh castShadow position={[0, 1.24, 0]}>
      <coneGeometry args={[0.73, 1.72, 7]} />
      <meshStandardMaterial color="#087f8b" roughness={0.78} flatShading />
    </mesh>
    <mesh castShadow position={[0, 1.78, 0]}>
      <coneGeometry args={[0.52, 1.15, 7]} />
      <meshStandardMaterial color="#43b8a7" roughness={0.72} flatShading />
    </mesh>
  </group>
);

const Shard = ({ x, z, index }: { x: number; z: number; index: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.y = 0.95 + Math.sin(state.clock.elapsedTime * 2.4 + index) * 0.12;
    ref.current.rotation.y += delta * 0.9;
  });
  return (
    <group ref={ref} position={[x, 0.95, z]}>
      <mesh castShadow>
        <octahedronGeometry args={[0.32]} />
        <meshPhysicalMaterial
          color="#ffd056"
          emissive="#ee9c18"
          emissiveIntensity={0.45}
          metalness={0.2}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <octahedronGeometry args={[0.21]} />
        <meshStandardMaterial color="#ffebaa" emissive="#f5c858" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
};

const Station = ({ station, charged }: { station: WorldStation; charged: boolean }) => {
  const ringMesh = useRef<THREE.Mesh>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state, delta) => {
    if (!ringMesh.current || !crystal.current || !ring.current || !core.current) return;
    const active = worldStationPulse(station, state.clock.elapsedTime);
    ring.current.color.set(charged ? '#42c29d' : active ? '#8df1f0' : '#4e92bd');
    ring.current.emissive.set(charged ? '#23ad82' : active ? '#31dce5' : '#246f9e');
    ring.current.emissiveIntensity = active && !charged ? 0.85 : 0.25;
    ringMesh.current.scale.setScalar(
      active && !charged ? 1 + 0.05 * Math.sin(state.clock.elapsedTime * 8) : 1,
    );
    core.current.color.set(charged ? '#31bc96' : active ? '#7ef0ec' : '#3289b8');
    core.current.emissive.set(charged ? '#20a981' : active ? '#27d8d5' : '#155c94');
    core.current.emissiveIntensity = active && !charged ? 0.85 : 0.25;
    crystal.current.rotation.y += delta * 0.4;
  });
  return (
    <group position={[station.x, 0.12, station.z]}>
      <mesh ref={ringMesh} position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[WORLD_STATION_RADIUS - 0.13, WORLD_STATION_RADIUS, 40]} />
        <meshStandardMaterial
          ref={ring}
          color={charged ? '#42c29d' : '#4e92bd'}
          emissive={charged ? '#23ad82' : '#246f9e'}
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.56, 0.64, 0.21, 24]} />
        <meshPhysicalMaterial color="#e7f5fb" roughness={0.42} metalness={0.04} clearcoat={0.45} />
      </mesh>
      <mesh position={[0, 0.275, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.045, 8, 36]} />
        <meshStandardMaterial
          color={charged ? '#7adabd' : '#65b8db'}
          emissive={charged ? '#31b38b' : '#248fc2'}
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh ref={crystal} position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.29, 0.55, 6]} />
        <meshStandardMaterial
          ref={core}
          color={charged ? '#31bc96' : '#3289b8'}
          emissive={charged ? '#20a981' : '#155c94'}
          emissiveIntensity={0.25}
          metalness={0.12}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshBasicMaterial color={charged ? '#c7ffe8' : '#d7fbff'} />
      </mesh>
    </group>
  );
};

const Sentry = ({ sentry }: { sentry: WorldSentry }) => {
  const ref = useRef<THREE.Group>(null);
  const length = worldDistance(sentry.start, sentry.end);
  const angle = Math.atan2(sentry.end.z - sentry.start.z, sentry.end.x - sentry.start.x);
  useFrame((state) => {
    const point = worldSentryPosition(sentry, state.clock.elapsedTime);
    if (ref.current) ref.current.position.set(point.x, 0.3, point.z);
  });
  return (
    <>
      <mesh
        position={[(sentry.start.x + sentry.end.x) / 2, 0.14, (sentry.start.z + sentry.end.z) / 2]}
        rotation={[-Math.PI / 2, 0, -angle]}
      >
        <planeGeometry args={[length, 0.1]} />
        <meshBasicMaterial color="#e27b82" transparent opacity={0.42} depthWrite={false} />
      </mesh>
      <group ref={ref}>
        <mesh position={[0, 0.33, 0]} scale={[0.5, 0.38, 0.46]} castShadow>
          <sphereGeometry args={[1, 24, 16]} />
          <meshPhysicalMaterial
            color="#ed5966"
            roughness={0.32}
            metalness={0.08}
            clearcoat={0.65}
          />
        </mesh>
        <mesh position={[0, 0.4, 0.41]} scale={[0.32, 0.14, 0.065]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshPhysicalMaterial
            color="#243d59"
            roughness={0.23}
            metalness={0.15}
            clearcoat={0.72}
          />
        </mesh>
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, 0.41, 0.46]} scale={[0.045, 0.055, 0.025]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshBasicMaterial color="#fff0d7" />
          </mesh>
        ))}
        {[-0.43, 0.43].map((x) => (
          <mesh key={x} position={[x, 0.29, 0]} scale={[0.15, 0.23, 0.23]} castShadow>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#c73f59" roughness={0.44} />
          </mesh>
        ))}
        <mesh position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.13, 16, 12]} />
          <meshStandardMaterial
            color="#ffd27d"
            emissive="#fb9b2a"
            emissiveIntensity={0.75}
            roughness={0.25}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
          <ringGeometry args={[WORLD_SENTRY_RADIUS - 0.1, WORLD_SENTRY_RADIUS, 32]} />
          <meshBasicMaterial color="#e45369" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
};

const Terminal = ({ x, z, solved }: { x: number; z: number; solved: boolean }) => (
  <group position={[x, 0, z]}>
    <mesh receiveShadow position={[0, 0.12, 0]}>
      <cylinderGeometry args={[0.82, 0.9, 0.22, 16]} />
      <meshStandardMaterial color="#bedce7" roughness={0.8} />
    </mesh>
    <mesh castShadow position={[0, 0.75, 0]}>
      <cylinderGeometry args={[0.36, 0.47, 1.16, 8]} />
      <meshPhysicalMaterial
        color={solved ? '#2aaf9c' : '#1569d3'}
        metalness={0.12}
        roughness={0.34}
        clearcoat={0.42}
      />
    </mesh>
    <mesh position={[0, 0.75, 0.35]}>
      <boxGeometry args={[0.3, 0.5, 0.04]} />
      <meshStandardMaterial
        color={solved ? '#9df4d6' : '#8edbff'}
        emissive={solved ? '#34c39f' : '#49b3ef'}
        emissiveIntensity={0.5}
      />
    </mesh>
    <mesh position={[0, 1.43, 0]}>
      <octahedronGeometry args={[0.27]} />
      <meshStandardMaterial
        color={solved ? '#8de0bd' : '#81c8ff'}
        emissive={solved ? '#38ac8c' : '#2b86e6'}
        emissiveIntensity={0.65}
      />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
      <torusGeometry args={[0.59, 0.065, 8, 32]} />
      <meshStandardMaterial
        color={solved ? '#3db79a' : '#2f8be5'}
        emissiveIntensity={0.2}
        emissive={solved ? '#189875' : '#1770c6'}
      />
    </mesh>
  </group>
);

const JumpBarrier = ({ barrier }: { barrier: WorldJumpBarrier }) => {
  const length = worldDistance(barrier.start, barrier.end);
  const angle = -Math.atan2(barrier.end.z - barrier.start.z, barrier.end.x - barrier.start.x);
  const middleX = (barrier.start.x + barrier.end.x) / 2;
  const middleZ = (barrier.start.z + barrier.end.z) / 2;
  return (
    <group position={[middleX, 0, middleZ]} rotation={[0, angle, 0]}>
      <mesh castShadow position={[0, 0.34, 0]}>
        <boxGeometry args={[length, 0.38, 0.2]} />
        <meshPhysicalMaterial color="#287bb9" metalness={0.2} roughness={0.35} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[length, 0.055, 0.24]} />
        <meshStandardMaterial color="#ffd276" emissive="#ef9b25" emissiveIntensity={0.55} />
      </mesh>
      {[-length / 2, length / 2].map((x) => (
        <mesh key={x} castShadow position={[x, 0.34, 0]}>
          <cylinderGeometry args={[0.16, 0.19, 0.68, 8]} />
          <meshPhysicalMaterial color="#155c9c" roughness={0.32} clearcoat={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const Beacon = ({ beacon, collected }: { beacon: WorldBeacon; collected: boolean }) => {
  const crystal = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!crystal.current) return;
    crystal.current.position.y =
      (beacon.kind === 'landing' ? 0.7 : 1.55) +
      Math.sin(state.clock.elapsedTime * 2.4 + beacon.x) * 0.1;
    crystal.current.rotation.y = state.clock.elapsedTime * 0.6;
  });
  return (
    <group position={[beacon.x, 0, beacon.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
        <ringGeometry args={[beacon.radius - 0.15, beacon.radius - 0.05, 40]} />
        <meshBasicMaterial
          color={collected ? '#3fbf9a' : beacon.kind === 'landing' ? '#68c9ac' : '#a56df0'}
          transparent
          opacity={collected ? 0.55 : 0.82}
          side={THREE.DoubleSide}
        />
      </mesh>
      {!collected && (
        <group ref={crystal}>
          <mesh castShadow>
            <octahedronGeometry args={[beacon.kind === 'landing' ? 0.28 : 0.34]} />
            <meshPhysicalMaterial
              color={beacon.kind === 'landing' ? '#7de4c0' : '#c69cf6'}
              emissive={beacon.kind === 'landing' ? '#2cac89' : '#8a4cdd'}
              emissiveIntensity={0.5}
              metalness={0.18}
              roughness={0.25}
              clearcoat={0.65}
            />
          </mesh>
          {beacon.kind === 'airborne' && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.51, 0.035, 8, 28]} />
              <meshBasicMaterial color="#d3afff" />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
};

const RouteNumber = ({ value }: { value: number }) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      context.shadowColor = '#54390a55';
      context.shadowBlur = 10;
      context.fillStyle = '#ef9b2d';
      context.beginPath();
      context.arc(64, 64, 47, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
      context.fillStyle = '#ffffff';
      context.font = 'bold 64px Arial, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(String(value), 64, 68);
    }
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [value]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <sprite position={[0, 0.75, 0]} scale={[0.62, 0.62, 1]}>
      <spriteMaterial map={texture} transparent depthTest={false} depthWrite={false} />
    </sprite>
  );
};

const RouteMarkers = ({
  route,
  progress,
  completed,
}: {
  route: WorldRoute;
  progress: WorldRouteProgress;
  completed: boolean;
}) => (
  <group>
    {route.checkpoints.slice(0, -1).map((point, index) => {
      const next = route.checkpoints[index + 1];
      const length = worldDistance(point, next);
      const angle = Math.atan2(next.z - point.z, next.x - point.x);
      return (
        <mesh
          key={`${route.id}-path-${index}`}
          position={[(point.x + next.x) / 2, 0.155, (point.z + next.z) / 2]}
          rotation={[-Math.PI / 2, 0, -angle]}
        >
          <planeGeometry args={[length, 0.07]} />
          <meshBasicMaterial color="#e5aa52" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      );
    })}
    {route.checkpoints.map((point, index) => {
      const passed = completed || index < progress.nextCheckpoint;
      const active = !completed && index === progress.nextCheckpoint;
      const color = passed ? '#37ba91' : active ? '#f4ab42' : '#91aaa7';
      return (
        <group key={`${route.id}-checkpoint-${index}`} position={[point.x, 0, point.z]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.4, 0.13, 24]} />
            <meshPhysicalMaterial color="#ecf5ee" roughness={0.5} clearcoat={0.5} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.26, 0]}>
            <ringGeometry args={[0.18, 0.27, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
          </mesh>
          {active && <RouteNumber value={index + 1} />}
        </group>
      );
    })}
  </group>
);

const KepperSprite = ({
  avatarRef,
  spriteRef,
  haloRef,
  shadowRef,
  idleTexture,
  initialPosition,
}: {
  avatarRef: React.RefObject<THREE.Group | null>;
  spriteRef: React.RefObject<THREE.Sprite | null>;
  haloRef: React.RefObject<THREE.Mesh | null>;
  shadowRef: React.RefObject<THREE.Mesh | null>;
  idleTexture: THREE.Texture;
  initialPosition: WorldPoint;
}) => (
  <group ref={avatarRef} position={[initialPosition.x, 0, initialPosition.z]}>
    <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.13, 0]}>
      <circleGeometry args={[0.73, 40]} />
      <meshBasicMaterial color="#20527a" transparent opacity={0.22} depthWrite={false} />
    </mesh>
    <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.145, 0]}>
      <ringGeometry args={[0.95, 1.01, 48]} />
      <meshBasicMaterial color="#3385f0" transparent opacity={0.68} depthWrite={false} />
    </mesh>
    <sprite ref={spriteRef} position={[0, 1.28, 0]} scale={[2.55, 2.55, 1]}>
      <spriteMaterial
        map={idleTexture}
        transparent
        alphaTest={0.02}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  </group>
);

type KepperReaction = {
  kind: 'shard' | 'relay' | 'beacon' | 'route';
  started: number;
  duration: number;
};

type PlayerProps = SceneProps & {
  livePositionRef: React.RefObject<WorldPoint>;
  onRouteProgress: (id: string, progress: WorldRouteProgress) => void;
};

const Player = ({
  initialPosition,
  collected,
  solved,
  charged,
  beacons,
  routes,
  controls,
  paused,
  onMove,
  onCollect,
  onChargeStation,
  onHazardHit,
  onCollectBeacon,
  onCompleteRoute,
  onFall,
  livePositionRef,
  onRouteProgress,
}: PlayerProps) => {
  const avatarRef = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const position = useRef(new THREE.Vector3(initialPosition.x, 0, initialPosition.z));
  const notified = useRef(new Set<string>());
  const completedRouteNotified = useRef(new Set<string>());
  const routeProgress = useRef<Record<string, WorldRouteProgress>>({});
  const previousMotion = useRef({ point: initialPosition, height: 0 });
  const jumpStartedAt = useRef<number | null>(null);
  const jumpHeld = useRef(false);
  const fallStartedAt = useRef<number | null>(null);
  const fallOrigin = useRef<WorldPoint | null>(null);
  const fallDirection = useRef<WorldPoint>({ x: 0, z: 0 });
  const fallReported = useRef(false);
  const chargeProgress = useRef<Record<string, number>>({});
  const lastHazardAt = useRef(-10);
  const lastUpdate = useRef(0);
  const lastReportedPosition = useRef(initialPosition);
  const seenProgress = useRef({
    shards: collected.length,
    relays: solved.length,
    beacons: beacons.length,
    routes: routes.length,
  });
  const reaction = useRef<KepperReaction | null>(null);
  const walkPhase = useRef(0);
  const walkBlend = useRef(0);
  const headingYaw = useRef(0);
  const travelSide = useRef(0);
  const reducedMotion = useRef(false);
  const camera = useThree((state) => state.camera);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const load = (filename: string) => {
      const texture = loader.load(`${import.meta.env.BASE_URL}mascot/kepper/${filename}`);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      return texture;
    };
    return {
      idle: load('game-idle.png'),
      left: load('game-run-left.png'),
      right: load('game-run-right.png'),
      back: load('game-back.webp'),
      celebrate: load('celebrate.png'),
      success: load('success.png'),
    };
  }, []);

  useEffect(
    () => () => Object.values(textures).forEach((texture) => texture.dispose()),
    [textures],
  );
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedMotion.current = query.matches;
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useFrame((state, delta) => {
    const avatar = avatarRef.current;
    const sprite = spriteRef.current;
    if (!avatar || !sprite) return;
    const elapsed = state.clock.elapsedTime;
    if (fallStartedAt.current !== null && fallOrigin.current) {
      const progress = Math.min(1, (elapsed - fallStartedAt.current) / 0.8);
      const origin = fallOrigin.current;
      avatar.position.set(
        origin.x + fallDirection.current.x * 1.25 * progress,
        -3.4 * progress * progress,
        origin.z + fallDirection.current.z * 1.25 * progress,
      );
      sprite.position.y = 1.28 + 0.32 * Math.sin(progress * Math.PI);
      (sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, 1 - progress * 0.7);
      if (haloRef.current) haloRef.current.visible = false;
      if (shadowRef.current) shadowRef.current.visible = false;
      if (progress === 1 && !fallReported.current) {
        fallReported.current = true;
        onFall();
      }
      return;
    }
    let moving = false;
    direction.set(0, 0, 0);
    if (!paused) {
      const input = controls.current;
      if (input.jump && !jumpHeld.current && jumpStartedAt.current === null) {
        jumpStartedAt.current = elapsed;
      }
      jumpHeld.current = input.jump;
      if (
        jumpStartedAt.current !== null &&
        elapsed - jumpStartedAt.current >= WORLD_JUMP_DURATION
      ) {
        jumpStartedAt.current = null;
      }
      const jumpHeight =
        jumpStartedAt.current === null ? 0 : worldJumpHeight(elapsed - jumpStartedAt.current);
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      right.set(-forward.z, 0, forward.x);
      if (input.forward) direction.add(forward);
      if (input.backward) direction.sub(forward);
      if (input.right) direction.add(right);
      if (input.left) direction.sub(right);
      moving = direction.lengthSq() > 0.0001;
      if (moving) {
        direction.normalize();
        travelSide.current = direction.dot(right);
        headingYaw.current = Math.atan2(direction.x, direction.z);
        const speed = worldMoveSpeed(position.current);
        const candidate = {
          x: position.current.x + direction.x * speed * Math.min(delta, 0.25),
          z: position.current.z + direction.z * speed * Math.min(delta, 0.25),
        };
        if (worldIsOutside(candidate) || (jumpHeight < 0.35 && worldBridgeGapAt(candidate))) {
          fallStartedAt.current = elapsed;
          fallOrigin.current = candidate;
          fallDirection.current = { x: direction.x, z: direction.z };
          jumpStartedAt.current = null;
          avatar.position.set(candidate.x, 0, candidate.z);
          livePositionRef.current.x = candidate.x;
          livePositionRef.current.z = candidate.z;
          return;
        }
        const next = worldTraverse(position.current, candidate, jumpHeight).position;
        position.current.set(next.x, 0, next.z);
        livePositionRef.current.x = next.x;
        livePositionRef.current.z = next.z;
        avatar.position.copy(position.current);
        if (
          elapsed - lastUpdate.current > 0.08 &&
          worldDistance(lastReportedPosition.current, next) > 0.01
        ) {
          onMove(next);
          lastUpdate.current = elapsed;
          lastReportedPosition.current = next;
        }
        for (const shard of worldShards) {
          if (collected.includes(shard.id) || notified.current.has(shard.id)) continue;
          if (worldDistance(next, shard) < 0.7) {
            notified.current.add(shard.id);
            onCollect(shard.id);
          }
        }
      }
      const currentMotion = {
        point: { x: position.current.x, z: position.current.z },
        height: jumpHeight,
      };
      for (const beacon of worldBeacons) {
        if (beacons.includes(beacon.id) || notified.current.has(beacon.id)) continue;
        if (worldBeaconTriggered(beacon, previousMotion.current, currentMotion)) {
          notified.current.add(beacon.id);
          onCollectBeacon(beacon.id);
        }
      }
      previousMotion.current = currentMotion;
      for (const route of worldRoutes) {
        if (routes.includes(route.id) || completedRouteNotified.current.has(route.id)) continue;
        const previous = routeProgress.current[route.id] ?? initialWorldRouteProgress();
        const next = worldAdvanceRoute(route, previous, currentMotion.point, elapsed);
        if (
          next.timedOut ||
          next.progress.nextCheckpoint !== previous.nextCheckpoint ||
          next.progress.startedAt !== previous.startedAt
        ) {
          routeProgress.current[route.id] = next.progress;
          onRouteProgress(route.id, next.progress);
        }
        if (next.completed) {
          completedRouteNotified.current.add(route.id);
          onCompleteRoute(route.id);
        }
      }
      for (const station of worldStations) {
        if (charged.includes(station.id) || notified.current.has(station.id)) continue;
        const inside = worldDistance(position.current, station) < WORLD_STATION_RADIUS;
        const active = worldStationPulse(station, elapsed);
        chargeProgress.current[station.id] =
          inside && active
            ? (chargeProgress.current[station.id] ?? 0) + worldChargeDelta(delta)
            : 0;
        if (chargeProgress.current[station.id] >= WORLD_STATION_HOLD) {
          notified.current.add(station.id);
          onChargeStation(station.id);
        }
      }
      if (jumpHeight < 0.6 && elapsed - lastHazardAt.current > 2.5) {
        const sentry = worldSentries.find(
          (item) =>
            worldDistance(position.current, worldSentryPosition(item, elapsed)) <
            WORLD_SENTRY_RADIUS,
        );
        if (sentry) {
          const hazard = worldSentryPosition(sentry, elapsed);
          const dx = position.current.x - hazard.x;
          const dz = position.current.z - hazard.z;
          const distance = Math.hypot(dx, dz) || 1;
          const pushed = clampToWorld({
            x: position.current.x + (dx / distance) * 1.35,
            z: position.current.z + (dz / distance) * 1.35,
          });
          position.current.set(pushed.x, 0, pushed.z);
          livePositionRef.current.x = pushed.x;
          livePositionRef.current.z = pushed.z;
          avatar.position.copy(position.current);
          onMove(pushed);
          onHazardHit();
          lastHazardAt.current = elapsed;
          chargeProgress.current = {};
        }
      }
    }

    if (solved.length > seenProgress.current.relays) {
      reaction.current = { kind: 'relay', started: elapsed, duration: 1.35 };
    } else if (routes.length > seenProgress.current.routes) {
      reaction.current = { kind: 'route', started: elapsed, duration: 1.35 };
    } else if (beacons.length > seenProgress.current.beacons) {
      reaction.current = { kind: 'beacon', started: elapsed, duration: 1.1 };
    } else if (collected.length > seenProgress.current.shards) {
      reaction.current = { kind: 'shard', started: elapsed, duration: 0.95 };
    }
    seenProgress.current.shards = collected.length;
    seenProgress.current.relays = solved.length;
    seenProgress.current.beacons = beacons.length;
    seenProgress.current.routes = routes.length;
    if (reaction.current && elapsed - reaction.current.started > reaction.current.duration) {
      reaction.current = null;
    }
    const complete =
      collected.length === worldShards.length &&
      solved.length === worldTerminals.length &&
      charged.length === worldStations.length &&
      beacons.length === worldBeacons.length &&
      routes.length === worldRoutes.length;
    const activeReaction = complete ? 'complete' : reaction.current?.kind;
    const cameraYaw = Math.atan2(
      camera.position.x - avatar.position.x,
      camera.position.z - avatar.position.z,
    );
    const relativeYaw = Math.atan2(
      Math.sin(cameraYaw - headingYaw.current),
      Math.cos(cameraYaw - headingYaw.current),
    );
    const sightline = Math.abs(relativeYaw);
    const desiredTexture =
      sightline >= Math.PI * 0.755
        ? textures.back
        : sightline >= Math.PI / 4
          ? relativeYaw < 0
            ? textures.right
            : textures.left
          : activeReaction === 'relay' || activeReaction === 'route'
            ? textures.success
            : activeReaction
              ? textures.celebrate
              : textures.idle;
    const material = sprite.material as THREE.SpriteMaterial;
    if (material.map !== desiredTexture) {
      material.map = desiredTexture;
      material.needsUpdate = true;
    }

    const ease = 1 - Math.exp(-9 * Math.min(delta, 0.05));
    walkBlend.current += ((moving ? 1 : 0) - walkBlend.current) * ease;
    if (moving) walkPhase.current += Math.min(delta, 0.05) * 11.5;
    const walk = walkBlend.current;
    const phase = walkPhase.current;
    const motion = reducedMotion.current ? 0 : 1;
    const breath = Math.sin(elapsed * 2.1) * 0.018 * (1 - walk) * motion;
    const step = Math.abs(Math.sin(phase)) * 0.095 * walk * motion;
    const sway = Math.sin(phase) * 0.085 * walk * motion;
    const reactionProgress = reaction.current
      ? Math.min(1, (elapsed - reaction.current.started) / reaction.current.duration)
      : 0;
    const celebration =
      activeReaction && activeReaction !== 'complete'
        ? Math.sin(reactionProgress * Math.PI) * motion
        : complete
          ? (0.5 + 0.5 * Math.sin(elapsed * 4)) * motion
          : 0;
    const baseSize = activeReaction ? 3.5 : 2.55;
    const squash = Math.sin(phase * 2) * 0.025 * walk * motion;
    sprite.scale.set(
      baseSize * (1 - squash + breath + celebration * 0.055),
      baseSize * (1 + squash + breath + celebration * 0.075),
      1,
    );
    const jumpHeight =
      jumpStartedAt.current === null ? 0 : worldJumpHeight(elapsed - jumpStartedAt.current);
    sprite.position.y =
      1.28 +
      jumpHeight +
      step +
      Math.sin(elapsed * 2.1) * 0.035 * (1 - walk) * motion +
      celebration * 0.16;
    material.rotation =
      -sway -
      travelSide.current * 0.025 * walk * motion +
      Math.sin(elapsed * 1.5) * 0.012 * (1 - walk) * motion;

    if (haloRef.current) {
      const halo = haloRef.current;
      const haloMaterial = halo.material as THREE.MeshBasicMaterial;
      halo.scale.setScalar(1 + celebration * 0.36);
      haloMaterial.opacity = 0.55 + celebration * 0.28;
    }
    if (shadowRef.current) {
      shadowRef.current.scale.setScalar(1 - (step + celebration * 0.12) * 0.15 - jumpHeight * 0.11);
      (shadowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.22 - jumpHeight * 0.08;
    }
  });

  return (
    <KepperSprite
      avatarRef={avatarRef}
      spriteRef={spriteRef}
      haloRef={haloRef}
      shadowRef={shadowRef}
      idleTexture={textures.idle}
      initialPosition={initialPosition}
    />
  );
};

const CameraFollow = ({ positionRef }: { positionRef: React.RefObject<WorldPoint> }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const camera = useThree((state) => state.camera);
  const target = useMemo(() => new THREE.Vector3(), []);
  const initialTarget = useRef<[number, number, number]>([
    positionRef.current.x,
    0.5,
    positionRef.current.z,
  ]);
  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    target.set(positionRef.current.x, 0.5, positionRef.current.z);
    const before = controlsRef.current.target.clone();
    controlsRef.current.target.lerp(target, 1 - Math.exp(-4 * delta));
    camera.position.add(controlsRef.current.target.clone().sub(before));
    controlsRef.current.update();
  });
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      minDistance={5}
      maxDistance={25}
      minPolarAngle={0.35}
      maxPolarAngle={1.28}
      target={initialTarget.current}
    />
  );
};

const fanGeometry = (points: readonly WorldPoint[], y: number) => {
  const center = points.reduce(
    (sum, point) => ({ x: sum.x + point.x / points.length, z: sum.z + point.z / points.length }),
    { x: 0, z: 0 },
  );
  const ordered = [...points].sort(
    (a, b) =>
      Math.atan2(a.z - center.z, a.x - center.x) - Math.atan2(b.z - center.z, b.x - center.x),
  );
  const vertices = [center.x, y, center.z];
  for (const point of ordered) vertices.push(point.x, y, point.z);
  const indices: number[] = [];
  for (let index = 0; index < ordered.length; index += 1) {
    indices.push(0, ((index + 1) % ordered.length) + 1, index + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

const coastWallGeometry = (coastline: readonly WorldPoint[], top: number, bottom: number) => {
  const vertices: number[] = [];
  const indices: number[] = [];
  for (const point of coastline) {
    vertices.push(point.x, top, point.z, point.x, bottom, point.z);
  }
  for (let index = 0; index < coastline.length; index += 1) {
    const next = (index + 1) % coastline.length;
    indices.push(index * 2, next * 2, index * 2 + 1);
    indices.push(next * 2, next * 2 + 1, index * 2 + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

type TerrainPatch = { color: string; points: readonly WorldPoint[] };
type TerrainPalette = { top: string; upperWall: string; lowerWall: string; coast: string };

const mainTerrainPatches: readonly TerrainPatch[] = [
  {
    color: '#e9dfc5',
    points: [
      { x: -19, z: -11 },
      { x: -14, z: -15 },
      { x: -7, z: -12 },
      { x: -5, z: -5 },
      { x: -9, z: 1 },
      { x: -17, z: 3 },
      { x: -20, z: -3 },
    ],
  },
  {
    color: '#b7dfda',
    points: [
      { x: -8, z: -19 },
      { x: 1, z: -20 },
      { x: 11, z: -15 },
      { x: 12, z: -9 },
      { x: 5, z: -7 },
      { x: -4, z: -10 },
    ],
  },
  {
    color: '#bdd8dc',
    points: [
      { x: 11, z: -10 },
      { x: 18, z: -8 },
      { x: 21, z: -1 },
      { x: 19, z: 8 },
      { x: 12, z: 10 },
      { x: 8, z: 4 },
    ],
  },
  {
    color: '#cce7c7',
    points: [
      { x: -11, z: 8 },
      { x: -3, z: 7 },
      { x: 6, z: 9 },
      { x: 12, z: 16 },
      { x: 5, z: 19 },
      { x: -6, z: 20 },
      { x: -15, z: 15 },
    ],
  },
];

const secondTerrainPatches: readonly TerrainPatch[] = [
  {
    color: '#e6dfc9',
    points: [
      { x: 33, z: -14 },
      { x: 36, z: -19 },
      { x: 42, z: -20 },
      { x: 46, z: -15 },
      { x: 43, z: -9 },
      { x: 36, z: -7 },
    ],
  },
  {
    color: '#a9d8d7',
    points: [
      { x: 38, z: -6 },
      { x: 42, z: 0 },
      { x: 49, z: 0 },
      { x: 54, z: -5 },
      { x: 50, z: -9 },
      { x: 42, z: -9 },
    ],
  },
  {
    color: '#c1d5d9',
    points: [
      { x: 45, z: -14 },
      { x: 51, z: -12 },
      { x: 56, z: -15 },
      { x: 53, z: -21 },
      { x: 46, z: -22 },
      { x: 42, z: -19 },
    ],
  },
];

const IslandTerrain = ({
  coastline,
  patches,
  palette,
}: {
  coastline: readonly WorldPoint[];
  patches: readonly TerrainPatch[];
  palette: TerrainPalette;
}) => {
  const top = useMemo(() => fanGeometry(coastline, 0.1), [coastline]);
  const upperWall = useMemo(() => coastWallGeometry(coastline, 0.1, -0.34), [coastline]);
  const lowerWall = useMemo(() => coastWallGeometry(coastline, -0.34, -0.8), [coastline]);
  const patchGeometries = useMemo(
    () => patches.map((patch) => fanGeometry(patch.points, 0.105)),
    [patches],
  );
  const coastLine = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints(
        coastline.map((point) => new THREE.Vector3(point.x, 0.116, point.z)),
      ),
    [coastline],
  );
  return (
    <>
      <mesh receiveShadow geometry={top}>
        <meshStandardMaterial color={palette.top} roughness={1} />
      </mesh>
      {patches.map((patch, index) => (
        <mesh key={patch.color} receiveShadow geometry={patchGeometries[index]}>
          <meshStandardMaterial color={patch.color} roughness={1} />
        </mesh>
      ))}
      <mesh geometry={upperWall}>
        <meshStandardMaterial color={palette.upperWall} roughness={0.96} />
      </mesh>
      <mesh geometry={lowerWall}>
        <meshStandardMaterial color={palette.lowerWall} roughness={0.95} />
      </mesh>
      <lineLoop geometry={coastLine}>
        <lineBasicMaterial color={palette.coast} transparent opacity={0.8} />
      </lineLoop>
    </>
  );
};

const BridgeDeck = () => {
  const length = worldDistance(worldBridge.start, worldBridge.end);
  const angle = -Math.atan2(
    worldBridge.end.z - worldBridge.start.z,
    worldBridge.end.x - worldBridge.start.x,
  );
  const plankCount = 20;
  return (
    <group>
      {Array.from({ length: plankCount }, (_, index) => {
        const start = index / plankCount;
        const end = (index + 1) / plankCount;
        const spans = worldBridgeGaps.reduce<{ start: number; end: number }[]>(
          (current, gap) =>
            current.flatMap((span) => {
              if (span.end <= gap.startT || span.start >= gap.endT) return [span];
              const pieces = [];
              if (span.start < gap.startT) pieces.push({ start: span.start, end: gap.startT });
              if (span.end > gap.endT) pieces.push({ start: gap.endT, end: span.end });
              return pieces;
            }),
          [{ start, end }],
        );
        return spans.map((span, part) => {
          const t = (span.start + span.end) / 2;
          const point = worldBridgePointAt(t);
          const segmentLength = length * (span.end - span.start);
          const atGapEdge = worldBridgeGaps.some(
            (gap) =>
              Math.abs(span.end - gap.startT) < 0.001 || Math.abs(span.start - gap.endT) < 0.001,
          );
          return (
            <group
              key={`${index}-${part}`}
              position={[point.x, 0, point.z]}
              rotation={[0, angle, 0]}
            >
              <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
                <boxGeometry args={[segmentLength - 0.035, 0.15, worldBridge.width]} />
                <meshPhysicalMaterial
                  color={atGapEdge ? '#eeb75a' : index % 2 === 0 ? '#e9f5f5' : '#d8ebee'}
                  roughness={0.68}
                  clearcoat={0.18}
                />
              </mesh>
              {[-1, 1].map((side) => (
                <mesh
                  key={side}
                  castShadow
                  position={[0, -0.06, side * (worldBridge.width / 2 - 0.12)]}
                >
                  <boxGeometry args={[segmentLength - 0.03, 0.22, 0.24]} />
                  <meshStandardMaterial color="#2672ae" roughness={0.55} />
                </mesh>
              ))}
            </group>
          );
        });
      })}
      {[0.08, 0.28, 0.72, 0.92].map((t) => {
        const point = worldBridgePointAt(t);
        return (
          <group key={t} position={[point.x, -0.4, point.z]} rotation={[0, angle, 0]}>
            {[-1.3, 1.3].map((side) => (
              <mesh key={side} castShadow position={[0, 0, side]}>
                <cylinderGeometry args={[0.13, 0.18, 0.9, 8]} />
                <meshStandardMaterial color="#25679a" roughness={0.7} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
};

const BridgeApproachTrail = () => {
  const segments: readonly { start: WorldPoint; end: WorldPoint; color: string }[] = [
    { start: { x: 16, z: 0 }, end: { x: 18.3, z: -3 }, color: '#eef4e9' },
    { start: { x: 18.3, z: -3 }, end: { x: 20.5, z: -6 }, color: '#eef4e9' },
    { start: { x: 34, z: -8 }, end: { x: 39, z: -9.5 }, color: '#edf4ed' },
    { start: { x: 39, z: -9.5 }, end: { x: 43, z: -10.5 }, color: '#edf4ed' },
  ];
  return (
    <group>
      {segments.map((segment, index) => {
        const length = worldDistance(segment.start, segment.end);
        const angle = -Math.atan2(segment.end.z - segment.start.z, segment.end.x - segment.start.x);
        return (
          <mesh
            key={index}
            receiveShadow
            position={[
              (segment.start.x + segment.end.x) / 2,
              0.12,
              (segment.start.z + segment.end.z) / 2,
            ]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[length + 0.25, 1.65]} />
            <meshStandardMaterial color={segment.color} roughness={1} transparent opacity={0.82} />
          </mesh>
        );
      })}
    </group>
  );
};

const secondTreePositions: readonly (readonly [number, number, number])[] = [
  [36, -17, 0.75],
  [37, -8, 0.85],
  [40, -3, 0.7],
  [46, -2, 0.65],
  [52, -5, 0.8],
  [55, -11, 0.68],
  [53, -19, 0.88],
  [46, -21, 0.72],
  [40, -20, 0.64],
  [48, -15, 0.76],
];

const SecondIslandTree = ({ x, z, scale }: { x: number; z: number; scale: number }) => (
  <group position={[x, 0, z]} scale={scale}>
    <mesh castShadow position={[0, 0.42, 0]}>
      <cylinderGeometry args={[0.15, 0.2, 0.7, 7]} />
      <meshStandardMaterial color="#557b84" roughness={0.92} />
    </mesh>
    <mesh castShadow position={[0, 1.23, 0]}>
      <coneGeometry args={[0.75, 1.7, 6]} />
      <meshStandardMaterial color="#177d94" roughness={0.8} flatShading />
    </mesh>
    <mesh castShadow position={[0, 1.76, 0]}>
      <coneGeometry args={[0.5, 1.05, 6]} />
      <meshStandardMaterial color="#65bdb3" roughness={0.75} flatShading />
    </mesh>
  </group>
);

const SecondIslandLandmark = () => (
  <group position={[WORLD_SECOND_ISLAND_CENTER.x + 6.5, 0, WORLD_SECOND_ISLAND_CENTER.z - 6]}>
    <mesh receiveShadow position={[0, 0.14, 0]}>
      <cylinderGeometry args={[2, 2.25, 0.23, 8]} />
      <meshStandardMaterial color="#a6c7cc" roughness={0.94} flatShading />
    </mesh>
    <mesh castShadow position={[0, 1.05, 0]} rotation={[0.2, 0.4, -0.1]}>
      <dodecahedronGeometry args={[1.05, 0]} />
      <meshStandardMaterial color="#426f89" roughness={0.82} flatShading />
    </mesh>
    <mesh castShadow position={[0.1, 2.45, 0]} rotation={[0, 0.35, 0.18]}>
      <octahedronGeometry args={[1.17]} />
      <meshPhysicalMaterial
        color="#5dc9c7"
        emissive="#238daa"
        emissiveIntensity={0.28}
        roughness={0.22}
        metalness={0.16}
        clearcoat={0.7}
        flatShading
      />
    </mesh>
    {[-1, 1].map((side) => (
      <mesh key={side} castShadow position={[side * 1.35, 0.65, 0.35]} rotation={[0, side, 0]}>
        <dodecahedronGeometry args={[0.68, 0]} />
        <meshStandardMaterial color="#6b9dac" roughness={0.9} flatShading />
      </mesh>
    ))}
  </group>
);

const rocks: readonly [number, number, number][] = [
  [-16, -12, 0.8],
  [-12, -14, 0.5],
  [-14, 11, 0.65],
  [-8, 16, 0.55],
  [12, -12, 0.7],
  [16, -4, 0.9],
  [15, 10, 0.55],
  [5, 16, 0.6],
];

const ScenePromptFollower = ({
  point,
  height,
  elementRef,
}: {
  point?: WorldPoint;
  height: number;
  elementRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { camera, size } = useThree();
  const projected = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const element = elementRef.current;
    if (!element) return;
    if (!point) {
      element.style.visibility = 'hidden';
      return;
    }
    projected.set(point.x, height, point.z).project(camera);
    if (projected.z <= -1 || projected.z >= 1) {
      element.style.visibility = 'hidden';
      return;
    }
    const halfWidth = element.offsetWidth / 2;
    const halfHeight = element.offsetHeight / 2;
    const x = Math.min(
      size.width - halfWidth - 8,
      Math.max(halfWidth + 8, (projected.x * 0.5 + 0.5) * size.width),
    );
    const y = Math.min(
      size.height - halfHeight - 8,
      Math.max(halfHeight + 8, (-projected.y * 0.5 + 0.5) * size.height),
    );
    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    element.style.visibility = 'visible';
  });

  return null;
};

type WorldProps = SceneProps & {
  terminalPromptRef: React.RefObject<HTMLDivElement | null>;
  stationPromptRef: React.RefObject<HTMLDivElement | null>;
};

const World = (props: WorldProps) => {
  const [routeProgress, setRouteProgress] = useState<Record<string, WorldRouteProgress>>({});
  const livePositionRef = useRef<WorldPoint>({ ...props.initialPosition });
  const updateRouteProgress = useCallback((id: string, progress: WorldRouteProgress) => {
    setRouteProgress((current) => ({ ...current, [id]: progress }));
  }, []);
  const terminalPoint = worldTerminals.find((item) => item.id === props.terminalPrompt?.id);
  const stationPoint = props.terminalPrompt
    ? undefined
    : worldStations.find((item) => item.id === props.stationPrompt?.id);
  return (
    <>
      <color attach="background" args={['#d8ecf8']} />
      <fog attach="fog" args={['#d8ecf8', 42, 105]} />
      <hemisphereLight color="#fffdf7" groundColor="#366f8f" intensity={1.25} />
      <ambientLight intensity={0.3} />
      <directionalLight
        castShadow
        position={[7, 15, 6]}
        intensity={2.25}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#8ec9dc" roughness={0.72} metalness={0.04} />
      </mesh>
      <IslandTerrain
        coastline={worldCoastline}
        patches={mainTerrainPatches}
        palette={{ top: '#d7e9dd', upperWall: '#8bbfb5', lowerWall: '#477d9a', coast: '#f3fbef' }}
      />
      <IslandTerrain
        coastline={worldSecondCoastline}
        patches={secondTerrainPatches}
        palette={{ top: '#d9e9e7', upperWall: '#80bac1', lowerWall: '#326786', coast: '#f5fcf4' }}
      />
      <BridgeApproachTrail />
      <BridgeDeck />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.105, 0]}>
        <ringGeometry args={[9.65 * WORLD_LAYOUT_SCALE, 9.95 * WORLD_LAYOUT_SCALE, 96]} />
        <meshStandardMaterial color="#e8f7f2" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.106, 0]}>
        <ringGeometry args={[12.35 * WORLD_LAYOUT_SCALE, 12.55 * WORLD_LAYOUT_SCALE, 96]} />
        <meshStandardMaterial color="#e5f3ec" roughness={1} />
      </mesh>
      {worldSlowZones.map((zone) => (
        <group key={`${zone.x}:${zone.z}`} position={[zone.x, 0, zone.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.121, 0]}>
            <circleGeometry args={[zone.radius, 24]} />
            <meshStandardMaterial color="#d7ceae" roughness={1} transparent opacity={0.75} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.124, 0]}>
            <ringGeometry args={[zone.radius - 0.17, zone.radius - 0.1, 24]} />
            <meshStandardMaterial color="#f0e4bd" roughness={1} transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
      <mesh receiveShadow position={[0, 0.112, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.1, 24.5 * WORLD_LAYOUT_SCALE]} />
        <meshStandardMaterial color="#e1f3ec" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24.5 * WORLD_LAYOUT_SCALE, 2.1]} />
        <meshStandardMaterial color="#e1f3ec" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.119, 0]}>
        <ringGeometry args={[2.35, 2.41, 64]} />
        <meshStandardMaterial color="#82bdd6" roughness={0.82} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <ringGeometry args={[1.36, 1.42, 48]} />
        <meshStandardMaterial color="#9acfe0" roughness={0.82} />
      </mesh>
      {treePositions.map(([x, z, scale]) => (
        <Tree key={`${x}:${z}`} x={x} z={z} scale={scale} />
      ))}
      {secondTreePositions.map(([x, z, scale]) => (
        <SecondIslandTree key={`second-tree:${x}:${z}`} x={x} z={z} scale={scale} />
      ))}
      <SecondIslandLandmark />
      {shrubs.map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0.28, z]} scale={[0.48, 0.35, 0.4]} castShadow>
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial color="#57bca5" flatShading />
        </mesh>
      ))}
      {rocks.map(([x, z, scale]) => (
        <group key={`rock:${x}:${z}`} position={[x, 0.28, z]} scale={scale}>
          <mesh castShadow receiveShadow rotation={[0.2, x * 0.1, -0.15]}>
            <dodecahedronGeometry args={[0.62, 0]} />
            <meshStandardMaterial color="#8aaeba" roughness={0.96} flatShading />
          </mesh>
          <mesh castShadow position={[0.48, -0.08, 0.25]} scale={0.55}>
            <dodecahedronGeometry args={[0.62, 0]} />
            <meshStandardMaterial color="#b5d0cc" roughness={0.96} flatShading />
          </mesh>
        </group>
      ))}
      {worldShards
        .filter((item) => !props.collected.includes(item.id))
        .map((item, index) => (
          <Shard key={item.id} x={item.x} z={item.z} index={index} />
        ))}
      {worldStations.map((station) => (
        <Station key={station.id} station={station} charged={props.charged.includes(station.id)} />
      ))}
      {worldSentries.map((sentry) => (
        <Sentry key={sentry.id} sentry={sentry} />
      ))}
      {worldJumpBarriers.map((barrier) => (
        <JumpBarrier key={barrier.id} barrier={barrier} />
      ))}
      {worldBeacons.map((beacon) => (
        <Beacon key={beacon.id} beacon={beacon} collected={props.beacons.includes(beacon.id)} />
      ))}
      {worldRoutes.map((route) => (
        <RouteMarkers
          key={route.id}
          route={route}
          progress={routeProgress[route.id] ?? initialWorldRouteProgress()}
          completed={props.routes.includes(route.id)}
        />
      ))}
      {worldTerminals.map((terminal) => (
        <Terminal
          key={terminal.id}
          x={terminal.x}
          z={terminal.z}
          solved={props.solved.includes(terminal.id)}
        />
      ))}
      <Player {...props} livePositionRef={livePositionRef} onRouteProgress={updateRouteProgress} />
      <CameraFollow positionRef={livePositionRef} />
      <ScenePromptFollower
        point={terminalPoint}
        height={3.25}
        elementRef={props.terminalPromptRef}
      />
      <ScenePromptFollower point={stationPoint} height={2.9} elementRef={props.stationPromptRef} />
    </>
  );
};

type KepperWorldSceneProps = SceneProps & { fallbackLabel: string; ariaLabel: string };

const KepperWorldScene = ({ fallbackLabel, ariaLabel, ...props }: KepperWorldSceneProps) => {
  const terminalPromptRef = useRef<HTMLDivElement>(null);
  const stationPromptRef = useRef<HTMLDivElement>(null);
  const visibleStationPrompt = props.terminalPrompt ? undefined : props.stationPrompt;

  return (
    <Box
      sx={{
        height: { xs: 460, sm: 540, lg: 620 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#d8ecf8',
      }}
    >
      <Canvas
        shadows="basic"
        camera={{
          position: [props.initialPosition.x + 9, 9.5, props.initialPosition.z + 13],
          fov: 45,
          near: 0.1,
          far: 120,
        }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        fallback={<Typography sx={{ p: 4 }}>{fallbackLabel}</Typography>}
        aria-label={ariaLabel}
      >
        <World
          {...props}
          terminalPromptRef={terminalPromptRef}
          stationPromptRef={stationPromptRef}
        />
      </Canvas>
      <Box
        ref={terminalPromptRef}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 2,
          width: 'max-content',
          maxWidth: 220,
          textAlign: 'center',
          visibility: 'hidden',
          pointerEvents: props.terminalPrompt?.kind === 'interact' ? 'auto' : 'none',
        }}
      >
        {props.terminalPrompt?.kind === 'interact' ? (
          <Button
            variant="contained"
            size="small"
            onClick={props.onInteract}
            startIcon={
              <Box
                component="kbd"
                aria-hidden="true"
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 22,
                  height: 21,
                  border: '1px solid #ffffff70',
                  borderRadius: 0.5,
                  bgcolor: '#ffffff14',
                  color: '#b9e8f3',
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                ↵
              </Box>
            }
            sx={{
              px: 1.25,
              py: 0.55,
              minHeight: 34,
              borderRadius: 1,
              bgcolor: '#102e47f0',
              color: '#f1f8fa',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'none',
              whiteSpace: 'normal',
              lineHeight: 1.25,
              boxShadow: '0 6px 20px #09273a50',
              '&:hover': { bgcolor: '#1c5575' },
            }}
          >
            {props.terminalPrompt.label}
          </Button>
        ) : props.terminalPrompt ? (
          <Box
            role="status"
            sx={{
              px: 1.25,
              py: 0.75,
              borderRadius: 1,
              bgcolor: '#4c3130f0',
              color: 'common.white',
              boxShadow: '0 6px 18px #09273a42',
            }}
          >
            <Typography variant="caption" fontWeight={700}>
              {props.terminalPrompt.label}
            </Typography>
          </Box>
        ) : null}
      </Box>
      <Box
        ref={stationPromptRef}
        role="status"
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 2,
          maxWidth: 220,
          visibility: 'hidden',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.25,
          py: 0.65,
          borderRadius: 1,
          bgcolor: '#102e47f0',
          color: '#f1f8fa',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: '0 6px 18px #09273a42',
        }}
      >
        <Box
          component="span"
          aria-hidden="true"
          sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#74e3bb', flex: '0 0 auto' }}
        />
        {visibleStationPrompt?.label}
      </Box>
    </Box>
  );
};

export default KepperWorldScene;
