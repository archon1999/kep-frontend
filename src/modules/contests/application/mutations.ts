import { moderateContestant } from 'modules/admin/application/integrity';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { contestsRepository } from '../data-access';
import type { ContestsRepository } from '../domain/contracts/contests.repository';

export const submitContestSolution = (...args: Parameters<ContestsRepository['submitSolution']>) =>
  contestsRepository.submitSolution(...args);

export const submitContestQuestion = (...args: Parameters<ContestsRepository['submitQuestion']>) =>
  contestsRepository.submitQuestion(...args);

export const registerForContest = (...args: Parameters<ContestsRepository['register']>) =>
  contestsRepository.register(...args);

export const cancelContestRegistration = (
  ...args: Parameters<ContestsRepository['cancelRegistration']>
) => contestsRepository.cancelRegistration(...args);

export const startVirtualContest = (
  ...args: Parameters<ContestsRepository['startVirtualContest']>
) => contestsRepository.startVirtualContest(...args);

const finalistViews = ['contest-standings', 'contest-finalists'];
const exclusionViews = [
  ...finalistViews,
  'contest',
  'contest-problems',
  'contest-statistics',
  'contest-statistics-summary',
  'contest-contestants',
  'contest-top3',
  'contest-replay',
];

function useRefreshContestViews(contestId: number, views: string[]) {
  const { mutate } = useSWRConfig();
  return () =>
    mutate((key) => Array.isArray(key) && views.includes(key[0]) && Number(key[1]) === contestId);
}

export function useContestFinalistMutation(contestId: number, contestantId: number) {
  const refresh = useRefreshContestViews(contestId, finalistViews);
  return useSWRMutation(
    ['contest-finalist-selection', contestId, contestantId],
    async (_key, { arg }: { arg: boolean }) => {
      await contestsRepository.selectFinalist(contestId, contestantId, arg);
      await refresh();
    },
  );
}

export function useContestExclusionMutation(contestId: number, contestantId: number) {
  const refresh = useRefreshContestViews(contestId, exclusionViews);
  return useSWRMutation(
    ['contest-exclusion', contestId, contestantId],
    async (_key, { arg }: { arg: { action: 'exclude' | 'reinstate'; reason: string } }) => {
      await moderateContestant(contestId, contestantId, arg);
      await refresh();
    },
  );
}
