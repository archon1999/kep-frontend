import { useEffect } from 'react';
import { useAuth } from 'app/providers/AuthProvider';
import { useGameSession } from 'modules/kepper-game/application';
import { codeIslandsScore } from 'modules/kepper-game/domain';

interface Options {
  onScore?: (score: number) => void;
  onAudioStop?: () => void;
  onAudioCue?: (kind: 'run' | 'correct' | 'wrong') => void;
}
export const useKepperGamePage = ({ onScore, onAudioStop, onAudioCue }: Options) => {
  const { currentUser } = useAuth();
  const game = useGameSession(currentUser?.username);

  const score = codeIslandsScore(game.progress);
  useEffect(() => {
    if (score > 0) onScore?.(score);
  }, [onScore, score]);
  useEffect(() => {
    if (game.feedback?.kind === 'win') onAudioCue?.('correct');
    else if (game.feedback && game.feedback.kind !== 'unavailable') onAudioCue?.('wrong');
  }, [game.feedback, onAudioCue]);
  useEffect(() => {
    if (game.progress.completed.length === game.levels.length) onAudioStop?.();
  }, [game.progress.completed.length, game.levels.length, onAudioStop]);

  return { game, score };
};
