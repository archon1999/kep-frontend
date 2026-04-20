const CHESS_PROGRESS_PREFIX = 'challenge-chess-progress:';

export interface StoredChessPuzzleProgress {
  playedLine: string[];
  pendingResult?: 'solved' | 'failed' | null;
  finalPlayedLine?: string[];
  forceFail?: boolean;
}

export const getChessPuzzleProgressKey = (challengeId: number, questionNumber: number) =>
  `${CHESS_PROGRESS_PREFIX}${challengeId}:${questionNumber}`;

export const readChessPuzzleProgress = (storageKey: string): StoredChessPuzzleProgress | null => {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredChessPuzzleProgress>;
    const playedLine = Array.isArray(parsed.playedLine)
      ? parsed.playedLine.map((move) => String(move))
      : [];
    const finalPlayedLine = Array.isArray(parsed.finalPlayedLine)
      ? parsed.finalPlayedLine.map((move) => String(move))
      : undefined;
    const pendingResult = parsed.pendingResult === 'solved' || parsed.pendingResult === 'failed'
      ? parsed.pendingResult
      : null;

    return {
      playedLine,
      pendingResult,
      finalPlayedLine,
      forceFail: Boolean(parsed.forceFail),
    };
  } catch {
    return null;
  }
};

export const writeChessPuzzleProgress = (
  storageKey: string,
  value: StoredChessPuzzleProgress,
) => {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Ignore storage write failures.
  }
};

export const clearChessPuzzleProgress = (storageKey: string) => {
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    // Ignore storage clear failures.
  }
};

export const clearChallengeChessProgress = (
  challengeId: number,
  keepQuestionNumber?: number,
) => {
  try {
    const keepKey = keepQuestionNumber
      ? getChessPuzzleProgressKey(challengeId, keepQuestionNumber)
      : null;

    for (let index = sessionStorage.length - 1; index >= 0; index -= 1) {
      const key = sessionStorage.key(index);
      if (!key || !key.startsWith(`${CHESS_PROGRESS_PREFIX}${challengeId}:`)) {
        continue;
      }

      if (keepKey && key === keepKey) {
        continue;
      }

      sessionStorage.removeItem(key);
    }
  } catch {
    // Ignore storage clear failures.
  }
};
