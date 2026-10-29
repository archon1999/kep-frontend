import type { Draft } from '../domain/entities/run.types.ts';

export const createDraftPersistence = (
  storage: Pick<Storage, 'setItem'>,
  key: string,
  onStatus: (saved: boolean) => void,
) => {
  let pending: Record<string, Draft> | null = null;
  let timer: ReturnType<typeof setTimeout>;
  const flush = (notify = true) => {
    clearTimeout(timer);
    if (!pending) return;
    try {
      storage.setItem(key, JSON.stringify(pending));
      pending = null;
      if (notify) onStatus(true);
    } catch {
      if (notify) onStatus(false);
    }
  };
  return {
    schedule: (drafts: Record<string, Draft>) => {
      pending = drafts;
      clearTimeout(timer);
      timer = setTimeout(flush, 400);
    },
    flush,
    dispose: () => flush(false),
  };
};
