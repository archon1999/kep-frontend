import type { ProjectsRatingParams } from '../domain/entities/projects-rating.types';

export const projectsRatingKeys = {
  list: (params: ProjectsRatingParams) => ['projects-rating', params] as const,
  user: (username: string) => ['projects-rating-user', username] as const,
};
