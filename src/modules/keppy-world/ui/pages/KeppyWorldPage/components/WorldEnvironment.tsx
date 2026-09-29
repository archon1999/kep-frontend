import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { type WorldPoint, worldLandPolygons } from 'modules/keppy-world/domain/utils/terrain';
import * as THREE from 'three';
import { WorldStructures } from './WorldStructures';

const fanGeometry = (points: WorldPoint[], center: WorldPoint, color: string, variation = true) => {
  const positions: number[] = [],
    colors: number[] = [];
  const tint = new THREE.Color(color);
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    positions.push(center.x, 0, center.z, next.x, 0, next.z, point.x, 0, point.z);
    const shade = variation ? 1 + Math.sin(Math.floor(index / 9) * 4.7) * 0.018 : 1;
    for (let vertex = 0; vertex < 3; vertex += 1)
      colors.push(tint.r * shade, tint.g * shade, tint.b * shade);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
};

const coastWall = (points: WorldPoint[]) => {
  const vertices: number[] = [],
    indices: number[] = [];
  points.forEach((point) => vertices.push(point.x, 0, point.z, point.x, -1.7, point.z));
  points.forEach((_, index) => {
    const next = (index + 1) % points.length;
    indices.push(index * 2, next * 2, index * 2 + 1, next * 2, next * 2 + 1, index * 2 + 1);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};
const expand = (points: WorldPoint[], center: WorldPoint, amount: number) =>
  points.map((point) => {
    const x = point.x - center.x,
      z = point.z - center.z,
      length = Math.hypot(x, z);
    return { x: point.x + (x / length) * amount, z: point.z + (z / length) * amount };
  });

const Island = memo(({ land }: { land: ReturnType<typeof worldLandPolygons>[number] }) => {
  const group = useRef<THREE.Group>(null);
  const reveal = useRef(land.id === 'plaza' ? 1 : 0);
  const geometry = useMemo(
    () => ({
      top: fanGeometry(
        land.points,
        land.center,
        (
          {
            academy: '#c3d1c0',
            island: '#bfd2b3',
            'workshop-island': '#cdd0b6',
            'crystal-island': '#cbd8d5',
            citadel: '#b8c8bd',
          } as Record<string, string>
        )[land.id] ?? '#c4d6bc',
      ),
      beach: fanGeometry(expand(land.points, land.center, 1.05), land.center, '#e3dbc0', false),
      foam: fanGeometry(expand(land.points, land.center, 1.65), land.center, '#d5e8dc', false),
      wall: coastWall(land.points),
    }),
    [land],
  );
  useEffect(() => () => Object.values(geometry).forEach((item) => item.dispose()), [geometry]);
  useFrame((_, delta) => {
    if (reveal.current < 1 && group.current) {
      reveal.current = Math.min(1, reveal.current + delta / 1.2);
      // Keep newly unlocked ground above the water while its buildings appear.
      group.current.position.y = -0.12 * Math.pow(1 - reveal.current, 3);
    }
  });
  return (
    <group ref={group}>
      <mesh geometry={geometry.top} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <mesh geometry={geometry.beach} position={[0, -0.075, 0]}>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <mesh geometry={geometry.foam} position={[0, -0.22, 0]}>
        <meshBasicMaterial vertexColors transparent opacity={0.52} depthWrite={false} />
      </mesh>
      <mesh geometry={geometry.wall}>
        <meshStandardMaterial color="#9aafa1" flatShading roughness={1} />
      </mesh>
    </group>
  );
});

export const WorldEnvironment = memo(
  ({ zones }: { zones: string[] }) => {
    const lands = useMemo(() => worldLandPolygons(zones), [zones]);
    return (
      <group>
        <mesh position={[0, -0.3, -30]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[750, 750]} />
          <meshStandardMaterial color="#92bec8" roughness={0.8} metalness={0.04} />
        </mesh>
        {lands.map((land) => (
          <Island key={land.id} land={land} />
        ))}
        <WorldStructures zones={zones} />
      </group>
    );
  },
  (before, after) =>
    before.zones.length === after.zones.length &&
    before.zones.every((zone) => after.zones.includes(zone)),
);
