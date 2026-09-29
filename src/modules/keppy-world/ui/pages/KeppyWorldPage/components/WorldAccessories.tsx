import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { accessoryAnchor } from 'modules/keppy-world/ui/shared/helpers/mascot-accessories';
import {
  type MascotDirection,
  mascotDirections,
} from 'modules/keppy-world/ui/shared/helpers/mascot-directions';
import * as THREE from 'three';

export type AccessoryPose = { direction: MascotDirection };

const ExplorerHat = () => (
  <group position={[0, -0.05, 0]} rotation={[0.12, 0, 0]}>
    <mesh scale={[1.05, 1, 0.92]}>
      <cylinderGeometry args={[0.56, 0.56, 0.055, 24]} />
      <meshStandardMaterial color="#d7b575" roughness={0.96} />
    </mesh>
    <mesh position={[0, 0.025, -0.035]} scale={[1, 0.7, 0.94]}>
      <sphereGeometry args={[0.41, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#e4c58c" roughness={0.94} />
    </mesh>
    <mesh position={[0, 0.075, -0.035]}>
      <cylinderGeometry args={[0.397, 0.405, 0.1, 20]} />
      <meshStandardMaterial color="#795d3d" roughness={0.85} />
    </mesh>
    <mesh position={[0, 0.085, 0.375]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.069, 0.069, 0.028, 6]} />
      <meshStandardMaterial color="#eac76d" metalness={0.28} roughness={0.45} />
    </mesh>
  </group>
);

const EngineerGoggles = ({ face }: { face: React.RefObject<THREE.Group | null> }) => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, Math.PI]} scale={[1.15, 0.82, 1]}>
      <torusGeometry args={[0.36, 0.038, 5, 20, Math.PI]} />
      <meshStandardMaterial color="#82694a" roughness={0.85} />
    </mesh>
    <group ref={face} position={[0, 0, 0.13]}>
      {[-0.205, 0.205].map((x) => (
        <group key={x} position={[x, 0, 0.12]}>
          <mesh>
            <torusGeometry args={[0.178, 0.037, 7, 20]} />
            <meshStandardMaterial color="#d5a956" metalness={0.38} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.009]}>
            <circleGeometry args={[0.153, 20]} />
            <meshStandardMaterial
              color="#a5e0e9"
              transparent
              opacity={0.22}
              metalness={0.1}
              roughness={0.2}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[-0.045, 0.067, 0.016]} rotation={[0, 0, -0.4]}>
            <capsuleGeometry args={[0.012, 0.09, 2, 4]} />
            <meshBasicMaterial color="#e8fbff" transparent opacity={0.75} depthWrite={false} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.015, 0.12]}>
        <boxGeometry args={[0.095, 0.047, 0.04]} />
        <meshStandardMaterial color="#b38943" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  </group>
);

