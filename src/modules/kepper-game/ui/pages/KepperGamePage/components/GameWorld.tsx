import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { OrbitControls, RoundedBox, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ParsedMap, TraceFrame } from 'modules/kepper-game/domain/entities';
import { useThemeMode } from 'shared/hooks/useThemeMode.tsx';
import * as THREE from 'three';

type GameWorldProps = {
  map: ParsedMap;
  frame: TraceFrame;
  playing: boolean;
  completed: boolean;
  fallbackLabel: string;
  ariaLabel: string;
};

const CELL = 1.22;
// The later routes run diagonally across two axes. View them from the other
// side so the route uses the wide canvas instead of collapsing into a column.
const cameraOffsetX = (map: ParsedMap) => (map.width >= 7 && map.height >= 5 ? -6.4 : 6.4);

const worldPoint = (x: number, z: number, map: ParsedMap) =>
  [(x - (map.width - 1) / 2) * CELL, (z - (map.height - 1) / 2) * CELL] as const;

const mapCenter = (map: ParsedMap) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const key of map.tiles) {
    const [x, z] = key.split(',').map(Number);
    const [worldX, worldZ] = worldPoint(x, z, map);
    minX = Math.min(minX, worldX);
    maxX = Math.max(maxX, worldX);
    minZ = Math.min(minZ, worldZ);
    maxZ = Math.max(maxZ, worldZ);
  }
  if (map.tiles.size === 0) return [0, 0.45, 0] as const;
  return [(minX + maxX) / 2, 0.45, (minZ + maxZ) / 2] as const;
};

// The program directions are east, south, west, north. KEPPER faces local +Z.
const facingAngle = [Math.PI / 2, 0, -Math.PI / 2, Math.PI] as const;

