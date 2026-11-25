import type {
  ContestOption,
  ContestReview,
  ModerationCommand,
  PairReview,
  ReviewDecision,
  ReviewRun,
} from '../entities/integrity.types';

export interface IntegrityRepository {
  contests(search: string): Promise<ContestOption[]>;
  review(contest: number, run?: number): Promise<ContestReview>;
  start(contest: number): Promise<ReviewRun>;
  pair(contest: number, pair: number, item: number): Promise<PairReview>;
  decide(
    contest: number,
    pair: number,
    decision: ReviewDecision,
    note: string,
    reviewedAt: string | null,
  ): Promise<void>;
  moderate(contest: number, entry: number, command: ModerationCommand): Promise<void>;
}
