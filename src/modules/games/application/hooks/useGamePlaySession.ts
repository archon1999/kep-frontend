import { useAuth } from 'app/providers/AuthProvider';
import { useGameAudio, useGameScore } from 'modules/games/application';
import { type GameId } from 'modules/games/domain';

export const useGamePlaySession = (id: GameId) => {
  const { currentUser } = useAuth();
  const score = useGameScore(id, currentUser?.username);
  const audio = useGameAudio(id === 'keppy-world' ? null : id);

  return { currentUser, score, audio };
};
