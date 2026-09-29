import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type WorldPoint, predictWorldStep } from 'modules/keppy-world/domain/utils/terrain';
import { accessoryNameplateHeight } from 'modules/keppy-world/ui/shared/helpers/mascot-accessories';
import {
  type MascotDirection,
  cardinalAtlasCells,
  createAtlasFrame,
  diagonalAtlasCells,
  directionFromRelativeYaw,
} from 'modules/keppy-world/ui/shared/helpers/mascot-directions';
import * as THREE from 'three';
import { type AccessoryPose, WorldAccessories } from './WorldAccessories';
import type { MascotVisual, WorldMoveIntent, WorldScenePlayer } from './world-scene.types';

type Props = {
  player: WorldScenePlayer;
  self: boolean;
  visual: MascotVisual;
  zones: string[];
  movement: React.RefObject<WorldMoveIntent>;
  selfPosition: React.RefObject<THREE.Vector3>;
  reducedMotion: boolean;
  preview?: boolean;
  peers?: readonly WorldScenePlayer[];
  kiosks?: readonly WorldPoint[];
};

const prepareTextures = (textures: THREE.Texture[]) => {
  textures.forEach((texture) => {
    if (texture.colorSpace !== THREE.SRGBColorSpace) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
    texture.anisotropy = 4;
  });
};

const nameTexture = (username: string, level: number, self: boolean) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null;
  const name = Array.from(username).slice(0, 24).join('');
  context.font = '500 28px system-ui, sans-serif';
  const width = Math.ceil(context.measureText(name).width + 89);
  canvas.width = width;
  canvas.height = 58;
  context.fillStyle = self ? 'rgba(35, 88, 130, .94)' : 'rgba(249, 252, 252, .92)';
  context.beginPath();
  context.roundRect(0, 0, width, 56, 20);
  context.fill();
  context.font = '600 24px system-ui, sans-serif';
  context.textBaseline = 'middle';
  context.fillStyle = self ? '#b9e9ff' : '#56818b';
  context.textAlign = 'center';
  context.fillText(String(level), 28, 29);
  context.font = '500 28px system-ui, sans-serif';
  context.textAlign = 'left';
  context.fillStyle = self ? '#ffffff' : '#263d4b';
  context.fillText(name, 57, 29);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return { texture, width };
};

