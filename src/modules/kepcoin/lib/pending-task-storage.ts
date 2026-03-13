import { KEP_COIN_PENDING_TASK_STORAGE_KEY } from '../domain/constants';

export const getPendingTaskSlug = () => {
  try {
    return sessionStorage.getItem(KEP_COIN_PENDING_TASK_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const clearPendingTaskSlug = () => {
  try {
    sessionStorage.removeItem(KEP_COIN_PENDING_TASK_STORAGE_KEY);
  } catch {
    return;
  }
};

export const consumePendingTaskSlug = () => {
  const slug = getPendingTaskSlug();
  clearPendingTaskSlug();
  return slug;
};

export const setPendingTaskSlug = (slug: string) => {
  try {
    sessionStorage.setItem(KEP_COIN_PENDING_TASK_STORAGE_KEY, slug);
  } catch {
    return;
  }
};
