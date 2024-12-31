import { Verdicts } from '@problems/constants';

export interface AttemptsFilter {
  username: string;
  problemId: number;
  verdict: Verdicts;
}
