import type {
  ProjectsRating,
  ProjectsRatingPage,
  ProjectsRatingParams,
} from '../entities/projects-rating.types';

export interface ProjectsRatingRepository {
  list(params: ProjectsRatingParams): Promise<ProjectsRatingPage>;
  getUserRating(username: string): Promise<ProjectsRating>;
}
