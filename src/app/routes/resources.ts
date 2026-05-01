export const resources = {
  Home: '/',
  NotFound: '/404',
  Forbidden: '/403',

  Admin: '/admin',
  AdminProblems: '/admin/problems',
  AdminProblemCreate: '/admin/problems/new',
  AdminProblemEdit: '/admin/problems/:id',
  AdminProblemAttempts: '/admin/problems/attempts',
  AdminProblemAttemptCreate: '/admin/problems/attempts/new',
  AdminProblemAttemptEdit: '/admin/problems/attempts/:id',
  AdminProblemChapters: '/admin/problems/chapters',
  AdminProblemChapterCreate: '/admin/problems/chapters/new',
  AdminProblemChapterEdit: '/admin/problems/chapters/:id',
  AdminProblemTags: '/admin/problems/tags',
  AdminProblemTagCreate: '/admin/problems/tags/new',
  AdminProblemTagEdit: '/admin/problems/tags/:id',
  AdminContests: '/admin/contests',
  AdminContestCreate: '/admin/contests/new',
  AdminContestEdit: '/admin/contests/:id',
  AdminContestQuestions: '/admin/contests/questions',
  AdminContestQuestionCreate: '/admin/contests/questions/new',
  AdminContestQuestionEdit: '/admin/contests/questions/:id',
  AdminContestTypes: '/admin/contests/types',
  AdminContestTypeCreate: '/admin/contests/types/new',
  AdminContestTypeEdit: '/admin/contests/types/:id',
  AdminContestFilters: '/admin/contests/filters',
  AdminContestFilterCreate: '/admin/contests/filters/new',
  AdminContestFilterEdit: '/admin/contests/filters/:id',
  AdminUsers: '/admin/users',
  AdminUserCreate: '/admin/users/new',
  AdminUserEdit: '/admin/users/:id',
  AdminTeams: '/admin/users/teams',
  AdminTeamCreate: '/admin/users/teams/new',
  AdminTeamEdit: '/admin/users/teams/:id',

  Problems: '/problems',
  StudyPlans: '/problems/study-plans',
  Problem: '/problems/:id',
  ProblemsRating: '/problems/rating',
  ProblemsRatingHistory: '/problems/rating/history',
  Attempt: '/problems/attempts/:id',
  StudyPlan: '/problems/study-plan/:id',

  Attempts: '/problems/attempts',
  AttemptsByUser: '/problems/attempts/:username',
  ProblemsUserStatistics: '/problems/user-statistics',

  Contests: '/contests',
  ContestsRating: '/contests/rating',
  Contest: '/contests/:id',
  ContestStandings: '/contests/:id/standings',
  ContestProblems: '/contests/:id/problems',
  ContestAttempts: '/contests/:id/attempts',
  ContestStatistics: '/contests/:id/statistics',
  ContestRegistrants: '/contests/:id/registrants',
  ContestRatingChanges: '/contests/:id/rating-changes',
  ContestQuestions: '/contests/:id/questions',
  ContestProblem: '/contests/:id/problem/:symbol',
  ContestsUserStatistics: '/contests/user-statistics',

  Challenges: '/challenges',
  ChallengesRating: '/challenges/rating',
  Challenge: '/challenges/:id',
  ChallengesUserStatistics: '/challenges/user-statistics',

  Duels: '/duels',
  DuelsRating: '/duels/rating',
  Duel: '/duels/:id',

  Arena: '/arena',
  ArenaTournament: '/arena/:id',

  Tournaments: '/tournaments',
  Tournament: '/tournaments/:id',

  Hackathons: '/hackathons',
  Hackathon: '/hackathons/:id',
  HackathonProjects: '/hackathons/:id/projects',
  HackathonProject: '/hackathons/:id/projects/:symbol',
  HackathonAttempts: '/hackathons/:id/attempts',
  HackathonRegistrants: '/hackathons/:id/registrants',
  HackathonStandings: '/hackathons/:id/standings',

  Tests: '/tests',
  Test: '/tests/:id',
  TestPass: '/tests/test-pass/:id',

  Projects: '/projects',
  Project: '/projects/:slug',

  Courses: '/courses',
  Course: '/courses/:id',
  CourseFirstLesson: '/courses/:id/lesson/1',

  Blog: '/blog',
  Lugavar: '/lugavar',
  BlogCreate: '/blog/new',
  BlogEdit: '/blog/:id/edit',
  BlogPost: '/blog/:id',

  Users: '/users',
  UserProfile: '/users/:username',
  UserProfileFollowers: '/users/:username/followers',
  UserProfileRatings: '/users/:username/ratings',
  UserProfileActivityHistory: '/users/:username/activity-history',
  UserProfilePurchases: '/users/:username/purchases',
  UserProfileBlog: '/users/:username/blog',
  UserProfileAchievements: '/users/:username/achievements',

  Calendar: '/calendar',
  Shop: '/shop',
  Kepcoin: '/kepcoin',
  KepcoinEarn: '/kepcoin/earn',
  KepCover: '/kep-cover',

  Login: '/login',
  Settings: '/settings',
  SettingsChangePassword: '/settings/change-password',
  SettingsInformation: '/settings/information',
  SettingsSocial: '/settings/social',
  SettingsSkills: '/settings/skills',
  SettingsCareer: '/settings/career',
  SettingsTeams: '/settings/teams',
  SettingsSystem: '/settings/system',
  TeamJoin: '/teams/:id/join',
} as const;

export type Resource = keyof typeof resources;
export type ResourceValue = (typeof resources)[Resource];

export function getResourceById(resource: ResourceValue, id: number | string) {
  return resource.replace(':id', id.toString());
}

export function getResourceByUsername(resource: ResourceValue, username: string) {
  return resource.replace(':username', username);
}

export function getResourceByParams(
  resource: ResourceValue,
  params: Record<string, string | number>,
) {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, value.toString()),
    resource,
  );
}
