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
        loadComponent: () => import('../ui/pages/user-profile/user-about/user-about.component').then(c => c.UserAboutComponent),
      },
      {
        path: 'ratings',
        loadComponent: () => import('../ui/pages/user-profile/user-ratings/user-ratings.component').then(c => c.UserRatingsComponent),
      },
      {
        path: 'activity-history',
        loadComponent: () => import('../ui/pages/user-profile/user-activity-history/user-activity-history.component').then(c => c.UserActivityHistoryComponent),
      },
      {
        path: 'blog',
        loadComponent: () => import('../ui/pages/user-profile/user-blog/user-blog.component').then(c => c.UserBlogComponent),
      },
      {
        path: 'achievements',
        loadComponent: () => import('../ui/pages/user-profile/user-achievements/user-achievements.component').then(c => c.UserAchievementsComponent),
      },
    ]
  },
] satisfies Route[];
