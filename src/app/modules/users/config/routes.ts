import {
  UserChallengesRatingResolver,
  UserContestsRatingResolver,
  UserEducationsResolver,
  UserInfoResolver,
  UserProblemsRatingResolver,
  UserResolver,
  UserSkillsResolver,
  UserSocialResolver,
  UserTechnologiesResolver,
  UserWorkExperiencesResolver
} from '@users/ui/users.resolver';
import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('../ui/pages/users-list/users-list.page').then(c => c.UsersListPage),
    data: {animation: 'users'},
    title: 'Users.Users',
  },
  {
    path: 'user/:username',
    loadComponent: () => import('../ui/pages/user-profile/user-profile.component').then(c => c.UserProfileComponent),
    data: {
      animation: 'user',
      title: 'Users.User',
    },
    resolve: {
      user: UserResolver,
      userInfo: UserInfoResolver,
      userSocial: UserSocialResolver,
      userTechnologies: UserTechnologiesResolver,
      userEducations: UserEducationsResolver,
      userWorkExperiences: UserWorkExperiencesResolver,
      userSkills: UserSkillsResolver,
      userContestsRating: UserContestsRatingResolver,
      userProblemsRating: UserProblemsRatingResolver,
      userChallengesRating: UserChallengesRatingResolver,
    },
    children: [
      {
        path: '',
        loadComponent: () => import('../ui/pages/user-profile/user-ratings/user-ratings.component').then(c => c.UserRatingsComponent),
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