const emoteTexture = (emote: string | undefined) => {
  const text = ({ wave: '👋', heart: '💙', gg: 'GG' } as Record<string, string>)[emote ?? ''];
  if (!text) return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.fillStyle = 'rgba(250,253,252,.97)';
  context.beginPath();
  context.roundRect(10, 8, 108, 108, 30);
  context.fill();
  context.fillStyle = '#4785b4';
  context.font = '600 63px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 64, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

export const WorldAvatar = memo(
  ({
    player,
    self,
    visual,
    zones,
    movement,
    selfPosition,
    reducedMotion,
    preview = false,
    peers = [],
    kiosks = [],
  }: Props) => {
    const group = useRef<THREE.Group>(null);
    const body = useRef<THREE.Group>(null);
    const cosmetics = useRef<THREE.Group>(null);
    const accessoryPose = useRef<AccessoryPose>({ direction: 'front' });
    const sprite = useRef<THREE.Sprite>(null);
    const name = useRef<THREE.Sprite>(null);
    const heading = useRef<THREE.Group>(null);
    const shadow = useRef<THREE.Mesh>(null);
    const textures = useTexture(
      [
        visual.idle,
        visual.runLeft ?? visual.idle,
        visual.runRight ?? visual.idle,
        visual.back ?? visual.idle,
        visual.directionAtlas ?? visual.idle,
        visual.diagonalAtlas ?? visual.idle,
      ],
      prepareTextures,
    );
    // Drei invokes onLoad on mount; a character change can reuse this avatar
    // with a new texture set, which still needs sRGB before its first upload.
    useLayoutEffect(() => prepareTextures(textures), [textures]);
    const frames = useMemo(() => {
      const original = (texture: THREE.Texture) => ({ texture, aspect: 1, cropped: false });
      const cardinal = {
        front: original(textures[0]),
        left: original(textures[1]),
        right: original(textures[2]),
        back: original(textures[3]),
      };
      for (const key of ['front', 'back', 'left', 'right'] as const) {
        if (visual.directionAtlas || visual.directionRects?.[key]) {
          cardinal[key] = createAtlasFrame(
            visual.directionAtlas ? textures[4] : cardinal[key].texture,
            visual.directionRects?.[key] ?? cardinalAtlasCells[key],
          );
        }
      }
      const views: Record<MascotDirection, (typeof cardinal)['front']> = {
        ...cardinal,
        frontLeft: cardinal.left,
        frontRight: cardinal.right,
        backLeft: cardinal.left,
        backRight: cardinal.right,
      };
      if (visual.diagonalAtlas) {
        for (const key of ['frontLeft', 'frontRight', 'backLeft', 'backRight'] as const) {
          views[key] = createAtlasFrame(
            textures[5],
            visual.diagonalRects?.[key] ?? diagonalAtlasCells[key],
          );
        }
      }
      return views;
    }, [
      textures,
      visual.directionAtlas,
      visual.diagonalAtlas,
      visual.directionRects,
      visual.diagonalRects,
    ]);
    const label = useMemo(
      () => nameTexture(player.username, player.level, self),
      [player.username, player.level, self],
    );
    const emote = useMemo(() => emoteTexture(player.emote), [player.emote]);
    const target = useMemo(() => new THREE.Vector3(player.x, player.y, player.z), []);
    const sampled = useRef({ at: 0, x: player.x, y: player.y, z: player.z });
    const initialPosition = useMemo<[number, number, number]>(() => [player.x, 0, player.z], []);
    const displayed = useRef<THREE.Vector3>(null!);
    const previous = useRef<THREE.Vector3>(null!);
    if (!displayed.current) displayed.current = new THREE.Vector3(player.x, player.y, player.z);
    if (!previous.current) previous.current = displayed.current.clone();
    const walk = useRef(0);
    const phase = useRef(Number(player.userId) * 0.47 || 0);
    const facing = useRef(player.yaw);
    const nameplateHeight = accessoryNameplateHeight(player.equippedCosmetic);
    const predictionPeers = useMemo(
      () =>
        self
          ? peers.filter(
              (peer) =>
                peer.sessionId !== player.sessionId &&
                !peer.falling &&
                Math.hypot(peer.x - player.x, peer.z - player.z) < 4,
            )
          : [],
      [peers, self, player.sessionId, player.x, player.z],
    );
    const predictionKiosks = useMemo(
      () =>
        self
          ? kiosks.filter((kiosk) => Math.hypot(kiosk.x - player.x, kiosk.z - player.z) < 4)
          : [],
      [kiosks, self, player.x, player.z],
    );

    useEffect(() => () => label?.texture.dispose(), [label]);
    useEffect(() => () => emote?.dispose(), [emote]);
    useEffect(
      () => () => {
        // Cardinal fallbacks can be referenced by multiple directions.
        const cloned = new Set(
          Object.values(frames)
            .filter((frame) => frame.cropped)
            .map((frame) => frame.texture),
        );
        cloned.forEach((texture) => texture.dispose());
      },
      [frames],
    );
    useLayoutEffect(() => {
      previous.current.copy(displayed.current);
      sampled.current.at = performance.now();
      sampled.current.x = player.x;
      sampled.current.y = player.y;
      sampled.current.z = player.z;
    }, [player.x, player.y, player.z, player.lastSeq]);

    useFrame(({ camera }, delta) => {
      if (!group.current || !body.current || !sprite.current) return;
      const dt = Math.min(delta, 0.05);
      const sample = sampled.current;
      const age = Math.max(0, (performance.now() - sample.at) / 1000);
      if (self && !player.falling) {
        const input = movement.current;
        const predicted = predictWorldStep(
          sample,
          input,
          Math.min(age, 0.1),
          zones,
          predictionPeers,
          predictionKiosks,
        );
        target.set(predicted.x, sample.y, predicted.z);
        if (displayed.current.distanceToSquared(target) > 16) displayed.current.copy(target);
        else displayed.current.lerp(target, 1 - Math.exp(-24 * dt));
      } else {
        target.set(sample.x, sample.y, sample.z);
        if (previous.current.distanceToSquared(target) > 16) displayed.current.copy(target);
        else displayed.current.lerpVectors(previous.current, target, Math.min(age / 0.1, 1));
      }
      group.current.position.set(displayed.current.x, 0, displayed.current.z);
      body.current.position.y = displayed.current.y;
      if (self)
        selfPosition.current.set(
          displayed.current.x,
          Math.max(0, displayed.current.y),
          displayed.current.z,
        );

      const moving = self
        ? Math.hypot(movement.current.x, movement.current.z) > 0.1 && !player.falling
        : player.moving;
      const desiredYaw =
        self && moving ? Math.atan2(movement.current.x, movement.current.z) : player.yaw;
      const difference = Math.atan2(
        Math.sin(desiredYaw - facing.current),
        Math.cos(desiredYaw - facing.current),
      );
      facing.current += difference * (1 - Math.exp(-13 * dt));
      const cameraYaw = Math.atan2(
        camera.position.x - displayed.current.x,
        camera.position.z - displayed.current.z,
      );
      const relativeYaw = Math.atan2(
        Math.sin(cameraYaw - facing.current),
        Math.cos(cameraYaw - facing.current),
      );
      const direction = directionFromRelativeYaw(relativeYaw);
      const frame = frames[direction];
      accessoryPose.current.direction = direction;
      const material = sprite.current.material as THREE.SpriteMaterial;
      if (material.map !== frame.texture) {
        material.map = frame.texture;
      }
      walk.current += ((moving ? 1 : 0) - walk.current) * (1 - Math.exp(-10 * dt));
      phase.current += dt * (moving ? 11.5 : 2);
      const motion = reducedMotion ? 0 : walk.current;
      const bounce = Math.abs(Math.sin(phase.current)) * 0.08 * motion;
      const squash = Math.sin(phase.current * 2) * 0.025 * motion;
      const turnNarrowing =
        !visual.back && !visual.directionAtlas ? Math.abs(Math.sin(relativeYaw)) * 0.09 : 0;
      const height = frame.cropped ? 2.16 : 2.24;
      sprite.current.scale.set(
        height * frame.aspect * (1 - squash - turnNarrowing),
        height * (1 + squash),
        1,
      );
      sprite.current.position.y = height / 2 + 0.03 + bounce;
      material.rotation = reducedMotion ? 0 : -Math.sin(phase.current) * 0.055 * motion;
      if (heading.current) heading.current.rotation.y = facing.current;
      if (cosmetics.current) {
        // The artwork is a billboard, including camera pitch. Attach outfits in
        // that same plane, then turn each headpiece with the selected body view.
        cosmetics.current.quaternion.copy(camera.quaternion);
        cosmetics.current.rotateZ(material.rotation);
        cosmetics.current.position.copy(sprite.current.position);
        cosmetics.current.scale.set(1 - squash, 1 + squash, 1);
      }
      if (shadow.current) {
        shadow.current.scale.setScalar(Math.max(0.25, 1 - displayed.current.y * 0.14));
        (shadow.current.material as THREE.MeshBasicMaterial).opacity = player.falling
          ? 0
          : Math.max(0.06, 0.2 - displayed.current.y * 0.06);
      }
      if (name.current) {
        name.current.position.y = nameplateHeight + Math.max(0, displayed.current.y);
        name.current.visible =
          !player.falling && camera.position.distanceToSquared(group.current.position) < 1800;
      }
      group.current.visible = displayed.current.y > -5;
    });

    // Movement patches update refs above. Keeping the actual mesh tree stable
    // avoids reconciling dozens of unchanged Three objects per player per tick.
    return useMemo(
      () => (
        <group ref={group} position={initialPosition}>
          <mesh ref={shadow} position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.57, 16]} />
            <meshBasicMaterial color="#526f75" transparent opacity={0.2} depthWrite={false} />
          </mesh>
          {!preview && (
            <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.65, 24]} />
              <meshBasicMaterial
                color={self ? '#438dd8' : (visual.color ?? '#81aaba')}
                transparent
                opacity={self ? 0.8 : 0.45}
                depthWrite={false}
              />
            </mesh>
          )}
          {!preview && (
            <group ref={heading}>
              <mesh position={[0, 0.045, 0.89]} rotation={[-Math.PI / 2, 0, Math.PI]}>
                <circleGeometry args={[0.16, 3, Math.PI / 2]} />
                <meshBasicMaterial
                  color={self ? '#438dd8' : '#698797'}
                  transparent
                  opacity={0.85}
                  depthWrite={false}
                />
              </mesh>
            </group>
          )}
          <group ref={body}>
            <sprite ref={sprite} position={[0, 1.15, 0]} scale={[2.24, 2.24, 1]}>
              <spriteMaterial
                map={frames.front.texture}
                transparent
                alphaTest={0.02}
                depthWrite={false}
                toneMapped={false}
              />
            </sprite>
            <group ref={cosmetics}>
              <WorldAccessories
                kind={player.equippedCosmetic}
                mascotId={player.mascotId}
                pose={accessoryPose}
              />
            </group>
            {emote && (
              <sprite position={[0, nameplateHeight + 0.75, 0]} scale={[0.9, 0.9, 1]}>
                <spriteMaterial map={emote} transparent depthWrite={false} depthTest={false} />
              </sprite>
            )}
          </group>
          {label && !preview && (
            <sprite ref={name} position={[0, 2.72, 0]} scale={[label.width / 165, 0.35, 1]}>
              <spriteMaterial
                map={label.texture}
                transparent
                depthWrite={false}
                depthTest={false}
              />
            </sprite>
          )}
        </group>
      ),
      [
        initialPosition,
        self,
        visual.color,
        frames,
        player.equippedCosmetic,
        player.mascotId,
        label,
        emote,
        preview,
        nameplateHeight,
      ],
    );
  },
);
