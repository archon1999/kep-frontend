export interface ContestQuestion {
  problemSymbol: string;
  problemTitle: string;
  username: string;
  ratingTitle: string;
  question: string;
  answer: string | null;
  created: string;
  status: number;
  statusTitle: string;
}
