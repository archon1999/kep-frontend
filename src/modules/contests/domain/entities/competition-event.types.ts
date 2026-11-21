export type CompetitionEventId = 'junior2024' | 'revo2025' | 'revo2026';

export interface CompetitionStage {
  key: string;
  start: string;
  end: string;
  mode: 'online' | 'offline';
  problems: number;
  contestId?: number;
}

export interface CompetitionPrize {
  from: number;
  to: number;
  amount: number;
}

export interface CompetitionEvent {
  id: CompetitionEventId;
  path: string;
  title: string;
  year: number;
  fund: number;
  finalists: number;
  ruleKeys: string[];
  stages: CompetitionStage[];
  prizeGroups: Array<{ key: string; prizes: CompetitionPrize[] }>;
  results: Array<{ key: string; contestId: number; usernames: string[] }>;
  sources: Array<{ key: string; url: string }>;
  nominations?: Array<{ key: string; amount?: number; winner?: string }>;
  finalDay?: Array<{ time: string; key: string }>;
}
