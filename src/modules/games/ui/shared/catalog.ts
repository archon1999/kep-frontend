import { generatePath } from 'react-router';
import { resources } from 'app/routes/resources';
import type { GameId } from '../../domain';

export type GameCardData = {
  id: GameId;
  icon: string;
  color: string;
};

export const gamesCatalog: readonly GameCardData[] = [
  { id: 'keppy-world', icon: 'mdi:compass-outline', color: '#2179ba' },
  { id: 'code-islands', icon: 'mdi:code-braces', color: '#246ed3' },
  { id: 'bug-hunt', icon: 'mdi:bug-outline', color: '#9a6147' },
  { id: 'logic-circuit', icon: 'mdi:source-branch', color: '#8270b7' },
  { id: 'memory-grid', icon: 'mdi:grid', color: '#368c81' },
  { id: 'math-compare', icon: 'mdi:compare-horizontal', color: '#805578' },
  { id: 'quick-math', icon: 'mdi:calculator-variant-outline', color: '#25778b' },
  { id: 'number-sequence', icon: 'mdi:ray-start-arrow', color: '#6862aa' },
  { id: 'number-hunt', icon: 'mdi:gesture-tap', color: '#b07937' },
  { id: 'memory-matrix', icon: 'mdi:table-large', color: '#37867a' },
];

export const gamePath = (id: GameId) => generatePath(resources.Game, { gameId: id });
