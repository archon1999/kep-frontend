export type ReviewDecision = 'pending' | 'cleared' | 'flagged';
export type SanctionAction = 'exclude' | 'reinstate' | 'block' | 'unblock';
export type RunStatus = 'queued' | 'running' | 'complete' | 'partial' | 'failed';
export interface ContestOption {
  id: number;
  title: string;
}
export interface ReviewPerson {
  id: number;
  name: string;
  excluded: boolean;
  score: number;
  pairs: number;
  problems: number;
  tokens: number;
  accounts: { id: number; name: string; active: boolean; protected: boolean }[];
}
export interface PairSummary {
  id: number;
  first: number;
  second: number;
  score: number;
  problems: number;
  tokens: number;
  decision: ReviewDecision;
}
export interface RunSummary {
  id: number;
  status: RunStatus;
  created: string;
}
export interface GroupCoverage {
  symbol: string;
  lang: string;
  parser?: string;
  total: number;
  compared?: number;
  duplicate?: number;
  noPeer?: number;
  unparsed?: number;
  empty?: number;
  issue?: string;
}
export interface ReviewRun extends RunSummary {
  progress: {
    done?: number;
    groups?: number;
    attempts?: number;
    current?: string;
    unmatched?: number;
    coverage?: GroupCoverage[];
  };
}
export interface Sanction {
  id: number;
  entry: number;
  contest: number;
  account: number | null;
  actor: string | null;
  reason: string;
  at: string;
  revoked: string | null;
  revokedBy: string | null;
  revokeReason: string;
}
export interface ContestReview {
  contest: ContestOption;
  runs: RunSummary[];
  run: ReviewRun | null;
  people: ReviewPerson[];
  pairs: PairSummary[];
  history: Sanction[];
}
export interface PairReview {
  id: number;
  first: number;
  second: number;
  decision: ReviewDecision;
  note: string;
  reviewer: string | null;
  reviewedAt: string | null;
  items: { symbol: string; lang: string; parser: string; score: number; tokens: number }[];
  index: number;
  blocks: [number, number, number, number][];
  sides: ({ id: number; code: string; verdict: string; at: string } | null)[];
}
export interface ModerationCommand {
  action: SanctionAction;
  reason: string;
  account?: number;
}
