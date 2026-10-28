import { problemsRepository } from '../data-access';
import type { ProblemsRepository } from '../domain/contracts/problems.repository';

export const submitProblemSolution = (...args: Parameters<ProblemsRepository['submitSolution']>) =>
  problemsRepository.submitSolution(...args);

export const runProblemCustomTest = (...args: Parameters<ProblemsRepository['runCustomTest']>) =>
  problemsRepository.runCustomTest(...args);

export const checkProblemSampleTests = (
  ...args: Parameters<ProblemsRepository['checkSampleTests']>
) => problemsRepository.checkSampleTests(...args);

export const getProblemAnswerForInput = (
  ...args: Parameters<ProblemsRepository['answerForInput']>
) => problemsRepository.answerForInput(...args);

export const removeFavoriteProblem = (...args: Parameters<ProblemsRepository['removeFavorite']>) =>
  problemsRepository.removeFavorite(...args);

export const addFavoriteProblem = (...args: Parameters<ProblemsRepository['addFavorite']>) =>
  problemsRepository.addFavorite(...args);

export const likeProblem = (...args: Parameters<ProblemsRepository['likeProblem']>) =>
  problemsRepository.likeProblem(...args);

export const dislikeProblem = (...args: Parameters<ProblemsRepository['dislikeProblem']>) =>
  problemsRepository.dislikeProblem(...args);

export const rerunProblemAttempt = (...args: Parameters<ProblemsRepository['rerunAttempt']>) =>
  problemsRepository.rerunAttempt(...args);
