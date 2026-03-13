import { ContestantTeam } from './contestant.entity';

export interface ContestRegistrant {
  username: string;
  rating?: number;
  ratingTitle?: string;
  team?: ContestantTeam | null;
  rowIndex?: number;
}
