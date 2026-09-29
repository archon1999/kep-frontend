import type { MascotDirection } from './mascot-directions';

type HeadFit = {
  top: number;
  eyes: number;
  width: number;
  sideOffset: number;
};

// Coordinates are relative to the centre of the normalized 2.16-unit sprite.
// Ears, horns and the turtle's shell are deliberately excluded from head size.
const headFits: Record<string, HeadFit> = {
  keppy: { top: 0.95, eyes: 0.12, width: 1.32, sideOffset: 0.06 },
  'keppy-owl': { top: 0.8, eyes: 0.4, width: 1.14, sideOffset: 0.12 },
  kepbot: { top: 1.0, eyes: 0.6, width: 1.12, sideOffset: 0.09 },
  'algo-fox': { top: 0.61, eyes: 0.28, width: 0.88, sideOffset: 0.32 },
  'algo-dragon': { top: 0.82, eyes: 0.46, width: 0.9, sideOffset: 0.26 },
  'code-penguin': { top: 1.0, eyes: 0.49, width: 1.09, sideOffset: 0.16 },
  'algo-turtle': { top: 1.01, eyes: 0.65, width: 0.9, sideOffset: 0.52 },
  'sprint-bunny': { top: 0.42, eyes: 0.08, width: 0.65, sideOffset: 0.02 },
  'debug-cat': { top: 0.72, eyes: 0.31, width: 0.93, sideOffset: 0.19 },
  'streak-spirit': { top: 0.64, eyes: 0.18, width: 0.96, sideOffset: 0.2 },
  'kepcoin-explorer': { top: 0.98, eyes: 0.72, width: 0.69, sideOffset: 0.02 },
};

const directions: Record<MascotDirection, { yaw: number; side: number; front: boolean }> = {
  front: { yaw: 0, side: 0, front: true },
  frontLeft: { yaw: -Math.PI / 4, side: -0.65, front: true },
  left: { yaw: -Math.PI / 2, side: -1, front: true },
  backLeft: { yaw: (-Math.PI * 3) / 4, side: -0.58, front: false },
  back: { yaw: Math.PI, side: 0, front: false },
  backRight: { yaw: (Math.PI * 3) / 4, side: 0.58, front: false },
  right: { yaw: Math.PI / 2, side: 1, front: true },
  frontRight: { yaw: Math.PI / 4, side: 0.65, front: true },
};

export const accessoryAnchor = (mascotId: string, direction: MascotDirection) => {
  const fit = headFits[mascotId] ?? headFits.keppy;
  const view = directions[direction];
  return {
    ...fit,
    x: fit.sideOffset * view.side,
    yaw: mascotId === 'keppy' && Math.abs(view.yaw) === Math.PI / 2 ? view.yaw / 2 : view.yaw,
    front: view.front,
    side: Math.abs(view.side) === 1,
  };
};

export const cosmeticIcons: Record<string, string> = {
  none: 'mdi:circle-off-outline',
  explorer: 'mdi:hat-fedora',
  engineer: 'mdi:safety-goggles',
  signal: 'mdi:access-point',
  crown: 'mdi:crown-outline',
  beret: 'mdi:palette-outline',
  headphones: 'mdi:headphones',
  'flower-wreath': 'mdi:flower-outline',
  'wizard-hat': 'mdi:wizard-hat',
  'captain-hat': 'mdi:anchor',
  'space-visor': 'mdi:space-station',
};

export const cosmeticColors: Record<string, string> = {
  none: '#718793',
  explorer: '#b28b48',
  engineer: '#468ea0',
  signal: '#46a593',
  crown: '#c89b38',
  beret: '#af5777',
  headphones: '#537ba7',
  'flower-wreath': '#b178a0',
  'wizard-hat': '#7966b0',
  'captain-hat': '#42748a',
  'space-visor': '#4b9fa7',
};

export const accessoryNameplateHeight = (kind: string) =>
  kind === 'wizard-hat' ? 3.65 : kind === 'signal' ? 3.1 : 2.72;
