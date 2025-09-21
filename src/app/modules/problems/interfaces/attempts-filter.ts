import { Verdicts } from '@problems/constants';

export interface AttemptsFilter {
  username: string | null;
  problemId: number | null;
  verdict: Verdicts | null;
  lang: string | null;
}