const KepperAvatar = ({
  map,
  frame,
  playing,
}: Pick<GameWorldProps, 'map' | 'frame' | 'playing'>) => {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const sprite = useRef<THREE.Sprite>(null);
  const frontTexture = useTexture(`${import.meta.env.BASE_URL}mascot/kepper/game-idle.png`);
  const rightTexture = useTexture(`${import.meta.env.BASE_URL}mascot/kepper/game-run-right.png`);
  const leftTexture = useTexture(`${import.meta.env.BASE_URL}mascot/kepper/game-run-left.png`);
  const backTexture = useTexture(`${import.meta.env.BASE_URL}mascot/kepper/game-back.webp`);
  const { camera, invalidate } = useThree();
  const [x, z] = worldPoint(frame.x, frame.z, map);
  useEffect(() => {
    for (const texture of [frontTexture, rightTexture, leftTexture, backTexture]) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    }
    invalidate();
  }, [frontTexture, rightTexture, leftTexture, backTexture, invalidate]);
  useEffect(() => invalidate(), [frame, invalidate]);
  useFrame((state, delta) => {
    if (!group.current) return;
    const avatar = group.current;
    const positionTarget = new THREE.Vector3(x, 0.24, z);
    const positionDelta = avatar.position.distanceTo(positionTarget);
    avatar.position.lerp(positionTarget, 1 - Math.exp(-12 * delta));

    // Take the shortest quarter-turn, including the north -> east wraparound.
    const turnDelta = Math.atan2(
      Math.sin(facingAngle[frame.direction] - avatar.rotation.y),
      Math.cos(facingAngle[frame.direction] - avatar.rotation.y),
    );
    avatar.rotation.y += turnDelta * (1 - Math.exp(-11 * delta));

    // Select full-body front, side and rear art by the camera's angle to
    // KEPPER's actual heading, including when the player orbits the scene.
    const cameraYaw = Math.atan2(
      camera.position.x - avatar.position.x,
      camera.position.z - avatar.position.z,
    );
    const relativeYaw = Math.atan2(
      Math.sin(cameraYaw - avatar.rotation.y),
      Math.cos(cameraYaw - avatar.rotation.y),
    );
    const angle = Math.abs(relativeYaw);
    // A translucent blend duplicates the eyes and silhouette. Switch the
    // complete pose at the 45°/136° sightlines instead.
    const nextTexture =
      angle < Math.PI / 4
        ? frontTexture
        : angle < Math.PI * 0.755
          ? relativeYaw < 0
            ? rightTexture
            : leftTexture
          : backTexture;
    const spriteMaterial = sprite.current?.material as THREE.SpriteMaterial | undefined;
    const textureChanged = spriteMaterial?.map !== nextTexture;
    if (spriteMaterial && textureChanged) {
      spriteMaterial.map = nextTexture;
      spriteMaterial.needsUpdate = true;
    }

    let poseDelta = 0;
    if (body.current) {
      const moving = playing && (frame.action === 'move' || frame.action === 'jump');
      const bounceTarget = moving ? Math.abs(Math.sin(state.clock.elapsedTime * 12)) * 0.07 : 0;
      const leanTarget = !playing
        ? 0
        : frame.action === 'left'
          ? 0.11
          : frame.action === 'right'
            ? -0.11
            : 0;
      poseDelta =
        Math.abs(bounceTarget - body.current.position.y) +
        Math.abs(leanTarget - body.current.rotation.z);
      body.current.position.y += (bounceTarget - body.current.position.y) * Math.min(1, delta * 14);
      body.current.rotation.z += (leanTarget - body.current.rotation.z) * Math.min(1, delta * 11);
    }

    // The canvas uses a demand-based render loop outside playback. Finish the turn
    // and the final step instead of freezing at the first interpolated frame.
    if (
      !playing &&
      (positionDelta > 0.002 || Math.abs(turnDelta) > 0.002 || poseDelta > 0.002 || textureChanged)
    )
      invalidate();
  });
  return (
    <group ref={group} position={[x, 0.24, z]} rotation={[0, facingAngle[frame.direction], 0]}>
      <group ref={body}>
        <sprite ref={sprite} position={[0, 0.7, 0]} scale={[1.18, 1.28, 1]} renderOrder={2}>
          <spriteMaterial
            map={frontTexture}
            transparent
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[0.36, 32]} />
        <meshBasicMaterial color="#093e9c" transparent opacity={0.14} depthWrite={false} />
      </mesh>
    </group>
  );
};

