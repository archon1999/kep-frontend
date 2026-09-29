import type { CommunityWorld, QuestKind, WorldQuest } from '../domain/entities/world.types.ts';

// Community XP only grows. A slower room poll must not roll back an HTTP reward.
export function latestCommunityWorld(
  http: CommunityWorld | undefined,
  realtime: CommunityWorld | null,
) {
  if (!http) return realtime ?? undefined;
  return realtime && realtime.totalXp >= http.totalXp ? realtime : http;
}

// Room broadcasts are shared; daily completion and the current claim are personal.
export function availablePlayerQuests(
  quests: WorldQuest[],
  completedDailyIds: number[],
  activeQuestId?: string,
  completedByKind: Partial<Record<QuestKind, number>> = {},
  kindDailyLimit = 3,
) {
  return quests.filter(
    (quest) =>
      quest.id !== activeQuestId &&
      (completedByKind[quest.kind] ?? 0) < kindDailyLimit &&
      (quest.dailyTaskId === undefined || !completedDailyIds.includes(quest.dailyTaskId)),
  );
}
