export type GameProgress = {
  completed: number[];
  stars: Record<number, number>;
  drafts: Record<number, string>;
};

export interface GameProgressRepository {
  load(player: string): GameProgress;
  save(player: string, progress: GameProgress): void;
}
