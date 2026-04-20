import { useEffect } from 'react';
import { useRouteError } from 'react-router';
import AppErrorPage from 'modules/errors/ui/shared/components/AppErrorPage';
import { resolveAppErrorKind } from '../../shared/utils/app-error';

const RouteErrorPage = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error('Route rendering error', error);
  }, [error]);

  return <AppErrorPage kind={resolveAppErrorKind(error)} />;
};

export default RouteErrorPage;
