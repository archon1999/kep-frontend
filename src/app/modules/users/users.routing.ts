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
} from '@users/users.resolver';
import { Route } from '@angular/router';

export default [
  {
    path: 'user/:username',
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(c => c.UserProfileComponent),
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
    }
  },
  {
    path: '',
    loadComponent: () => import('./pages/users/users.component').then(c => c.UsersComponent),
    data: { animation: 'users' },
    title: 'Users.Users',
  }
] satisfies Route[];
