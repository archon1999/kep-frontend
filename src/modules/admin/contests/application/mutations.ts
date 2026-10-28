import { contestsAdminClient } from '../data-access/contestsAdminClient';

export const updateAdminContest = (...args: Parameters<(typeof contestsAdminClient)['update']>) =>
  contestsAdminClient.update(...args);

export const createAdminContest = (...args: Parameters<(typeof contestsAdminClient)['create']>) =>
  contestsAdminClient.create(...args);

export const removeAdminContest = (...args: Parameters<(typeof contestsAdminClient)['remove']>) =>
  contestsAdminClient.remove(...args);

export const batchAdminContest = (...args: Parameters<(typeof contestsAdminClient)['batch']>) =>
  contestsAdminClient.batch(...args);
