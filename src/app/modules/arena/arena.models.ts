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
  finishNatuarltime: string;
  timeSeconds: number;
  questionsCount: number;
  isRegistrated: boolean;
  pause: boolean;
  winner: any;
  chapters: Array<ArenaChapter>;
}

export interface ArenaPlayer {
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
