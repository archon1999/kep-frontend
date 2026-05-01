import useSWR from 'swr';
import { HttpProjectAttemptsRepository } from '../data-access/repository/http.project-attempts.repository.ts';
import { HttpProjectsRepository } from '../data-access/repository/http.projects.repository.ts';
import { Project, ProjectAttempt } from '../domain/entities/project.entity';

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
  params?: { page?: number; pageSize?: number; username?: string; hackathonId?: number },
) =>
  useSWR(
    projectId || params?.hackathonId || params?.username
      ? ['project-attempts', projectId, params?.page, params?.pageSize, params?.username, params?.hackathonId]
      : null,
    () =>
      attemptsRepository.list({
        projectId,
        page: params?.page,
        pageSize: params?.pageSize,
        username: params?.username,
        hackathonId: params?.hackathonId,
      }),
    {
      suspense: false,
      refreshInterval: 5000,
    },
  );

export const useUserProjectAttempts = (username?: string) =>
  useSWR<ProjectAttempt[]>(
    username ? ['project-attempts-all', username] : null,
    () =>
      attemptsRepository.listAll({
        username,
        pageSize: 50,
      }),
    {
      suspense: false,
      revalidateOnFocus: false,
      refreshInterval: 15000,
    },
  );

export const projectsQueries = {
  projectsRepository,
  attemptsRepository,
};
