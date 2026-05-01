export interface RatingValue {
  value?: number | string;
  title?: string;
}

export interface UsersListItem {
  id?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  country?: string;
  streak?: number;
  maxStreak?: number;
  kepcoin?: number;
  lastSeen?: string;
  skillsRating?: RatingValue;
  activityRating?: RatingValue;
  contestsRating?: RatingValue;
  challengesRating?: RatingValue;
}

export interface UserDetails {
  id?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  coverPhoto?: string;
  streak?: number;
  maxStreak?: number;
  kepcoin?: number;
  lastSeen?: string;
  isOnline?: boolean;
  country?: string;
  isFollowing?: boolean;
}

export interface UserRatingInfo {
  value?: number | string;
  rank?: number;
  percentile?: number;
  title?: string;
}

export interface UserRatings {
  skillsRating?: UserRatingInfo;
  activityRating?: UserRatingInfo;
  contestsRating?: UserRatingInfo;
  challengesRating?: UserRatingInfo;
}

export interface UsersListResponse {
  page: number;
  pageSize: number;
  pagesCount: number;
  total: number;
  count: number;
  data: UsersListItem[];
}

export interface UsersListRequest {
  page?: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
  country?: string;
  ageFrom?: number;
  ageTo?: number;
}

export interface UsersChartStatistics {
  total: number;
  series: number[];
}
