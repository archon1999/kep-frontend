export enum Resources {
  Home = '/home',

  Problems = '/practice/problems',
  Problem = '/practice/problems/problem/:id',

  Attempts = '/practice/problems/attempts',

  Contests = '/competitions/contests',
  Contest = '/competitions/contests/contest/:id',
  ContestStandings = '/competitions/contests/contest/:id/standings',

  Challenges = '/practice/challenges',
  ChallengesRating = '/practice/challenges/rating',
  Challenge = '/practice/challenges/challenge/:id',

  Arena = '/competitions/arena',
  ArenaTournament = '/competitions/arena/tournament/:id',

  Tournaments = '/competitions/tournaments',
  Tournament = '/competitions/tournaments/tournament/:id',

  Hackathons = '/competitions/hackathons',
  Hackathon = '/competitions/hackathons/hackathon/:id',

  Tests = '/practice/tests',
  Test = '/practice/tests/test/:id',

  Projects = '/practice/projects',
  Project = '/practice/projects/project/:id',

  Courses = '/learn/courses',
  Course = '/learn/courses/course/:id',
  CourseFirstLesson = '/learn/courses/course/:id/lesson/1',

  Blog = '/learn/blog',
  Lugavar = '/learn/lugavar',

  Users = '/users',
  UserProfile = `${Users}/user/:username`,
  UserProfileRatings = `${UserProfile}/ratings`,
  UserProfileBlog = `${UserProfile}/blog`,
  UserProfileAchievements = `${UserProfile}/achievements`,

  Calendar = '/calendar',
  Shop = '/shop',
  Kepcoin = '/kepcoin',
  KepCover = '/kep-cover',

  Login = '/login',
  Settings = '/settings',
  SettingsChangePassword = `${Settings}/change-password`,
  SettingsInformation = `${Settings}/information`,
  SettingsSocial = `${Settings}/social`,
  SettingsSkills = `${Settings}/skills`,
  SettingsCareer = `${Settings}/career`,
  SettingsTeams = `${Settings}/teams`,
  SettingsSystem = `${Settings}/system`,
  TeamJoin = '/teams/:id/join',
}

export function getResourceById(resource: Resources, id: number | string) {
  return resource.replace(':id', id.toString());
}

export function getResourceByUsername(resource: Resources, username: string) {
  return resource.replace(':username', username);
}
