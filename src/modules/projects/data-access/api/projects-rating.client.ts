import { instance } from 'shared/api/http/axiosInstance';
import type { ProjectsRatingParams } from '../../domain/entities/projects-rating.types';
import type { ProjectsRatingDto, ProjectsRatingPageDto } from '../mappers/projects-rating.mapper';

export const projectsRatingClient = {
  list: async ({ page, pageSize, search }: ProjectsRatingParams) => {
    const response = await instance.get<ProjectsRatingPageDto>('/api/projects-rating/', {
      params: { page, page_size: pageSize, search: search?.trim() || undefined },
    });
    return response.data;
  },
  getUserRating: async (username: string) => {
    const response = await instance.get<ProjectsRatingDto>(
      `/api/projects-rating/${encodeURIComponent(username)}/`,
    );
    return response.data;
  },
};
