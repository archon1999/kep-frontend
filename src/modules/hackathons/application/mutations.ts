import useSWRMutation from 'swr/mutation';
import { projectsQueries } from 'modules/projects/application/queries';
import type { ProjectAttemptLog } from 'modules/projects/domain/entities/project.entity';
import { hackathonsRepository } from '../data-access';
import type { Hackathon } from '../domain';
import { hackathonsKeys } from './keys';

interface SubmitHackathonProjectPayload {
  slug: string;
  technology: string;
  file: File;
  hackathonId?: number;
  projectSymbol?: string;
}

export const useRegisterHackathon = () =>
  useSWRMutation<Hackathon, Error, readonly unknown[], string>(
    hackathonsKeys.mutation('register'),
    async (_, { arg }) => hackathonsRepository.register(arg),
  );

export const useUnregisterHackathon = () =>
  useSWRMutation<void, Error, readonly unknown[], string>(
    hackathonsKeys.mutation('unregister'),
    async (_, { arg }) => hackathonsRepository.unregister(arg),
  );

export const useHackathonAttemptLog = () =>
  useSWRMutation<ProjectAttemptLog, Error, readonly unknown[], number>(
    hackathonsKeys.mutation('attempt-log'),
    async (_, { arg }) => projectsQueries.attemptsRepository.getLog(arg),
  );

export const useRerunHackathonAttempt = () =>
  useSWRMutation<void, Error, readonly unknown[], number>(
    hackathonsKeys.mutation('attempt-rerun'),
    async (_, { arg }) => projectsQueries.attemptsRepository.rerun(arg),
  );

export const useSubmitHackathonProject = () =>
  useSWRMutation<void, Error, readonly unknown[], SubmitHackathonProjectPayload>(
    hackathonsKeys.mutation('project-submit'),
    async (_, { arg }) => projectsQueries.attemptsRepository.submitAttempt(arg),
  );
