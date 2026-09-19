import type { ContestantEntity } from './contestant.entity';

export type ReplayParticipant = Pick<
  ContestantEntity,
  'username' | 'userFullName' | 'ratingTitle' | 'country' | 'isOfficial' | 'isUnrated' | 'team'
>;

export interface ReplayProblem {
  symbol: string;
  points: number;
  penalties: number;
  attempts: number;
  solved: boolean;
  firstAcceptedTime?: string | null;
  contestTime?: string | null;
  theBest?: boolean;
}

export interface ReplayRow {
  id: number;
  name: string;
  participant: ReplayParticipant;
  rank: number;
  points: number;
  penalties: number;
  problems: ReplayProblem[];
}

export interface ReplayFrame {
  at: number;
  rows: ReplayRow[];
}

export interface ContestReplay {
  available: boolean;
  reason: string | null;
  durationSeconds: number;
  participantsCount: number;
  source: 'history' | 'submissions';
  problems: string[];
  frames: ReplayFrame[];
}
