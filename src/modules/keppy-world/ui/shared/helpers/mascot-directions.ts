import * as THREE from 'three';
import type { AtlasRect } from '../../pages/KeppyWorldPage/components/world-scene.types';

export const mascotDirections = [
  'front',
  'frontLeft',
  'left',
  'backLeft',
  'back',
  'backRight',
  'right',
  'frontRight',
] as const;

export type MascotDirection = (typeof mascotDirections)[number];

export const directionFromRelativeYaw = (yaw: number): MascotDirection => {
  const index = Math.round(yaw / (Math.PI / 4));
  return mascotDirections[((index % 8) + 8) % 8];
};

export const cardinalAtlasCells: Record<'front' | 'back' | 'left' | 'right', AtlasRect> = {
  front: { x: 0, y: 0, width: 0.5, height: 0.5 },
  back: { x: 0.5, y: 0, width: 0.5, height: 0.5 },
  left: { x: 0, y: 0.5, width: 0.5, height: 0.5 },
  right: { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
};

export const diagonalAtlasCells: Record<
  'frontLeft' | 'frontRight' | 'backLeft' | 'backRight',
  AtlasRect
> = {
  backLeft: { x: 0, y: 0, width: 0.5, height: 0.5 },
  backRight: { x: 0.5, y: 0, width: 0.5, height: 0.5 },
  frontLeft: { x: 0, y: 0.5, width: 0.5, height: 0.5 },
  frontRight: { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
};

export const createAtlasFrame = (source: THREE.Texture, rect: AtlasRect) => {
  // Every view owns its UV transform. The loader's shared texture and pixel
  // source remain untouched, so one player's turn cannot change another's art.
  const texture = source.clone();
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.repeat.set(rect.width, rect.height);
  texture.offset.set(rect.x, source.flipY ? 1 - rect.y - rect.height : rect.y);
  texture.needsUpdate = true;
  const image = source.image as { width: number; height: number };
  return {
    texture,
    aspect: (image.width * rect.width) / (image.height * rect.height),
    cropped: true,
  };
};
