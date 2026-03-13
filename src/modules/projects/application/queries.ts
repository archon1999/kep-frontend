import useSWR from 'swr';
import { HttpProjectAttemptsRepository } from '../data-access/repository/http.project-attempts.repository.ts';
import { HttpProjectsRepository } from '../data-access/repository/http.projects.repository.ts';
import { Project } from '../domain/entities/project.entity';

const projectsRepository = new HttpProjectsRepository();
const attemptsRepository = new HttpProjectAttemptsRepository();

export const useProjectsList = () =>
  useSWR<Project[]>(['projects-list'], () => projectsRepository.list(), {
    suspense: false,
  });

export const useProjectDetails = (slug?: string) =>
  useSWR<Project>(slug ? ['project-detail', slug] : null, () => projectsRepository.getBySlug(slug!), {
    suspense: false,
  });

export const useProjectAttempts = (
  projectId?: number,
  params?: { page?: number; username?: string; hackathonId?: number },
) =>
  useSWR(
    projectId || params?.hackathonId
      ? ['project-attempts', projectId, params?.page, params?.username, params?.hackathonId]
      : null,
    () =>
      attemptsRepository.list({
        projectId,
        page: params?.page,
        username: params?.username,
        hackathonId: params?.hackathonId,
      }),
    {
      suspense: false,
      refreshInterval: 5000,
    },
  );

export const projectsQueries = {
  projectsRepository,
  attemptsRepository,
};
