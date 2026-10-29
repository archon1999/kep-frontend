import { lazy } from 'react';

export const AdminDashboardPage = lazy(() => import('./AdminDashboardPage/AdminDashboardPage'));
export const AdminCatalogPage = lazy(() => import('./AdminCatalogPage/AdminCatalogPage'));
export const AdminResourceListPage = lazy(
  () => import('./AdminResourceListPage/AdminResourceListPage'),
);
export const AdminResourceFormPage = lazy(
  () => import('./AdminResourceFormPage/AdminResourceFormPage'),
);
export const AdminImportOrderPage = lazy(
  () => import('./AdminImportOrderPage/AdminImportOrderPage'),
);
