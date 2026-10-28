import { useParams } from 'react-router';

export const useGamePlayPage = () => {
  const { gameId } = useParams();
  return { gameId };
};
