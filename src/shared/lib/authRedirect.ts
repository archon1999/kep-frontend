import { useCallback, useMemo } from 'react';
import { To, useLocation, useNavigate } from 'react-router';
import { authPaths, rootPaths } from 'app/routes/route-config';

export const getReturnUrlFromLocation = (location: {
  pathname: string;
  search?: string;
  hash?: string;
}) => `${location.pathname}${location.search ?? ''}${location.hash ?? ''}`;

export const getCurrentReturnUrl = () => {
  if (typeof window === 'undefined') {
    return rootPaths.root;
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const getLoginRedirectTo = (returnUrl = getCurrentReturnUrl()): To => ({
  pathname: authPaths.login,
  search: `?returnUrl=${encodeURIComponent(returnUrl || rootPaths.root)}`,
});

export const getLoginRedirectPath = (returnUrl = getCurrentReturnUrl()) =>
  `${authPaths.login}?returnUrl=${encodeURIComponent(returnUrl || rootPaths.root)}`;

export const useLoginHref = (returnUrl?: string) => {
  const location = useLocation();

  return useMemo(
    () => getLoginRedirectPath(returnUrl ?? getReturnUrlFromLocation(location)),
    [location, returnUrl],
  );
};

export const useLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (returnUrl = getReturnUrlFromLocation(location), options?: { replace?: boolean }) => {
      navigate(getLoginRedirectTo(returnUrl), {
        replace: options?.replace ?? false,
        state: { from: location },
      });
    },
    [location, navigate],
  );
};
