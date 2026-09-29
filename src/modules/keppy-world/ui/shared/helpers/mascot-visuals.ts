import type { MascotVisual } from 'modules/keppy-world/ui/pages/KeppyWorldPage/components/world-scene.types';
import { mascotAtlasRects } from './mascot-atlas-rects';

const art = (filename: string) => `${import.meta.env.BASE_URL}mascot/world/${filename}`;
const keppy = (filename: string) => `${import.meta.env.BASE_URL}mascot/kepper/${filename}`;
const directionAtlas = (id: string) => art(`directions/${id}-directions.png`);

// Original, user-supplied characters; these are not recoloured KEPPER reactions.
const originalVisuals: Record<string, MascotVisual> = {
  'keppy-owl': {
    idle: art('01-keppy-owl.webp'),
    directionAtlas: directionAtlas('keppy-owl'),
    color: '#598ede',
  },
  kepbot: {
    idle: art('02-kepbot.webp'),
    directionAtlas: directionAtlas('kepbot'),
    color: '#54a5c2',
  },
  'algo-fox': {
    idle: art('03-algo-fox.webp'),
    directionAtlas: directionAtlas('algo-fox'),
    color: '#5279cf',
  },
  'algo-dragon': {
    idle: art('04-algo-dragon.webp'),
    directionAtlas: directionAtlas('algo-dragon'),
    color: '#e5b05b',
  },
  'code-penguin': {
    idle: art('05-code-penguin.webp'),
    directionAtlas: directionAtlas('code-penguin'),
    color: '#7a9ccb',
  },
  'algo-turtle': {
    idle: art('06-algo-turtle.webp'),
    directionAtlas: directionAtlas('algo-turtle'),
    color: '#4aaa9e',
  },
  'sprint-bunny': {
    idle: art('07-sprint-bunny.webp'),
    directionAtlas: directionAtlas('sprint-bunny'),
    color: '#b08bcf',
  },
  'debug-cat': {
    idle: art('08-debug-cat.webp'),
    directionAtlas: directionAtlas('debug-cat'),
    color: '#758ad7',
  },
  keppy: {
    idle: keppy('game-idle.png'),
    runLeft: keppy('game-run-left.png'),
    runRight: keppy('game-run-right.png'),
    back: keppy('game-back.webp'),
    color: '#3f8af3',
  },
  'streak-spirit': {
    idle: art('10-streak-spirit.webp'),
    directionAtlas: directionAtlas('streak-spirit'),
    color: '#ea9c48',
  },
  'kepcoin-explorer': {
    idle: art('11-kepcoin-explorer.webp'),
    directionAtlas: directionAtlas('kepcoin-explorer'),
    color: '#d6b24e',
  },
};

export const mascotVisuals: Record<string, MascotVisual> = Object.fromEntries(
  Object.entries(originalVisuals).map(([id, visual]) => [
    id,
    {
      ...visual,
      diagonalAtlas: art(`directions/${id}-diagonals.png`),
      directionRects: mascotAtlasRects[id]?.cardinal,
      diagonalRects: mascotAtlasRects[id]?.diagonal,
    },
  ]),
);

export const mascotPortraits: Record<string, string> = {
  ...Object.fromEntries(Object.entries(mascotVisuals).map(([id, visual]) => [id, visual.idle])),
  keppy: art('09-kepper.webp'),
};

export const mascotOptions = [
  { id: 'keppy', name: 'KEPPER' },
  { id: 'keppy-owl', name: 'Keppy Owl' },
  { id: 'kepbot', name: 'Kepbot' },
  { id: 'algo-fox', name: 'Algo Fox' },
  { id: 'algo-dragon', name: 'Algo Dragon' },
  { id: 'code-penguin', name: 'Code Penguin' },
  { id: 'algo-turtle', name: 'Algo Turtle' },
  { id: 'sprint-bunny', name: 'Sprint Bunny' },
  { id: 'debug-cat', name: 'Debug Cat' },
  { id: 'streak-spirit', name: 'Streak Spirit' },
  { id: 'kepcoin-explorer', name: 'Kepcoin Explorer' },
].map((mascot) => ({ ...mascot, image: mascotPortraits[mascot.id] }));