const Island = ({ map, frame, completed }: Pick<GameWorldProps, 'map' | 'frame' | 'completed'>) => {
  const tiles: { x: number; z: number; key: string }[] = [];
  map.tiles.forEach((key) => {
    const [x, z] = key.split(',').map(Number);
    tiles.push({ x, z, key });
  });
  return (
    <>
      {tiles.map(({ x, z, key }) => {
        const [wx, wz] = worldPoint(x, z, map);
        const goal = x === map.goal.x && z === map.goal.z;
        const start = x === map.start.x && z === map.start.z;
        const crystal = map.crystals.has(key) && !frame.collected.includes(key);
        const switchTile = map.switches.has(key);
        const gate = map.gates.has(key);
        const fragile = map.fragile.has(key);
        const teleporter = map.teleports.has(key);
        const conveyor = map.conveyors.get(key);
        if (frame.collapsed.includes(key)) return null;
        return (
          <group key={key} position={[wx, 0, wz]}>
            <RoundedBox
              args={[1.13, 0.42, 1.13]}
              radius={0.12}
              smoothness={4}
              position={[0, -0.14, 0]}
              receiveShadow
              castShadow
            >
              <meshStandardMaterial color="#17469a" roughness={0.7} />
            </RoundedBox>
            <RoundedBox
              args={[1.16, 0.2, 1.16]}
              radius={0.09}
              smoothness={4}
              position={[0, 0.11, 0]}
              receiveShadow
            >
              <meshPhysicalMaterial
                color={
                  goal
                    ? '#b3f4df'
                    : start
                      ? '#b4d7ff'
                      : gate
                        ? frame.gateOpen
                          ? '#b9f4da'
                          : '#f8c4c4'
                        : fragile
                          ? '#ffdfae'
                          : conveyor !== undefined
                            ? '#c4eaf0'
                            : teleporter
                              ? '#e0d7ff'
                              : '#f7fbff'
                }
                roughness={0.38}
                metalness={0.05}
                clearcoat={0.36}
              />
            </RoundedBox>
            {switchTile && (
              <group position={[0, 0.23, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.28, 0.28, 0.05, 24]} />
                  <meshStandardMaterial
                    color={frame.gateOpen ? '#1cc498' : '#24a8d7'}
                    emissive={frame.gateOpen ? '#0a9770' : '#126da6'}
                    emissiveIntensity={0.38}
                  />
                </mesh>
              </group>
            )}
            {gate && !frame.gateOpen && (
              <mesh position={[0, 0.57, 0]} castShadow>
                <boxGeometry args={[0.86, 0.68, 0.16]} />
                <meshPhysicalMaterial color="#dc5c73" transparent opacity={0.76} roughness={0.3} />
              </mesh>
            )}
            {fragile && (
              <group position={[0, 0.225, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0.5]}>
                  <planeGeometry args={[0.65, 0.025]} />
                  <meshBasicMaterial color="#b67731" />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, -0.55]} position={[0.1, 0.002, -0.12]}>
                  <planeGeometry args={[0.42, 0.025]} />
                  <meshBasicMaterial color="#b67731" />
                </mesh>
              </group>
            )}
            {teleporter && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.24, 0]}>
                <torusGeometry args={[0.33, 0.075, 10, 36]} />
                <meshStandardMaterial color="#8758e5" emissive="#6e42cc" emissiveIntensity={0.35} />
              </mesh>
            )}
            {conveyor !== undefined && (
              <group rotation={[0, -(conveyor * Math.PI) / 2, 0]} position={[0, 0.235, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
                  <coneGeometry args={[0.2, 0.5, 3]} />
                  <meshStandardMaterial color="#258a9d" />
                </mesh>
              </group>
            )}
            {goal && (
              <group position={[0, 0.29, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.34, 0.055, 10, 48]} />
                  <meshStandardMaterial
                    color={completed ? '#25b987' : '#41c9af'}
                    emissive="#0c8e8c"
                    emissiveIntensity={0.45}
                  />
                </mesh>
                <mesh position={[0, 0.1, 0]}>
                  <octahedronGeometry args={[0.18]} />
                  <meshPhysicalMaterial
                    color="#35d7bb"
                    emissive="#27ab9a"
                    emissiveIntensity={0.5}
                    roughness={0.18}
                  />
                </mesh>
              </group>
            )}
            {crystal && (
              <group position={[0, 0.5, 0]}>
                <mesh castShadow rotation={[0.32, 0.26, 0.18]}>
                  <octahedronGeometry args={[0.22]} />
                  <meshPhysicalMaterial
                    color="#ffcb54"
                    emissive="#f9a824"
                    emissiveIntensity={0.42}
                    roughness={0.16}
                    metalness={0.28}
                  />
                </mesh>
                <mesh position={[0, -0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[0.18, 28]} />
                  <meshBasicMaterial color="#d78b00" transparent opacity={0.15} />
                </mesh>
              </group>
            )}
            {!goal && !start && !crystal && (x + z) % 3 === 0 && (
              <mesh position={[0.39, 0.23, -0.39]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.045, 12]} />
                <meshBasicMaterial color="#91bff8" />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
};

const Scene = ({
  map,
  frame,
  playing,
  completed,
  dark,
}: Pick<GameWorldProps, 'map' | 'frame' | 'playing' | 'completed'> & { dark: boolean }) => {
  const { camera, invalidate, size } = useThree();
  const backdrop = dark ? '#14283f' : '#183656';
  const ground = dark ? '#1d3652' : '#244361';
  const center = useMemo(() => mapCenter(map), [map]);
  useEffect(() => {
    camera.position.set(center[0] + cameraOffsetX(map), center[1] + 8.5, center[2] + 9.5);
    camera.lookAt(...center);
    camera.updateMatrixWorld();
    if (camera instanceof THREE.OrthographicCamera) {
      let horizontalRadius = 0;
      let verticalRadius = 0;
      // Frame the actual platforms in camera space. The empty cells in a sparse
      // map do not need to shrink the whole island, but the avatar and crystals
      // still need clearance above every platform.
      for (const key of map.tiles) {
        const [x, z] = key.split(',').map(Number);
        const [worldX, worldZ] = worldPoint(x, z, map);
        for (const offsetX of [-0.66, 0.66]) {
          for (const offsetZ of [-0.66, 0.66]) {
            for (const height of [-0.38, 1.65]) {
              const point = camera.worldToLocal(
                new THREE.Vector3(worldX + offsetX, height, worldZ + offsetZ),
              );
              horizontalRadius = Math.max(horizontalRadius, Math.abs(point.x));
              verticalRadius = Math.max(verticalRadius, Math.abs(point.y));
            }
          }
        }
      }
      camera.zoom = Math.min(
        90,
        (size.width * 0.9) / (2 * Math.max(horizontalRadius, 1)),
        (size.height * (size.height < 320 ? 0.78 : 0.85)) / (2 * Math.max(verticalRadius, 1)),
      );
    }
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, center, invalidate, map, size.height, size.width]);
  return (
    <>
      <color attach="background" args={[backdrop]} />
      <fog attach="fog" args={[backdrop, 18, 34]} />
      <hemisphereLight intensity={2.2} color="#ffffff" groundColor="#568dcd" />
      <directionalLight
        position={[4, 8, 5]}
        intensity={2.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
      />
      <ambientLight intensity={0.45} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.94, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color={ground} roughness={1} />
      </mesh>
      <Island map={map} frame={frame} completed={completed} />
      <Suspense fallback={null}>
        <KepperAvatar map={map} frame={frame} playing={playing} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping={!playing}
        minDistance={5.5}
        maxDistance={18}
        minPolarAngle={0.48}
        maxPolarAngle={1.22}
        target={center}
      />
    </>
  );
};

const GameWorld = ({
  map,
  frame,
  playing,
  completed,
  fallbackLabel,
  ariaLabel,
}: GameWorldProps) => {
  const { t } = useTranslation();
  const { isDark } = useThemeMode();
  return (
    <Box
      sx={{
        position: 'relative',
        height: {
          xs: map.width + map.height >= 10 ? 275 : 260,
          sm: 390,
          lg: 'clamp(420px, 50vh, 500px)',
        },
        overflow: 'hidden',
        borderRadius: 1,
        bgcolor: isDark ? '#14283f' : '#183656',
      }}
    >
      <Canvas
        shadows
        orthographic
        camera={{ position: [cameraOffsetX(map), 8.5, 9.5], zoom: 59, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        frameloop={playing ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        fallback={<Typography sx={{ p: 4 }}>{fallbackLabel}</Typography>}
        aria-label={ariaLabel}
      >
        <Scene map={map} frame={frame} playing={playing} completed={completed} dark={isDark} />
      </Canvas>
      {(playing || completed) && (
        <Stack
          direction="row"
          alignItems="center"
          gap={0.75}
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 18 },
            right: { xs: 12, sm: 20 },
            px: 1.25,
            py: 0.5,
            borderRadius: 1,
            bgcolor: 'rgba(7,24,44,.68)',
            pointerEvents: 'none',
          }}
        >
          <Box
            component="span"
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: completed ? '#4bd7a2' : '#ffcb63',
            }}
          />
          <Typography variant="caption" fontWeight={700} sx={{ color: '#fff' }}>
            {t(completed ? 'game.stageCleared' : 'game.stageRunning')}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default GameWorld;
