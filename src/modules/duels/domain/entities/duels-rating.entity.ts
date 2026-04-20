export interface DuelsRatingUser {
  username: string;
  avatar?: string;
  contestsRating?: number;
  contestsRatingTitle?: string;
}

export interface DuelsRatingRow {
  rowIndex?: number;
  user: DuelsRatingUser;
  duels?: number;
  wins?: number;
  draws?: number;
  losses?: number;
}

export interface DuelsRatingPageTableRow {
  id: string;
  username: string;
  avatar?: string;
  contestsRating?: number;
  contestsRatingTitle?: string;
  duels: number;
  wins: number;
  draws: number;
  losses: number;
  rowIndex: number;
}
