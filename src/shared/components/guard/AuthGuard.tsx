import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import PageLoader from 'shared/components/loading/PageLoader';
import { getLoginRedirectTo, getReturnUrlFromLocation } from 'shared/lib/authRedirect';

const AuthGurad = ({ children }: PropsWithChildren) => {
  const { currentUser, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <PageLoader />;
  }

  if (currentUser) {
    return children;
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

export default AuthGurad;