const SignalHeadset = () => (
  <group position={[0.41, -0.29, 0.04]} rotation={[0, 0, -0.11]}>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.105, 0.105, 0.115, 12]} />
      <meshStandardMaterial color="#346c79" roughness={0.7} />
    </mesh>
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.017, 0.025, 0.52, 6]} />
      <meshStandardMaterial color="#9ad0ce" metalness={0.35} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.58, 0]}>
      <sphereGeometry args={[0.062, 10, 8]} />
      <meshStandardMaterial
        color="#b7ffe4"
        emissive="#5adfbd"
        emissiveIntensity={0.4}
        roughness={0.4}
      />
    </mesh>
    <mesh position={[0.065, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <circleGeometry args={[0.062, 12]} />
      <meshBasicMaterial color="#81e9d2" />
    </mesh>
  </group>
);

const GoldenCrown = () => (
  <group position={[0, 0.015, 0]}>
    <mesh>
      <cylinderGeometry args={[0.34, 0.3, 0.16, 24, 1, true]} />
      <meshStandardMaterial
        color="#e6b957"
        roughness={0.38}
        metalness={0.45}
        side={THREE.DoubleSide}
      />
    </mesh>
    <mesh position={[0, -0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.303, 0.026, 5, 24]} />
      <meshStandardMaterial color="#f4d58a" roughness={0.4} metalness={0.35} />
    </mesh>
    {[0, 1, 2, 3, 4].map((index) => {
      const angle = (index * Math.PI * 2) / 5;
      return (
        <mesh
          key={index}
          position={[Math.sin(angle) * 0.315, 0.14, Math.cos(angle) * 0.315]}
          rotation={[0, angle, 0]}
        >
          <coneGeometry args={[0.12, 0.26, 4]} />
          <meshStandardMaterial color="#f0c96e" metalness={0.4} roughness={0.36} />
        </mesh>
      );
    })}
    <mesh position={[0, 0.005, 0.337]} scale={[0.72, 1, 0.65]}>
      <octahedronGeometry args={[0.07]} />
      <meshStandardMaterial color="#42b8a5" metalness={0.2} roughness={0.24} />
    </mesh>
  </group>
);

const ArtistBeret = () => (
  <group rotation={[0.06, 0, -0.12]} position={[-0.04, -0.005, 0]}>
    <mesh position={[0, -0.04, 0]} scale={[1, 1, 0.9]}>
      <cylinderGeometry args={[0.35, 0.35, 0.065, 20]} />
      <meshStandardMaterial color="#734058" roughness={0.95} />
    </mesh>
    <mesh position={[-0.065, 0.055, 0]} scale={[1.16, 0.32, 1]}>
      <sphereGeometry args={[0.4, 20, 12]} />
      <meshStandardMaterial color="#b96381" roughness={1} />
    </mesh>
    <mesh position={[-0.1, 0.19, 0]} rotation={[0, 0, -0.25]}>
      <capsuleGeometry args={[0.027, 0.055, 3, 7]} />
      <meshStandardMaterial color="#914866" roughness={1} />
    </mesh>
  </group>
);

const StudioHeadphones = () => (
  <group position={[0, -0.32, 0]}>
    <mesh>
      <torusGeometry args={[0.43, 0.048, 6, 24, Math.PI]} />
      <meshStandardMaterial color="#35506c" roughness={0.72} />
    </mesh>
    <mesh position={[0, 0.018, -0.008]}>
      <torusGeometry args={[0.435, 0.019, 5, 24, Math.PI]} />
      <meshStandardMaterial color="#a7d3df" roughness={0.64} />
    </mesh>
    {[-1, 1].map((side) => (
      <group key={side} position={[side * 0.43, 0, 0]}>
        <mesh scale={[1, 1.28, 1]}>
          <sphereGeometry args={[0.105, 12, 8]} />
          <meshStandardMaterial color="#d1e0e4" roughness={0.85} />
        </mesh>
        <mesh position={[side * 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.105, 0.105, 0.1, 12]} />
          <meshStandardMaterial color="#5682a7" roughness={0.52} metalness={0.15} />
        </mesh>
        <mesh position={[side * 0.114, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.054, 12]} />
          <meshBasicMaterial color="#c5edf1" side={THREE.DoubleSide} />
        </mesh>
      </group>
    ))}
  </group>
);

const WizardHat = () => (
  <group position={[0, -0.045, 0]}>
    <mesh scale={[1, 1, 0.9]}>
      <cylinderGeometry args={[0.49, 0.49, 0.055, 24]} />
      <meshStandardMaterial color="#64568d" roughness={0.95} />
    </mesh>
    <group position={[-0.025, 0.39, 0]} rotation={[0, 0, 0.1]}>
      <mesh>
        <coneGeometry args={[0.335, 0.86, 16]} />
        <meshStandardMaterial color="#8971b8" roughness={0.9} />
      </mesh>
      <mesh position={[0.005, -0.3, 0]}>
        <cylinderGeometry args={[0.265, 0.307, 0.11, 16]} />
        <meshStandardMaterial color="#c9b580" roughness={0.8} />
      </mesh>
      <mesh position={[0.025, -0.03, 0.185]} rotation={[0, 0, Math.PI / 4]} scale={[1, 1.3, 0.5]}>
        <octahedronGeometry args={[0.062]} />
        <meshStandardMaterial color="#ffe6a3" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[-0.065, 0.21, 0.08]} scale={[1, 1.3, 0.5]}>
        <octahedronGeometry args={[0.031]} />
        <meshStandardMaterial color="#fff0bb" roughness={0.45} />
      </mesh>
    </group>
  </group>
);

