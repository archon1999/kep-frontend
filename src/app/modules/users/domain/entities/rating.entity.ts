export interface UserProblemsRating {
  user: any;
  rating: number;
  solved: number;
  beginner: number;
  basic: number;
  normal: number;
  medium: number;
  advanced: number;
  hard: number;
  extremal: number;
}

export interface UserContestsRating {
  username: string;
  rating: number;
  ratingTitle: string;
  contestantsCount: number;
  maxRating: number;
  maxRatingTitle: string;
}

export interface UserChallengesRating {
  username: string;
  rankTitle: string;
  rating: number;
  wins: number;
  draws: number;
  losses: number;
} 