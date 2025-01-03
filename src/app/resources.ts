export enum Resources {
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

  Tests = '/practice/tests',
  Test = '/practice/tests/test/:id',

  Projects = '/practice/projects',
  Project = '/practice/projects/project/:id',

  Courses = '/learn/courses',
  Course = '/learn/courses/course/:id',
  CourseFirstLesson = '/learn/courses/course/:id/lesson/1',

  Login = '/login',
  Settings = '/settings',
  SettingsTab = '/settings/:id',
  TeamJoin = '/teams/:id/join',

  Shop = '/shop',
  Kepcoin = '/kepcoin',
}

export function getResourceById(resource: Resources, id: number | string) {
  return resource.replace(':id', id.toString());
}
