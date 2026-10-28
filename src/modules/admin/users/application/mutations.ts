import { usersAdminClient } from '../data-access/usersAdminClient';

export const updateAdminUser = (...args: Parameters<(typeof usersAdminClient)['update']>) =>
  usersAdminClient.update(...args);

export const createAdminUser = (...args: Parameters<(typeof usersAdminClient)['create']>) =>
  usersAdminClient.create(...args);

export const removeAdminUser = (...args: Parameters<(typeof usersAdminClient)['remove']>) =>
  usersAdminClient.remove(...args);

export const changePasswordAdminUser = (
  ...args: Parameters<(typeof usersAdminClient)['changePassword']>
) => usersAdminClient.changePassword(...args);

export const batchAdminUser = (...args: Parameters<(typeof usersAdminClient)['batch']>) =>
  usersAdminClient.batch(...args);
