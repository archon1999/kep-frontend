import { useRouteErrorPage } from 'modules/errors/application/hooks/useRouteErrorPage';
import AppErrorPage from 'modules/errors/ui/shared/components/AppErrorPage';
import { resolveAppErrorKind } from '../../shared/utils/app-error';

const RouteErrorPage = () => {
  const { error } = useRouteErrorPage();

  return <AppErrorPage kind={resolveAppErrorKind(error)} />;
};

export default RouteErrorPage;
