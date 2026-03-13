import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Splash from 'shared/components/loading/Splash';
import useSettingsPanelMountEffect from 'shared/hooks/useSettingsPanelMountEffect';

const AuthLayout = () => {
  useSettingsPanelMountEffect({
    disableNavigationMenuSection: true,
    disableSidenavShapeSection: true,
    disableTopShapeSection: true,
    disableNavColorSection: true,
  });
  return (
    <Suspense fallback={<Splash />}>
      <Outlet />
    </Suspense>
  );
};

export default AuthLayout;
