export interface ProjectsRating {
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  rank: number | null;
  rating: number;
  completedProjects: number;
  ratedProjects: number;
  passedTasks: number;
}

export interface ProjectsRatingPage {
  page: number;
  pageSize: number;
  total: number;
  count: number;
  pagesCount: number;
  data: ProjectsRating[];
}

export interface ProjectsRatingParams {
  page: number;
  pageSize: number;
  search?: string;
}
