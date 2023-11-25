export class HackAttempt {
  id: number;
  hackType: string;
  hackerUsername: string;
  hackerRatingTitle: string;
  defenderUsername: string;
  defenderRatingTitle: string;
  problemId: number;
  problemTitle: string;
  attemptId: number;
  verdict: number;
  verdictTitle: string;
  created: string;
}

export interface WSHackAttempt {
  id: number;
  verdict: number;
  verdictTitle: string;
  hackType: string;
}
