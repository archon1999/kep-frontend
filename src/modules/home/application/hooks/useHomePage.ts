import { useAuth } from 'app/providers/AuthProvider';

export const useHomePage = () => {
  const { currentUser, isAuthLoading } = useAuth();
  return { currentUser, isAuthLoading };
};
