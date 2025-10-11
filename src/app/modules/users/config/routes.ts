import { ActivatedRouteSnapshot, ResolveFn, Route, RouterStateSnapshot } from '@angular/router';
import { User } from "@users/domain";
import { UsersApiService } from "@app/modules/users";
import { inject } from "@angular/core";

export const userResolver: ResolveFn<User> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const usersApiService = inject(UsersApiService);
  const username = route.paramMap.get('username')!;
  return usersApiService.getUser(username);
};

export default [
  {
    path: '',
    loadComponent: () => import('../ui/pages/users-list/users-list.page').then(c => c.UsersListPage),
    data: {animation: 'users', title: 'Users.Users'},
    title: 'Users.Users',
  },
  {
    path: 'user/:username',
    loadComponent: () => import('../ui/pages/user-profile/user-profile.component').then(c => c.UserProfileComponent),
    data: {title: 'Users.User'},
    resolve: {
      user: userResolver,
    },
    children: [
      {
        path: '',
        loadComponent: () => import('../ui/pages/user-profile/tabs/about-tab/about-tab.component').then(c => c.UserAboutTabComponent),
      },
      {
        path: 'ratings',
        loadComponent: () => import('../ui/pages/user-profile/tabs/ratings-tab/ratings-tab.component').then(c => c.UserRatingsTabComponent),
      },
      {
        path: 'followers',
        loadComponent: () => import('../ui/pages/user-followers/user-followers.component').then(c => c.UserFollowersComponent),
      },
      {
        path: 'activity-history',
        loadComponent: () => import('../ui/pages/user-profile/tabs/activity-history-tab/activity-history-tab.component').then(c => c.UserActivityHistoryTabComponent),
      },
      {
        path: 'achievements',
        loadComponent: () => import('../ui/pages/user-profile/tabs/achievements-tab/achievements-tab.component').then(c => c.UserAchievementsTabComponent),
      },
    ]
  },
] satisfies Route[];
