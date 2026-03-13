export const resources = {
  Home: '/',

  Problems: '/problems',
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
  ArenaTournament: '/arena/tournament/:id',

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
