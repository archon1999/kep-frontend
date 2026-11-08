export const resources = {
  Home: '/',
  Playground: '/playground',
  Giveaway: '/giveaways/:id',
  Updates: '/updates',
  NotFound: '/404',
  Forbidden: '/403',

  Admin: '/admin',
  AdminCatalog: '/admin/catalog',
  AdminManage: '/admin/manage',
  AdminResource: '/admin/:resourceSlug',
  AdminResourceCreate: '/admin/:resourceSlug/new',
  AdminResourceEdit: '/admin/:resourceSlug/:id',
  AdminAdvanced: '/admin/advanced',
  AdminOrders: '/admin/orders',
  AdminImportOrder: '/admin/import-order',
  AdminProblems: '/admin/problems',
  AdminProblemCreate: '/admin/problems/new',
  AdminProblemEdit: '/admin/problems/:id',
  AdminProblemAttempts: '/admin/attempts',
  AdminProblemAttemptCreate: '/admin/attempts/new',
  AdminProblemAttemptEdit: '/admin/attempts/:id',
  AdminProblemChapters: '/admin/chapters',
  AdminProblemChapterCreate: '/admin/chapters/new',
  AdminProblemChapterEdit: '/admin/chapters/:id',
  AdminProblemTags: '/admin/tags',
  AdminProblemTagCreate: '/admin/tags/new',
  AdminProblemTagEdit: '/admin/tags/:id',
  AdminContests: '/admin/contests',
  AdminContestCreate: '/admin/contests/new',
  AdminContestEdit: '/admin/contests/:id',
  AdminContestQuestions: '/admin/contest-questions',
  AdminContestQuestionCreate: '/admin/contest-questions/new',
  AdminContestQuestionEdit: '/admin/contest-questions/:id',
  AdminContestTypes: '/admin/contest-types',
  AdminContestTypeCreate: '/admin/contest-types/new',
  AdminContestTypeEdit: '/admin/contest-types/:id',
  AdminContestFilters: '/admin/contest-filters',
  AdminContestFilterCreate: '/admin/contest-filters/new',
  AdminContestFilterEdit: '/admin/contest-filters/:id',
  AdminUsers: '/admin/users',
  AdminUserCreate: '/admin/users/new',
  AdminUserEdit: '/admin/users/:id',
  AdminTeams: '/admin/teams',
  AdminTeamCreate: '/admin/teams/new',
  AdminTeamEdit: '/admin/teams/:id',

  Problems: '/problems',
  StudyPlans: '/problems/study-plans',
  Games: '/games',
  KeppyWorld: '/games/world',
  Game: '/games/:gameId',
  KepperGame: '/games/kepper',
  Problem: '/problems/:id',
  ProblemsRating: '/problems/rating',
  ProblemsRatingHistory: '/problems/rating/history',
  Attempt: '/problems/attempts/:id',
  StudyPlan: '/problems/study-plan/:id',

  Attempts: '/problems/attempts',
  AttemptsByUser: '/problems/attempts?username=:username',
  ProblemsUserStatistics: '/problems/user-statistics',

  Contests: '/contests',
  ContestsRating: '/contests/rating',
  Contest: '/contests/:id',
  ContestStandings: '/contests/:id/standings',
  ContestStandingsParticipant: '/contests/:id/standings/participant/:username',
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
  ProjectsRating: '/projects/rating',
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
  UserProfileRatings: '/users/:username#ratings',
  UserProfileActivityHistory: '/users/:username#activity-history',
  UserProfilePurchases: '/users/:username#purchases',
  UserProfileBlog: '/users/:username#blog',
  UserProfileAchievements: '/users/:username#achievements',

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
  SettingsNotifications: '/settings/notifications',
  SettingsSystem: '/settings/system',
  TeamJoin: '/teams/:id/join',
} as const;

// Specialist editors keep their own routes under the superuser-only workspace.
const advancedSections = [
  ['AdminProblems', 'AdminProblem', 'problems'],
  ['AdminProblemAttempts', 'AdminProblemAttempt', 'problems/attempts'],
  ['AdminProblemChapters', 'AdminProblemChapter', 'problems/chapters'],
  ['AdminProblemTags', 'AdminProblemTag', 'problems/tags'],
  ['AdminContests', 'AdminContest', 'contests'],
  ['AdminContestQuestions', 'AdminContestQuestion', 'contests/questions'],
  ['AdminContestTypes', 'AdminContestType', 'contests/types'],
  ['AdminContestFilters', 'AdminContestFilter', 'contests/filters'],
  ['AdminUsers', 'AdminUser', 'users'],
  ['AdminTeams', 'AdminTeam', 'users/teams'],
];
export const advancedAdminResources = {
  ...resources,
  ...Object.fromEntries(
    advancedSections.flatMap(([list, record, path]) => [
      [list, `${resources.AdminAdvanced}/${path}`],
      [record + 'Create', `${resources.AdminAdvanced}/${path}/new`],
      [record + 'Edit', `${resources.AdminAdvanced}/${path}/:id`],
    ]),
  ),
} as { [Key in keyof typeof resources]: string };

export type Resource = keyof typeof resources;
export type ResourceValue = (typeof resources)[Resource];

export function getResourceById(resource: string, id: number | string) {
  return resource.replace(':id', id.toString());
}

export function getResourceByUsername(resource: string, username: string) {
  return resource.replace(':username', username);
}

export function getResourceByParams(resource: string, params: Record<string, string | number>) {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, value.toString()),
    resource,
  );
}
