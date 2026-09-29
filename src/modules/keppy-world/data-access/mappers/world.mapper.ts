import type {
  CommunityWorld,
  WorldBootstrap,
  WorldChallenge,
  WorldCosmetic,
  WorldLeaderboard,
  WorldProfile,
  WorldQuest,
  WorldRanking,
  WorldRun,
} from '../../domain';
import { isPlayableWorldChallenge } from '../../domain/utils/challenge.ts';

// Keep HTTP serialization decisions out of the application and scene.
type JsonObject = Record<string, any>;
export const mapProfile = (data: JsonObject): WorldProfile => ({
  id: Number(data.id),
  username: data.username,
  mascotId: data.mascotId,
  equippedCosmetic: data.equippedCosmetic || 'none',
  xp: Number(data.xp),
  level: Number(data.level),
  levelXp: Number(data.levelXp),
  nextLevelXp: Number(data.nextLevelXp),
  completedToday: Number(data.completedToday),
  pointCount: Number(data.pointCount ?? data.dailyLimit ?? 0),
});
export const mapWorld = (data: JsonObject): CommunityWorld => {
  const defaultXp = [0, 1000, 5000, 15000, 35000, 70000, 125000, 200000, 320000, 500000];
  const defaultZones = [
    'plaza',
    'harbor',
    'bridge',
    'island',
    'garden',
    'academy',
    'summit',
    'workshop-island',
    'crystal-island',
    'citadel',
  ];
  const milestones = (
    data.milestones ??
    defaultXp.map((requiredXp, index) => ({
      level: index + 1,
      requiredXp,
      zone: defaultZones[index],
    }))
  ).map((item: JsonObject) => ({
    level: Number(item.level),
    requiredXp: Number(item.requiredXp),
    zone: String(item.zone),
  }));
  const totalXp = Number(data.totalXp);
  const stage = Number(data.stage);
  const nextThreshold = data.nextThreshold == null ? null : Number(data.nextThreshold);
  const levelStartXp = Number(data.levelStartXp ?? milestones[stage]?.requiredXp ?? 0);
  const nextLevelXp =
    nextThreshold === null ? null : Number(data.nextLevelXp ?? nextThreshold - levelStartXp);
  const levelXp = Math.max(0, Number(data.levelXp ?? totalXp - levelStartXp));
  return {
    totalXp,
    stage,
    nextThreshold,
    zones: [...data.zones],
    level: Number(data.level ?? stage + 1),
    maxLevel: Number(data.maxLevel ?? milestones.length),
    levelStartXp,
    levelXp,
    nextLevelXp,
    progress: Math.max(
      0,
      Math.min(1, Number(data.progress ?? (nextLevelXp ? levelXp / nextLevelXp : 1))),
    ),
    milestones,
  };
};
export const mapQuest = (data: JsonObject): WorldQuest => ({
  id: String(data.id),
  stationId: data.stationId ? String(data.stationId) : undefined,
  kind: data.kind,
  title: data.title,
  difficulty: Number(data.difficulty),
  xp: Number(data.xp),
  position: { x: Number(data.position.x), z: Number(data.position.z) },
  zone: data.zone,
  dailyTaskId: data.dailyTaskId == null ? undefined : Number(data.dailyTaskId),
});
const decodeChallenge = (data: JsonObject): unknown => {
  const round = {
    prompt: String(data.prompt ?? ''),
    difficulty: Number(data.difficulty),
    round: Number(data.round),
    totalRounds: Number(data.totalRounds),
    roundId: data.roundId,
    deadlineAt: data.deadlineAt ?? null,
  };
  switch (data.kind) {
    case 'math-compare':
      return { ...round, kind: data.kind, left: data.left, right: data.right };
    case 'quick-math':
      return { ...round, kind: data.kind, expression: data.expression };
    case 'number-sequence':
      return {
        ...round,
        kind: data.kind,
        sequence: Array.isArray(data.sequence) ? data.sequence.map(Number) : null,
      };
    case 'number-hunt':
      return {
        ...round,
        kind: data.kind,
        rows: Number(data.rows),
        columns: Number(data.columns),
        cells: Array.isArray(data.cells) ? data.cells.map(Number) : null,
        next: Number(data.next),
      };
    case 'memory-matrix':
      return {
        ...round,
        kind: data.kind,
        rows: Number(data.rows),
        columns: Number(data.columns),
        phase: data.phase,
        highlighted:
          data.phase === 'watch'
            ? Array.isArray(data.highlighted)
              ? data.highlighted.map(Number)
              : null
            : [],
        selected: Array.isArray(data.selected) ? data.selected.map(Number) : [],
        targetCount: Number(data.targetCount),
        revealUntil: data.revealUntil ?? null,
      };
    default:
      return { ...data };
  }
};
export const mapChallenge = (data: JsonObject | null | undefined): WorldChallenge => {
  const challenge = data && decodeChallenge(data);
  if (isPlayableWorldChallenge(challenge)) return challenge;
  return {
    kind: 'unsupported',
    originalKind: typeof data?.kind === 'string' ? data.kind : '',
    prompt: typeof data?.prompt === 'string' ? data.prompt : '',
  };
};
export const mapRun = (data: JsonObject): WorldRun => ({
  id: String(data.id),
  questId: String(data.questId),
  stationId: data.stationId ? String(data.stationId) : undefined,
  rewardEligible: data.rewardEligible !== false,
  rewardAvailableAt: data.rewardAvailableAt ?? null,
  kind: data.kind,
  title: data.title,
  difficulty: Number(data.difficulty),
  xp: Number(data.xp),
  status: data.status,
  expiresAt: data.expiresAt,
  challenge: mapChallenge(data.challenge),
});
export const mapPointCooldowns = (data: JsonObject): Record<string, string> =>
  Object.fromEntries(
    Object.entries(data.pointCooldowns ?? {}).filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === 'string' && Number.isFinite(Date.parse(entry[1])),
    ),
  );
