import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import PageLoader from 'shared/components/loading/PageLoader';
import { getLoginRedirectTo, getReturnUrlFromLocation } from 'shared/lib/authRedirect';

export default function AdminGuard({ children }: PropsWithChildren) {
  const { currentUser, isAuthLoading } = useAuth();
  const location = useLocation();
  if (isAuthLoading) return <PageLoader />;
  if (currentUser?.isSuperuser || currentUser?.isStaff) return children;
  return (
    <Navigate
      replace
      to={
        currentUser ? resources.Forbidden : getLoginRedirectTo(getReturnUrlFromLocation(location))
      }
      state={{ from: location }}
    />
  );
}
