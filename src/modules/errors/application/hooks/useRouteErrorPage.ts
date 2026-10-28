import { useEffect } from 'react';
import { useRouteError } from 'react-router';

export const useRouteErrorPage = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error('Route rendering error', error);
  }, [error]);
  return { error };
};
