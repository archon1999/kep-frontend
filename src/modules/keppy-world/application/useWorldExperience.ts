import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { WorldRealtime, worldRepository } from '../data-access';
import type { WorldProfile, WorldRun } from '../domain';
import { useWorldBootstrap } from './queries';
import { availablePlayerQuests, latestCommunityWorld } from './world-state';

export function worldErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = error.data;
    if (
      typeof data === 'object' &&
      data !== null &&
      'code' in data &&
      typeof data.code === 'string'
    )
      return data.code;
  }
  return 'requestFailed';
}

export const useWorldExperience = (username?: string) => {
  const { t } = useTranslation();
  const bootstrap = useWorldBootstrap(username);
  const transport = useMemo(() => new WorldRealtime(username), [username]);
  const connection = useSyncExternalStore(
    transport.subscribe,
    transport.getSnapshot,
    transport.getSnapshot,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finishedRun, setFinishedRun] = useState<WorldRun | null>(null);
  const busy = useRef(false);
  const actionGeneration = useRef(0);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    busy.current = false;
    setPending(false);
    setError(null);
    return () => {
      mounted.current = false;
      actionGeneration.current += 1;
      transport.suspend();
    };
  }, [transport]);
  useEffect(() => setFinishedRun(null), [username]);

  const perform = useCallback(async <T>(action: () => Promise<T>) => {
    if (busy.current || !mounted.current) return;
    const generation = actionGeneration.current;
    busy.current = true;
    setPending(true);
    setError(null);
    try {
      const result = await action();
      if (mounted.current && generation === actionGeneration.current) return result;
    } catch (err) {
      if (mounted.current && generation === actionGeneration.current) setError(worldErrorCode(err));
      return undefined;
    } finally {
      if (mounted.current && generation === actionGeneration.current) {
        busy.current = false;
        setPending(false);
      }
    }
  }, []);
  const connect = () =>
    perform(async () => {
      await transport.connect(worldRepository.ticket());
      return true;
    });
  const saveProfile = (selection: Pick<WorldProfile, 'mascotId' | 'equippedCosmetic'>) =>
    perform(async () => {
      const player = await worldRepository.profile(selection);
      await bootstrap.mutate((current) => current && { ...current, player }, { revalidate: false });
      if (connection.status === 'connected')
        transport.applyTicket((await worldRepository.ticket()).ticket);
      return player;
    });
  const claim = (id: string) =>
    perform(async () => {
      const run = await worldRepository.claim(id);
      setFinishedRun(null);
      await bootstrap.mutate(
        (current) =>
          current && {
            ...current,
            activeRun: run,
            quests: current.quests.filter((quest) => quest.id !== id),
          },
        { revalidate: false },
      );
      transport.refresh();
      return run;
    });
  const submit = useCallback(
    (answer: unknown) =>
      perform(async () => {
        const run = bootstrap.data?.activeRun;
        if (!run) return;
        const result = await worldRepository.submit(run.id, answer);
        if (['completed', 'expired', 'abandoned'].includes(result.run.status))
          setFinishedRun(result.run);
        await bootstrap.mutate(
          (current) =>
            current && {
              ...current,
              player: result.player,
              world: result.world,
              activeRun: result.run,
            },
          { revalidate: false },
        );
        if (result.correct) {
          transport.refresh();
          transport.applyTicket((await worldRepository.ticket()).ticket);
          const refreshed = await worldRepository.bootstrap();
          await bootstrap.mutate(
            (current) =>
              current && {
                ...current,
                cosmetics: refreshed.cosmetics,
                completedDailyTaskIds: refreshed.completedDailyTaskIds,
              },
            { revalidate: false },
          );
        }
        return result;
      }),
    [bootstrap.data?.activeRun?.id, bootstrap.mutate, perform, transport],
  );
  const abandon = () =>
    perform(async () => {
      const run = finishedRun ?? bootstrap.data?.activeRun;
      if (!run) return true;
      if (!['completed', 'abandoned', 'expired'].includes(run.status))
        await worldRepository.abandon(run.id);
      await bootstrap.mutate((current) => current && { ...current, activeRun: null }, {
        revalidate: false,
      });
      setFinishedRun(null);
      transport.refresh();
      return true;
    });
  const quests = useMemo(
    () =>
      availablePlayerQuests(
        connection.quests ?? bootstrap.data?.quests ?? [],
        bootstrap.data?.completedDailyTaskIds ?? [],
        bootstrap.data?.activeRun?.questId,
        bootstrap.data?.player.completedByKind,
        bootstrap.data?.player.kindDailyLimit,
      ).map((quest) => ({
        ...quest,
        title: t(`keppyWorld.kinds.${quest.kind}`, { defaultValue: quest.title }),
      })),
    [
      connection.quests,
      bootstrap.data?.quests,
      bootstrap.data?.completedDailyTaskIds,
      bootstrap.data?.activeRun?.questId,
      bootstrap.data?.player.completedByKind,
      bootstrap.data?.player.kindDailyLimit,
      t,
    ],
  );
  return {
    ...bootstrap,
    connection,
    pending,
    actionError: error,
    connect,
    saveProfile,
    claim,
    submit,
    abandon,
    run: finishedRun ?? bootstrap.data?.activeRun,
    world: latestCommunityWorld(bootstrap.data?.world, connection.world),
    quests,
    move: transport.move,
    emote: transport.emote,
    chat: transport.chat,
    leave: transport.disconnect,
    clearError: () => setError(null),
  };
};
