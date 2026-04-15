export type ArenaHighlightKind = 'achievement' | 'fact' | 'statistic';

export type ArenaHighlightTone = 'success' | 'info' | 'warning';

export interface ArenaHighlight {
  key: string;
  kind: ArenaHighlightKind;
  tone: ArenaHighlightTone;
  title: string;
  message: string;
}
