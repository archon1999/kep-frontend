import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { authPaths } from 'app/routes/route-config';

const SuperuserGuard = ({ children }: PropsWithChildren) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser?.isSuperuser) {
    return children;
  }

  if (currentUser) {
    return <Navigate to={resources.Forbidden} replace />;
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

export default SuperuserGuard;
