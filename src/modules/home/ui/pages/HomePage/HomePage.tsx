import { Suspense, lazy } from 'react';
import { useHomePage } from 'modules/home/application/hooks/useHomePage';
import PageLoader from 'shared/components/loading/PageLoader';
import { HomePageRoot } from './HomePage.styles';
import HomeDashboardSkeleton from './components/HomeDashboardSkeleton';

const HomeLanding = lazy(() => import('./components/HomeLanding'));
const HomeDashboard = lazy(() => import('./components/HomeDashboard'));

const HomePage = () => {
  const { currentUser, isAuthLoading } = useHomePage();

  if (isAuthLoading) return <PageLoader />;
  return (
    <Suspense fallback={currentUser ? <HomeDashboardSkeleton /> : <PageLoader />}>
      {currentUser ? <HomeDashboard user={currentUser} /> : <HomeLanding />}
    </Suspense>
  );
};
const HomePageView = () => (
  <HomePageRoot>
    <HomePage />
  </HomePageRoot>
);
export default HomePageView;
