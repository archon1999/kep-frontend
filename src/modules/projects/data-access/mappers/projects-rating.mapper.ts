import type {
  ProjectsRating,
  ProjectsRatingPage,
} from '../../domain/entities/projects-rating.types';

export interface ProjectsRatingDto {
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

export interface ProjectsRatingPageDto {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: ProjectsRatingDto[];
}

export const mapProjectsRating = (dto: ProjectsRatingDto): ProjectsRating => ({
  username: dto.username,
  firstName: dto.firstName,
  lastName: dto.lastName,
  avatar: dto.avatar,
  rank: dto.rank,
  rating: dto.rating,
  completedProjects: dto.completedProjects,
  ratedProjects: dto.ratedProjects,
  passedTasks: dto.passedTasks,
});

export const mapProjectsRatingPage = (dto: ProjectsRatingPageDto): ProjectsRatingPage => ({
  page: dto.page,
  pageSize: dto.pageSize,
  count: dto.count,
  total: dto.total,
  pagesCount: dto.pagesCount,
  data: dto.data.map(mapProjectsRating),
});
