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
