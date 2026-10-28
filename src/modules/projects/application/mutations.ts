import useSWRMutation from 'swr/mutation';
import { attemptsRepository } from '../data-access';
import type { ProjectAttemptsRepository } from '../domain/contracts/project-attempts.repository';

export const rerunProjectAttempt = (...args: Parameters<ProjectAttemptsRepository['rerun']>) =>
  attemptsRepository.rerun(...args);

export const submitProjectAttempt = (
  ...args: Parameters<ProjectAttemptsRepository['submitAttempt']>
) => attemptsRepository.submitAttempt(...args);

export const useSubmitProjectAttempt = () =>
  useSWRMutation(
    'project-attempt-submit',
    (_key, { arg }: { arg: Parameters<ProjectAttemptsRepository['submitAttempt']>[0] }) =>
      submitProjectAttempt(arg),
  );
