export enum ArenaStatus {
  NotStarted = -1,
  Already = 0,
  Finished = 1,
}

export interface ArenaChapter {
  id: number;
  title: string;
  icon: string;
}

export interface Arena {
  id: number;
  title: string;
  status: ArenaStatus;
  startTime: string;
  finishTime: string;
  startNaturaltime: string;
  finishNaturaltime: string;
  timeSeconds: number;
  questionsCount: number;
  isRegistrated: boolean;
  pause: boolean;
  winner: unknown;
  chapters: ArenaChapter[];
}
