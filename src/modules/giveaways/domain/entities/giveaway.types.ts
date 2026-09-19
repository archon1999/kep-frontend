export type Participant = { id: number; username: string };
export type GiveawaySummary = {
  id: number;
  title: string;
  description: string;
  source: 'CUSTOM' | 'CONTEST' | 'ARENA';
  contest: number | null;
  arena: number | null;
  prizeType: 'TELEGRAM_PREMIUM' | 'MONEY' | 'KEPCOIN' | 'CUSTOM';
  prizeTitle: string;
  prizeImage: string | null;
  amount: number | null;
  premiumMonths: number | null;
  scheduledAt: string;
  drawnAt: string | null;
  delivered: boolean;
};
export type Giveaway = GiveawaySummary & {
  status: 'scheduled' | 'finished';
  participants: Participant[];
  winner: Participant | null;
  isCandidate: boolean;
  isEntered: boolean;
  animationSeen: boolean;
  shouldAnimate: boolean;
  animationDurationMs: number;
  serverOffsetMs: number;
};
