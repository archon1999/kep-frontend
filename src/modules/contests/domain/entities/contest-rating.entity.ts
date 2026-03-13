export interface ContestRatingRow {
  rowIndex: number;
  username: string;
  ratingTitle: string;
  rating?: number;
  maxRating?: number;
  maxRatingTitle?: string;
  contestantsCount: number;
}
