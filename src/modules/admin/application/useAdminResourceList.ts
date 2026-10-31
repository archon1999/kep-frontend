import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { AdminActionPreview } from '../domain';
import { previewAdminAction } from './mutations';
import { useAdminList } from './queries';

export function useAdminResourceList(resourceKey: string) {
  const [params, setParams] = useSearchParams();
  const filters = Object.fromEntries(
    Array.from(params.entries())
      .filter(([key]) => key.startsWith('filter.'))
      .map(([key, value]) => [key.slice(7), value]),
  );
  const query = {
    queue: params.get('queue') || undefined,
    search: params.get('search') || '',
    page: Math.max(1, Number(params.get('page')) || 1),
    pageSize: Number(params.get('pageSize')) || 20,
    ordering: params.get('ordering') || '',
    filters,
  };
  const result = useAdminList(resourceKey, query);
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<AdminActionPreview | null>(null);
  const [actionError, setActionError] = useState<unknown>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const update = (name: string, value: string) => {
    setSelected([]);
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(name, value);
        else next.delete(name);
        if (name !== 'page') next.delete('page');
        return next;
      },
      { replace: name === 'search' },
    );
  };
  const reset = () => {
    setSelected([]);
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      [...next.keys()]
        .filter((key) => key.startsWith('filter.') || ['search', 'queue', 'page'].includes(key))
        .forEach((key) => next.delete(key));
      return next;
    });
  };
  const prepare = async (action: string, ids = selected) => {
    if (!ids.length) return;
    setActionBusy(true);
    setActionError(null);
    try {
      setPreview(await previewAdminAction(resourceKey, action, ids));
    } catch (failure) {
      setActionError(failure);
    } finally {
      setActionBusy(false);
    }
  };
  return {
    ...result,
    query,
    update,
    reset,
    selected,
    setSelected,
    preview,
    setPreview,
    actionError,
    actionBusy,
    prepare,
  };
}
