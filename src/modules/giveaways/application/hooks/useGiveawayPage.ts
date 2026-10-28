import { useParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';

export const useGiveawayPage = () => {
  const { id = '' } = useParams();

  const { currentUser } = useAuth();
  return { id, currentUser };
};
