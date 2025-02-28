import { BaseStatus } from '@app/common';

export type ArenaStatus = BaseStatus;
export const ArenaStatus = {...BaseStatus};

export interface ArenaChapter {
  id: number;
  title: string;
  icon: string;
}

export interface Arena {
  id: number;
  title: string;
  status: number;
  startTime: string;
  finishTime: string;
  startNaturaltime: string;
  finishNaturaltime: string;
  timeSeconds: number;
  questionsCount: number;
  isRegistrated: boolean;
  pause: boolean;
  winner: any;
  chapters: Array<ArenaChapter>;
}

export interface ArenaPlayer {
  rowIndex: number;
  username: string;
  rankTitle: string;
  rating: string;
  points: number;
  streak: boolean;
  results: Array<number>;
  isBot: boolean;
}

export interface ArenaPlayerStatistics {
  username: string;
  rankTitle: string;
  perfomance: number;
  challenges: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
  opponents: Array<any>;
}

export interface ArenaStatistics {
  averageRating: number;
  challenges: number;
}
