import type { ProjectsRatingRepository } from '../../domain/contracts/projects-rating.repository';
import type { ProjectsRatingParams } from '../../domain/entities/projects-rating.types';
import { projectsRatingClient } from '../api/projects-rating.client';
import { mapProjectsRating, mapProjectsRatingPage } from '../mappers/projects-rating.mapper';

export class HttpProjectsRatingRepository implements ProjectsRatingRepository {
  async list(params: ProjectsRatingParams) {
    return mapProjectsRatingPage(await projectsRatingClient.list(params));
  }

  async getUserRating(username: string) {
    return mapProjectsRating(await projectsRatingClient.getUserRating(username));
  }
}
