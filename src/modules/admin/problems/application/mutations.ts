import { problemsAdminClient } from '../data-access/problemsAdminClient';

export const updateAdminProblem = (...args: Parameters<(typeof problemsAdminClient)['update']>) =>
  problemsAdminClient.update(...args);

export const createAdminProblem = (...args: Parameters<(typeof problemsAdminClient)['create']>) =>
  problemsAdminClient.create(...args);

export const removeAdminProblem = (...args: Parameters<(typeof problemsAdminClient)['remove']>) =>
  problemsAdminClient.remove(...args);

export const batchAdminProblem = (...args: Parameters<(typeof problemsAdminClient)['batch']>) =>
  problemsAdminClient.batch(...args);
