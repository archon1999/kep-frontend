import { useLocation, useNavigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';

export const useAccountSettingsPage = () => {
  const { currentUser } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();
  return { currentUser, location, navigate };
};
