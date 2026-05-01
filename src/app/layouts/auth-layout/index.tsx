import { Suspense } from 'react';
import { Outlet } from 'react-router';
import PageLoader from 'shared/components/loading/PageLoader';
import useSettingsPanelMountEffect from 'shared/hooks/useSettingsPanelMountEffect';

const AuthLayout = () => {
  useSettingsPanelMountEffect({
    disableNavigationMenuSection: true,
    disableSidenavShapeSection: true,
    disableTopShapeSection: true,
    disableNavColorSection: true,
  });
  return (
    <Suspense fallback={<PageLoader sx={{ minHeight: '100vh' }} />}>
      <Outlet />
    </Suspense>
  );
};

export default AuthLayout;
