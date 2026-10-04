import { toBackendLanguage } from 'app/locales/locale';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import useSWR from 'swr';
import { HttpProjectAttemptsRepository } from '../data-access/repository/http.project-attempts.repository.ts';
import { HttpProjectsRepository } from '../data-access/repository/http.projects.repository.ts';
import { Project, ProjectAttempt, ProjectAttemptLog } from '../domain/entities/project.entity';

const projectsRepository = new HttpProjectsRepository();
const attemptsRepository = new HttpProjectAttemptsRepository();

const useProjectLanguage = () => {
  const { config } = useSettingsContext();
  return toBackendLanguage(config.locale);
};

export const useProjectsList = (username?: string) => {
  const language = useProjectLanguage();
  return useSWR<Project[]>(
    ['projects-list', username ?? null, language],
    () => projectsRepository.list(),
    {
      suspense: false,
    },
  );
};

export const useProjectDetails = (slug?: string, username?: string) => {
  const language = useProjectLanguage();
  return useSWR<Project>(
    slug ? ['project-detail', slug, username ?? null, language] : null,
    () => projectsRepository.getBySlug(slug!),
    {
      suspense: false,
      keepPreviousData: true,
    },
  );
};

export const useProjectAttempts = (
  projectId?: number,
  params?: { page?: number; pageSize?: number; username?: string; hackathonId?: number },
) => {
  const language = useProjectLanguage();
  return useSWR(
    projectId || params?.hackathonId || params?.username
      ? [
          'project-attempts',
          projectId,
          params?.page,
          params?.pageSize,
          params?.username,
          params?.hackathonId,
          language,
        ]
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
};

export const useUserProjectAttempts = (username?: string) => {
  const language = useProjectLanguage();
  return useSWR<ProjectAttempt[]>(
    username ? ['project-attempts-all', username, language] : null,
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
};

export const useProjectAttemptLog = (attemptId: number | null, username?: string) => {
  const language = useProjectLanguage();
  return useSWR<ProjectAttemptLog>(
    attemptId !== null && username ? ['project-attempt-log', attemptId, username, language] : null,
    () => attemptsRepository.getLog(attemptId!),
    {
      suspense: false,
      revalidateOnFocus: false,
    },
  );
};

export const projectsQueries = {
  projectsRepository,
  attemptsRepository,
};
