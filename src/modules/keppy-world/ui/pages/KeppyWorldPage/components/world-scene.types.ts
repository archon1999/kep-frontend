export type WorldScenePlayer = {
  sessionId: string;
  userId: number | string;
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

export type WorldSceneQuest = {
  id: string;
  rewardEligible?: boolean;
  rewardAvailableAt?: string | null;
  kind: string;
  title: string;
  difficulty: number;
  xp: number;
  position: { x: number; z: number };
  zone: string;
};

export type MascotVisual = {
  idle: string;
  runLeft?: string;
  runRight?: string;
  back?: string;
  directionAtlas?: string;
  diagonalAtlas?: string;
  directionRects?: Partial<Record<'front' | 'back' | 'left' | 'right', AtlasRect>>;
  diagonalRects?: Partial<Record<'frontLeft' | 'frontRight' | 'backLeft' | 'backRight', AtlasRect>>;
  color?: string;
};

/** Normalized bounds measured from the image's top-left corner. */
export type AtlasRect = { x: number; y: number; width: number; height: number };

export type WorldMoveIntent = { x: number; z: number; jump: boolean; seq: number };

export type WorldSceneProps = {
  timeOffset?: number;
  players: WorldScenePlayer[];
  selfSessionId: string | null;
  quests: WorldSceneQuest[];
  kioskQuests?: WorldSceneQuest[];
  world: { totalXp: number; stage: number; nextThreshold: number | null; zones: string[] };
  onMove: (intent: WorldMoveIntent) => void;
  onQuestSelect: (id: string) => void;
  disabled?: boolean;
  mascotVisuals?: Record<string, MascotVisual>;
};
