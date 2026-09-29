export type QuestKind =
  | 'bug-hunt'
  | 'logic-circuit'
  | 'code-islands'
  | 'memory-grid'
  | 'math-compare'
  | 'quick-math'
  | 'number-sequence'
  | 'number-hunt'
  | 'memory-matrix'
  | 'cargo'
  | 'daily-task';
export type WorldProfile = {
  id: number;
  username: string;
  mascotId: string;
  equippedCosmetic: string;
  xp: number;
  level: number;
  levelXp: number;
  nextLevelXp: number;
  completedToday: number;
  dailyLimit: number;
  completedByKind: Partial<Record<QuestKind, number>>;
  kindDailyLimit: number;
};
export type WorldMilestone = { level: number; requiredXp: number; zone: string };
export type CommunityWorld = {
  totalXp: number;
  stage: number;
  nextThreshold: number | null;
  zones: string[];
  level: number;
  maxLevel: number;
  levelStartXp: number;
  levelXp: number;
  nextLevelXp: number | null;
  progress: number;
  milestones: WorldMilestone[];
};
export type WorldQuest = {
  id: string;
  kind: QuestKind;
  title: string;
  difficulty: number;
  xp: number;
  position: { x: number; z: number };
  zone: string;
  dailyTaskId?: number;
};
type ChallengeBase = { prompt: string };
export type WorldBrainChallenge = ChallengeBase & {
  difficulty: number;
  round: number;
  totalRounds: number;
  roundId: string;
  deadlineAt: string | null;
} & (
    | { kind: 'math-compare'; left: string; right: string }
    | { kind: 'quick-math'; expression: string }
    | { kind: 'number-sequence'; sequence: number[] }
    | { kind: 'number-hunt'; rows: number; columns: number; cells: number[]; next: number }
    | {
        kind: 'memory-matrix';
        rows: number;
        columns: number;
        phase: 'watch' | 'recall';
        highlighted: number[];
        selected: number[];
        targetCount: number;
        revealUntil: string | null;
      }
  );
export type WorldChallenge = ChallengeBase &
  (
    | WorldBrainChallenge
    | { kind: 'bug-hunt'; language: string; code: string[]; requiresFix: boolean }
    | {
        kind: 'logic-circuit';
        inputs: string[];
        rows: { inputs: number[]; output: number }[];
        maxGates: number;
      }
    | { kind: 'code-islands'; grid: string[]; startDirection: string; maxCommands: number }
    | {
        kind: 'memory-grid';
        rows: number;
        columns: number;
        length: number;
        phase: 'watch' | 'recall';
        reveal: { index: number; cell: number } | null;
        nextRevealAt: string | null;
        entered: number;
      }
    | {
        kind: 'cargo';
        items: { id: string; label: string; weight: number; value: number }[];
        capacity: number;
        targetValue: number;
      }
    | { kind: 'daily-task'; dailyTaskId: number; href: string }
  );
export type WorldRun = {
  id: string;
  questId: string;
  kind: QuestKind;
  title: string;
  difficulty: number;
  xp: number;
  status: string;
  expiresAt: string;
  challenge: WorldChallenge;
};
export type WorldCosmetic = { id: string; level: number; unlocked: boolean };
export type WorldBootstrap = {
  player: WorldProfile;
  world: CommunityWorld;
  quests: WorldQuest[];
  activeRun: WorldRun | null;
  cosmetics: WorldCosmetic[];
  completedDailyTaskIds: number[];
};
export type WorldResult = {
  correct: boolean;
  feedback: 'progress' | 'incorrect' | 'completed';
  run: WorldRun;
  player: WorldProfile;
  world: CommunityWorld;
};
export type WorldTicket = { ticket: string; serverUrl: string; roomName: string };
export type WorldRanking = {
  rank: number;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  achievedAt: string | null;
  completedTasks: number;
  lastCompletedAt: string | null;
  isCurrentUser: boolean;
};
export type MoveIntent = { x: number; z: number; jump: boolean; seq: number };
export type WorldPlayer = {
  sessionId: string;
  userId: string;
  username: string;
  mascotId: string;
  equippedCosmetic: string;
  level: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  moving: boolean;
  falling?: boolean;
  emote?: string;
  lastSeq: number;
};
export type WorldConnection = {
  chatMessages?: WorldChatMessage[];
  chatError?: { code: string; clientId: string | null } | null;
  status: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'error';
  sessionId: string | null;
  players: WorldPlayer[];
  world: CommunityWorld | null;
  quests: WorldQuest[] | null;
  error: string | null;
};

export type WorldChatMessage = {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  clientId: string;
};
