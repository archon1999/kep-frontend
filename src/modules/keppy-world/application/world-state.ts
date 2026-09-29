import type { CommunityWorld, WorldQuest } from '../domain/entities/world.types.ts';

// Community XP only grows. A slower room poll must not roll back an HTTP reward.
export function latestCommunityWorld(
  http: CommunityWorld | undefined,
  realtime: CommunityWorld | null,
) {
  if (!http) return realtime ?? undefined;
  return realtime && realtime.totalXp >= http.totalXp ? realtime : http;
}

// Room broadcasts are shared. Cooldowns belong to the player and survive
// replacement quest UUIDs at the same permanent map point.
export function availablePlayerQuests(
  quests: WorldQuest[],
  completedDailyIds: number[],
  activeQuestId?: string,
  pointCooldowns: Record<string, string> = {},
  now = Date.now(),
) {
  return quests
    .filter(
      (quest) =>
        quest.id !== activeQuestId &&
        (quest.dailyTaskId === undefined || !completedDailyIds.includes(quest.dailyTaskId)),
    )
    .map((quest) => {
      const readyAt = quest.stationId ? pointCooldowns[quest.stationId] : undefined;
      const cooling = !!readyAt && Date.parse(readyAt) > now;
      return { ...quest, rewardEligible: !cooling, rewardAvailableAt: cooling ? readyAt : null };
    });
}

export function rewardCountdown(readyAt: string, now: number): string {
  const seconds = Math.max(0, Math.ceil((Date.parse(readyAt) - now) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return [hours, minutes, seconds % 60].map((part) => String(part).padStart(2, '0')).join(':');
}