export const mapServerTimeOffset = (data: JsonObject): number =>
  typeof data.serverTime === 'string' && Number.isFinite(Date.parse(data.serverTime))
    ? Date.parse(data.serverTime) - Date.now()
    : 0;
export const mapBootstrap = (data: JsonObject): WorldBootstrap => ({
  pointCooldowns: mapPointCooldowns(data),
  serverTimeOffsetMs: mapServerTimeOffset(data),
  player: mapProfile(data.player),
  world: mapWorld(data.world),
  quests: data.quests.map(mapQuest),
  activeRun: data.activeRun ? mapRun(data.activeRun) : null,
  cosmetics: data.cosmetics.map(
    (item: JsonObject): WorldCosmetic => ({
      id: item.id,
      level: Number(item.level),
      unlocked: Boolean(item.unlocked),
    }),
  ),
  completedDailyTaskIds: (data.completedDailyTaskIds ?? []).map(Number),
});
export const mapRanking = (data: JsonObject): WorldRanking => ({
  rank: Number(data.rank),
  username: data.username,
  avatar: data.avatar || undefined,
  xp: Number(data.xp),
  level: Number(data.level),
  achievedAt: data.achievedAt ?? null,
  completedTasks: Number(data.completedTasks ?? 0),
  lastCompletedAt: data.lastCompletedAt ?? null,
  isCurrentUser: Boolean(data.isCurrentUser),
});
export const mapLeaderboard = (data: JsonObject): WorldLeaderboard => ({
  players: (data.top ?? []).map(mapRanking),
  currentUser: data.currentUser ? mapRanking(data.currentUser) : null,
  totalPlayers: Number(data.totalPlayers ?? data.top?.length ?? 0),
  page: Number(data.page ?? 1),
  pageSize: Number(data.pageSize ?? 30),
  totalPages: Number(data.totalPages ?? 1),
});
