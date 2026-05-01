import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';

const GuestGurad = ({ children }: PropsWithChildren) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" /> : children;
};

export default GuestGurad;
