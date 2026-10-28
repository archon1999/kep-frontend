import { Navigate } from 'react-router';
import { resources } from 'app/routes/resources';
import { useGamePlayPage } from 'modules/games/application/hooks/useGamePlayPage';
import { type GameId, gameIds } from 'modules/games/domain';
import { GameContent } from 'modules/games/ui/pages/GamePlayPage/components/GameContent';

const GamePlayPage = () => {
  const { gameId } = useGamePlayPage();

  if (gameId === 'kepper-world') return <Navigate to={`${resources.Games}/keppy-world`} replace />;
  if (!gameId || !gameIds.includes(gameId as GameId))
    return <Navigate to={resources.NotFound} replace />;
  return <GameContent id={gameId as GameId} />;
};

export default GamePlayPage;
