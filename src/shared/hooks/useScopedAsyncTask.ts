import { useCallback, useEffect, useRef, useState } from 'react';

type Task = { scope: string; timer?: ReturnType<typeof setTimeout> };
type TaskOptions<T> = {
  onSuccess?: (result: T) => void | Promise<void>;
  onError?: (error: unknown) => void;
  waitForResultMs?: number;
};

/** Own one in-flight operation; route/account changes invalidate its callbacks and timers. */
export const useScopedAsyncTask = (scope: string) => {
  const activeTask = useRef<Task | null>(null);
  const mountedScope = useRef<string | null>(null);
  const [pendingScope, setPendingScope] = useState<string | null>(null);

  useEffect(() => {
    mountedScope.current = scope;
    setPendingScope(null);
    return () => {
      mountedScope.current = null;
      clearTimeout(activeTask.current?.timer);
      activeTask.current = null;
    };
  }, [scope]);

  const isCurrent = useCallback(
    (task: Task) => mountedScope.current === scope && activeTask.current === task,
    [scope],
  );

  const complete = useCallback(() => {
    const task = activeTask.current;
    if (!task || task.scope !== scope || !isCurrent(task)) return false;
    clearTimeout(task.timer);
    activeTask.current = null;
    setPendingScope(null);
    return true;
  }, [isCurrent, scope]);

  const run = useCallback(
    async <T>(request: () => Promise<T>, options: TaskOptions<T> = {}) => {
      if (mountedScope.current !== scope || activeTask.current) return;
      const task: Task = { scope };
      activeTask.current = task;
      setPendingScope(scope);
      try {
        const result = await request();
        if (!isCurrent(task)) return;
        await options.onSuccess?.(result);
        if (!isCurrent(task)) return;
        if (options.waitForResultMs) {
          task.timer = setTimeout(() => {
            if (isCurrent(task)) complete();
          }, options.waitForResultMs);
        } else {
          complete();
        }
      } catch (error) {
        if (!isCurrent(task)) return;
        complete();
        options.onError?.(error);
      }
    },
    [complete, isCurrent, scope],
  );

  return { isPending: pendingScope === scope, run, complete };
};
