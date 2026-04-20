import { lazy } from 'react';

export const UserProfileAboutTab = lazy(
  () => import('./UserProfilePage/components/user-profile/UserProfileAboutTab'),
);
export const UserProfileAchievementsTab = lazy(
  () => import('./UserProfilePage/components/user-profile/UserProfileAchievementsTab'),
);
export const UserProfileActivityHistoryTab = lazy(
  () => import('./UserProfilePage/components/user-profile/UserProfileActivityHistoryTab'),
);
export const UserProfileBlogTab = lazy(
  () => import('./UserProfilePage/components/user-profile/UserProfileBlogTab'),
);
export const UserProfilePage = lazy(() => import('./UserProfilePage/UserProfilePage'));
export const UserProfilePurchasesTab = lazy(
  () => import('./UserProfilePage/components/user-profile/UserProfilePurchasesTab'),
);
export const UserProfileRatingsTab = lazy(
  () => import('./UserProfilePage/components/user-profile/UserProfileRatingsTab'),
);
export const UsersListPage = lazy(() => import('./UsersListPage/UsersListPage'));
