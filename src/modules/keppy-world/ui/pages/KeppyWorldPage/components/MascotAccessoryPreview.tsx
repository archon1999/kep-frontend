import { Suspense, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { mascotVisuals } from 'modules/keppy-world/ui/shared/helpers/mascot-visuals';
import * as THREE from 'three';
import { WorldAvatar } from './WorldAvatar';
import type { WorldMoveIntent, WorldScenePlayer } from './world-scene.types';

export const MascotAccessoryPreview = ({
  mascotId,
  cosmetic,
  yaw = 0,
}: {
  mascotId: string;
  cosmetic: string;
  yaw?: number;
}) => {
  const movement = useRef<WorldMoveIntent>({ x: 0, z: 0, jump: false, seq: 0 });
  const position = useRef(new THREE.Vector3());
  const player = useMemo<WorldScenePlayer>(
    () => ({
      sessionId: 'wardrobe-preview',
      userId: 0,
      username: '',
      mascotId,
      equippedCosmetic: cosmetic,
      level: 1,
      x: 0,
      y: 0,
      z: 0,
      yaw,
      moving: false,
      falling: false,
      lastSeq: 0,
    }),
    [mascotId, cosmetic, yaw],
  );
  return (
    <Canvas
      camera={{ position: [0, 1.55, 6.8], fov: 30 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ camera }) => camera.lookAt(0, 1.4, 0)}
      style={{ pointerEvents: 'none' }}
    >
      <hemisphereLight args={['#fff8e6', '#8ba4b6', 2.2]} />
      <directionalLight position={[-3, 6, 4]} intensity={2.2} color="#fff6e7" />
      <Suspense fallback={null}>
        <WorldAvatar
          player={player}
          self={false}
          visual={mascotVisuals[mascotId] ?? mascotVisuals.keppy}
          zones={['plaza']}
          movement={movement}
          selfPosition={position}
          reducedMotion
          preview
        />
      </Suspense>
    </Canvas>
  );
};
