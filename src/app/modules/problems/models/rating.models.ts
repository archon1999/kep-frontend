import { User } from '@users/users.models';

export interface CurrentProblemsRating {
  username: string;
  solved: number;
  ratingTitle: string;
}

export interface ProblemsRating {
  rowIndex: number;
  hard: number;
  extremal: number;
  user: User;
  solved: number;
  rating: number;
  beginner: number;
  basic: number;
  normal: number;
  medium: number;
  advanced: number;
}
