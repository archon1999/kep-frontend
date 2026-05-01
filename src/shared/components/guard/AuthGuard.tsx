import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { authPaths } from 'app/routes/route-config';
import PageLoader from 'shared/components/loading/PageLoader';

const AuthGurad = ({ children }: PropsWithChildren) => {
  const { currentUser, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <PageLoader />;
  }

  if (currentUser) {
    return children;
  }

  const returnUrl = `${location.pathname}${location.search}${location.hash}`;

  return (
    <Navigate
      to={{
        pathname: authPaths.login,
        search: `?returnUrl=${encodeURIComponent(returnUrl)}`,
      }}
      replace
      state={{ from: location }}
    />
  );
};

export default AuthGurad;
