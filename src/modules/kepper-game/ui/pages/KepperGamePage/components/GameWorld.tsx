import { Suspense, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { OrbitControls, RoundedBox, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ParsedMap, TraceFrame } from 'modules/kepper-game/domain/entities';
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

const worldPoint = (x: number, z: number, map: ParsedMap) =>
  [(x - (map.width - 1) / 2) * CELL, (z - (map.height - 1) / 2) * CELL] as const;

const KepperAvatar = ({ map, frame }: Pick<GameWorldProps, 'map' | 'frame'>) => {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture(`${import.meta.env.BASE_URL}mascot/kepper/game-idle.png`);
  const { invalidate } = useThree();
  const [x, z] = worldPoint(frame.x, frame.z, map);
  useEffect(() => invalidate(), [frame, invalidate]);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.position.lerp(new THREE.Vector3(x, 0.24, z), 1 - Math.exp(-12 * delta));
    group.current.rotation.y +=
      ((frame.direction * Math.PI) / 2 - group.current.rotation.y) * Math.min(1, delta * 8);
    group.current.children[0].position.y = 0.69 + Math.sin(state.clock.elapsedTime * 8) * 0.025;
  });
  return (
    <group ref={group} position={[x, 0.24, z]}>
      <group>
        <mesh castShadow position={[0, 0.66, 0]} scale={[0.82, 0.9, 0.55]}>
          <sphereGeometry args={[0.53, 32, 24]} />
          <meshPhysicalMaterial
            color="#1765cf"
            roughness={0.24}
            metalness={0.08}
            clearcoat={0.65}
          />
        </mesh>
        <sprite position={[0, 0.7, 0.4]} scale={[1.15, 1.15, 1]}>
          <spriteMaterial
            map={texture}
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
                color={goal ? '#b3f4df' : start ? '#b4d7ff' : '#f7fbff'}
                roughness={0.38}
                metalness={0.05}
                clearcoat={0.36}
              />
            </RoundedBox>
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
}: Omit<GameWorldProps, 'fallbackLabel' | 'ariaLabel'>) => {
  const { camera, invalidate, size } = useThree();
  useEffect(() => {
    camera.position.set(6.4, 8.5, 9.5);
    camera.lookAt(0, 0, 0);
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = Math.min(
        85,
        Math.max(58, size.width * 0.12),
        (59 * 6) / Math.max(map.width, map.height),
      );
    }
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, map.height, map.width, size.width]);
  return (
    <>
      <color attach="background" args={['#ddecff']} />
      <fog attach="fog" args={['#ddecff', 18, 34]} />
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
        <meshStandardMaterial color="#dcefff" roughness={1} />
      </mesh>
      <Island map={map} frame={frame} completed={completed} />
      <Suspense fallback={null}>
        <KepperAvatar map={map} frame={frame} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping={!playing}
        minDistance={5.5}
        maxDistance={18}
        minPolarAngle={0.48}
        maxPolarAngle={1.22}
        target={[0, 0, 0]}
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
}: GameWorldProps) => (
  <Box
    sx={{
      position: 'relative',
      height: { xs: 360, sm: 470, lg: 610 },
      overflow: 'hidden',
      borderRadius: 4,
      background: 'linear-gradient(150deg, #dbefff 0%, #eaf7ff 52%, #cbddff 100%)',
    }}
  >
    <Canvas
      shadows
      orthographic
      camera={{ position: [6.4, 8.5, 9.5], zoom: 59, near: 0.1, far: 100 }}
      dpr={[1, 1.75]}
      frameloop={playing ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      fallback={<Typography sx={{ p: 4 }}>{fallbackLabel}</Typography>}
      aria-label={ariaLabel}
    >
      <Scene map={map} frame={frame} playing={playing} completed={completed} />
    </Canvas>
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        px: 1.5,
        py: 0.75,
        bgcolor: 'rgba(255,255,255,.78)',
        borderRadius: 2,
        boxShadow: '0 8px 26px #1c53921c',
        pointerEvents: 'none',
      }}
    >
      <Typography variant="caption" fontWeight={800} letterSpacing={1.2} color="#2161ad">
        KEPPER • 3D
      </Typography>
    </Box>
  </Box>
);

export default GameWorld;
