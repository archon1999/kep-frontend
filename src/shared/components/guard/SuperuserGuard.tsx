import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import { getLoginRedirectTo, getReturnUrlFromLocation } from 'shared/lib/authRedirect';

const SuperuserGuard = ({ children }: PropsWithChildren) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser?.isSuperuser) {
    return children;
  }

  if (currentUser) {
    return <Navigate to={resources.Forbidden} />;
  }

  const returnUrl = getReturnUrlFromLocation(location);

  return (
    <Navigate
      to={getLoginRedirectTo(returnUrl)}
      replace
      state={{ from: location }}
    />
  );
};

export default SuperuserGuard;