const FlowerWreath = () => {
  const petals = useRef<THREE.InstancedMesh>(null);
  const centers = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const matrix = new THREE.Object3D(),
      color = new THREE.Color();
    const palette = ['#f0c2ad', '#ede1ee', '#b997cf'];
    for (let flower = 0; flower < 7; flower++) {
      const angle = (flower * Math.PI * 2) / 7;
      const x = Math.sin(angle) * 0.37,
        z = Math.cos(angle) * 0.37;
      for (let petal = 0; petal < 5; petal++) {
        const turn = (petal * Math.PI * 2) / 5;
        matrix.position.set(
          x + Math.cos(angle) * Math.cos(turn) * 0.052,
          0.03 + Math.sin(turn) * 0.052,
          z - Math.sin(angle) * Math.cos(turn) * 0.052,
        );
        matrix.rotation.set(0, angle, turn - Math.PI / 2);
        matrix.scale.set(0.037, 0.06, 0.016);
        matrix.updateMatrix();
        petals.current?.setMatrixAt(flower * 5 + petal, matrix.matrix);
        petals.current?.setColorAt(flower * 5 + petal, color.set(palette[flower % palette.length]));
      }
      matrix.position.set(x + Math.sin(angle) * 0.02, 0.03, z + Math.cos(angle) * 0.02);
      matrix.rotation.set(0, angle, 0);
      matrix.scale.set(0.033, 0.033, 0.022);
      matrix.updateMatrix();
      centers.current?.setMatrixAt(flower, matrix.matrix);
    }
    for (const mesh of [petals.current, centers.current])
      if (mesh) {
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        mesh.computeBoundingSphere();
      }
  }, []);
  return (
    <group position={[0, -0.025, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.37, 0.038, 6, 28]} />
        <meshStandardMaterial color="#739a75" roughness={0.95} />
      </mesh>
      <instancedMesh ref={petals} args={[undefined, undefined, 35]}>
        <sphereGeometry args={[1, 7, 5]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={centers} args={[undefined, undefined, 7]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#e4bb65" roughness={0.8} />
      </instancedMesh>
    </group>
  );
};

const CaptainHat = () => (
  <group position={[0, -0.035, 0]}>
    <mesh scale={[1, 1, 0.88]}>
      <cylinderGeometry args={[0.39, 0.37, 0.13, 24]} />
      <meshStandardMaterial color="#365372" roughness={0.86} />
    </mesh>
    <mesh position={[0, 0.15, -0.02]} rotation={[0, 0, -0.04]} scale={[1, 0.45, 0.86]}>
      <sphereGeometry args={[0.45, 20, 12]} />
      <meshStandardMaterial color="#f2ead8" roughness={0.92} />
    </mesh>
    <mesh position={[0, -0.045, 0.29]} scale={[0.38, 0.034, 0.26]}>
      <sphereGeometry args={[1, 18, 8]} />
      <meshStandardMaterial color="#344c69" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.01, 0.373]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.065, 0.065, 0.027, 8]} />
      <meshStandardMaterial color="#e9cb7e" metalness={0.2} roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.005, 0.39]}>
      <boxGeometry args={[0.021, 0.083, 0.018]} />
      <meshStandardMaterial color="#466077" roughness={0.5} />
    </mesh>
  </group>
);

const SpaceVisor = ({ face }: { face: React.RefObject<THREE.Group | null> }) => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, Math.PI]} scale={[1.25, 0.9, 1]}>
      <torusGeometry args={[0.36, 0.031, 6, 24, Math.PI]} />
      <meshStandardMaterial color="#d2e0dc" roughness={0.65} />
    </mesh>
    {[-1, 1].map((side) => (
      <mesh key={side} position={[side * 0.49, 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.11, 12]} />
        <meshStandardMaterial color="#ecb36a" roughness={0.5} metalness={0.18} />
      </mesh>
    ))}
    <group ref={face} position={[0, 0, 0.085]}>
      <mesh scale={[1, 0.67, 1]}>
        <torusGeometry args={[0.48, 0.034, 7, 28]} />
        <meshStandardMaterial color="#d5e5e2" metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.56, 0.67]}>
        <sphereGeometry args={[0.47, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#83d4df"
          transparent
          opacity={0.2}
          roughness={0.2}
          metalness={0.1}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[-0.23, 0.12, 0.22]} rotation={[0, -0.3, -0.38]}>
        <capsuleGeometry args={[0.012, 0.14, 2, 5]} />
        <meshBasicMaterial color="#efffff" transparent opacity={0.7} depthWrite={false} />
      </mesh>
    </group>
  </group>
);

export const WorldAccessories = memo(
  ({
    kind,
    mascotId,
    pose,
  }: {
    kind: string;
    mascotId: string;
    pose: React.RefObject<AccessoryPose>;
  }) => {
    const rig = useRef<THREE.Group>(null);
    const face = useRef<THREE.Group>(null);
    const anchors = useMemo(
      () =>
        Object.fromEntries(
          mascotDirections.map((direction) => [direction, accessoryAnchor(mascotId, direction)]),
        ) as Record<MascotDirection, ReturnType<typeof accessoryAnchor>>,
      [mascotId],
    );
    useFrame(() => {
      if (!rig.current) return;
      const anchor = anchors[pose.current.direction];
      const glasses = kind === 'engineer' || kind === 'space-visor';
      rig.current.position.set(anchor.x, glasses ? anchor.eyes : anchor.top, 0.04);
      rig.current.scale.set(
        anchor.width * (kind === 'headphones' ? 1.26 : 1),
        anchor.width,
        anchor.width,
      );
      rig.current.rotation.y = anchor.yaw;
      if (face.current) face.current.visible = anchor.front;
    });
    if (kind === 'none') return null;
    return (
      <group ref={rig}>
        {kind === 'explorer' && <ExplorerHat />}
        {kind === 'engineer' && <EngineerGoggles face={face} />}
        {kind === 'signal' && <SignalHeadset />}
        {kind === 'crown' && <GoldenCrown />}
        {kind === 'beret' && <ArtistBeret />}
        {kind === 'headphones' && <StudioHeadphones />}
        {kind === 'flower-wreath' && <FlowerWreath />}
        {kind === 'wizard-hat' && <WizardHat />}
        {kind === 'captain-hat' && <CaptainHat />}
        {kind === 'space-visor' && <SpaceVisor face={face} />}
      </group>
    );
  },
);
