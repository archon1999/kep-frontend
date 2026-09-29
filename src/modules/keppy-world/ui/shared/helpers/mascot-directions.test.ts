import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import * as THREE from 'three';
import { mascotAtlasRects } from './mascot-atlas-rects.ts';
import {
  createAtlasFrame,
  directionFromRelativeYaw,
  mascotDirections,
} from './mascot-directions.ts';

test('camera-relative directions cover eight headings and wrap across either side of the rear', () => {
  for (let index = 0; index < 8; index += 1) {
    for (const revolution of [-2, -1, 0, 1, 2]) {
      const yaw = (index * Math.PI) / 4 + revolution * Math.PI * 2;
      assert.equal(directionFromRelativeYaw(yaw), mascotDirections[index]);
    }
  }
  assert.equal(directionFromRelativeYaw(Math.PI - 0.01), 'back');
  assert.equal(directionFromRelativeYaw(-Math.PI + 0.01), 'back');
  assert.equal(directionFromRelativeYaw(-Math.PI / 4), 'frontRight');
});

test('atlas views isolate UV state and preserve top-left crop coordinates for either texture orientation', () => {
  const source = new THREE.Texture({ width: 1024, height: 1536 } as TexImageSource);
  const rect = { x: 0.1, y: 0.05, width: 0.3, height: 0.35 };
  const front = createAtlasFrame(source, rect);
  const back = createAtlasFrame(source, { ...rect, x: 0.6 });
  assert.deepEqual(source.repeat.toArray(), [1, 1]);
  assert.deepEqual(source.offset.toArray(), [0, 0]);
  assert.deepEqual(front.texture.repeat.toArray(), [0.3, 0.35]);
  assert.equal(front.texture.offset.x, 0.1);
  assert.ok(Math.abs(front.texture.offset.y - 0.6) < 1e-8);
  assert.equal(front.aspect, (1024 * 0.3) / (1536 * 0.35));
  front.texture.offset.x = 0.2;
  assert.equal(back.texture.offset.x, 0.6);
  assert.equal(front.texture.source, source.source);
  assert.equal(front.texture.colorSpace, THREE.SRGBColorSpace);
  assert.equal(source.colorSpace, THREE.NoColorSpace);
  source.flipY = false;
  const unflipped = createAtlasFrame(source, rect);
  assert.equal(unflipped.texture.offset.y, 0.05);
  front.texture.dispose();
  back.texture.dispose();
  unflipped.texture.dispose();
  source.dispose();
});

test('all eleven mascots have eight complete crop views backed by actual artwork', () => {
  assert.equal(Object.keys(mascotAtlasRects).length, 11);
  for (const [id, atlas] of Object.entries(mascotAtlasRects)) {
    assert.equal(Object.keys(atlas.cardinal ?? {}).length, 4, `${id}: cardinal views`);
    assert.equal(Object.keys(atlas.diagonal ?? {}).length, 4, `${id}: diagonal views`);
    for (const rect of Object.values({ ...atlas.cardinal, ...atlas.diagonal })) {
      assert.ok(rect.width > 0 && rect.height > 0, `${id}: empty crop`);
      assert.ok(rect.x >= 0 && rect.y >= 0, `${id}: negative crop offset`);
      assert.ok(rect.x + rect.width <= 1 && rect.y + rect.height <= 1, `${id}: crop outside image`);
    }
    assert.ok(existsSync(resolve('public/mascot/world/directions', `${id}-diagonals.png`)));
    if (id !== 'keppy')
      assert.ok(existsSync(resolve('public/mascot/world/directions', `${id}-directions.png`)));
  }
  const robotFront = mascotAtlasRects.kepbot.cardinal!.front!;
  assert.ok(robotFront.y + robotFront.height > 0.5, 'robot feet cross the nominal atlas midline');
  assert.ok(mascotAtlasRects['algo-dragon'].diagonal!.frontLeft!.x > 0.5);
  assert.ok(mascotAtlasRects['algo-dragon'].diagonal!.frontRight!.x < 0.5);
});
