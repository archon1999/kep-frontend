import { useAuth } from 'app/providers/AuthProvider';
import { useGamesLeaderboard, useGamesOverview } from 'modules/games/application';

export const useGamesPage = () => {
  const { currentUser } = useAuth();

  const {
    data: leaderboard,
    error: leaderboardError,
    isLoading,
    mutate,
  } = useGamesLeaderboard('overall');

  const {
    data: overview,
    error: overviewError,
    isLoading: overviewLoading,
    mutate: refreshOverview,
  } = useGamesOverview(currentUser?.username);
  return {
    currentUser,
    leaderboard,
    leaderboardError,
    isLoading,
    mutate,
    overview,
    overviewError,
    overviewLoading,
    refreshOverview,
  };
};
