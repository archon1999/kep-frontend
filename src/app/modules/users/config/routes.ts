import { Route } from '@angular/router';

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
    data: {
      animation: 'user',
      title: 'Users.User',
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
        loadComponent: () => import('../ui/pages/user-profile/widgets/user-followers/user-followers.component').then(c => c.UserFollowersComponent),
      },
      {
        path: 'activity-history',
        loadComponent: () => import('../ui/pages/user-profile/tabs/activity-history-tab/activity-history-tab.component').then(c => c.UserActivityHistoryTabComponent),
      },
      {
        path: 'blog',
        loadComponent: () => import('../ui/pages/user-profile/widgets/user-blog/user-blog.component').then(c => c.UserBlogComponent),
      },
      {
        path: 'achievements',
        loadComponent: () => import('../ui/pages/user-profile/tabs/achievements-tab/achievements-tab.component').then(c => c.UserAchievementsTabComponent),
      },
    ]
  },
] satisfies Route[];
