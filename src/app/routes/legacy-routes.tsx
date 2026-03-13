import { RouteObject } from 'react-router';
import LegacyRedirect from './LegacyRedirect';
import { resources } from './resources';

export const legacyRedirectRoutes: RouteObject[] = [
  { path: '/home', element: <LegacyRedirect to={resources.Home} /> },

  { path: '/practice/problems', element: <LegacyRedirect to={resources.Problems} /> },
  { path: '/practice/problems/problem/:id', element: <LegacyRedirect to={resources.Problem} /> },
  { path: '/practice/problems/study-plan/:id', element: <LegacyRedirect to={resources.StudyPlan} /> },
  { path: '/practice/problems/attempts', element: <LegacyRedirect to={resources.Attempts} /> },
  { path: '/practice/problems/attempts/:username', element: <LegacyRedirect to={resources.AttemptsByUser} /> },

  { path: '/competitions/contests', element: <LegacyRedirect to={resources.Contests} /> },
  { path: '/competitions/contests/contest/:id', element: <LegacyRedirect to={resources.Contest} /> },
  {
    path: '/competitions/contests/contest/:id/standings',
    element: <LegacyRedirect to={resources.ContestStandings} />,
  },
  {
    path: '/competitions/contests/contest/:id/problems',
    element: <LegacyRedirect to={resources.ContestProblems} />,
  },
  {
    path: '/competitions/contests/contest/:id/attempts',
    element: <LegacyRedirect to={resources.ContestAttempts} />,
  },
  {
    path: '/competitions/contests/contest/:id/statistics',
    element: <LegacyRedirect to={resources.ContestStatistics} />,
  },
  {
    path: '/competitions/contests/contest/:id/registrants',
    element: <LegacyRedirect to={resources.ContestRegistrants} />,
  },
  {
    path: '/competitions/contests/contest/:id/rating-changes',
    element: <LegacyRedirect to={resources.ContestRatingChanges} />,
  },
  {
    path: '/competitions/contests/contest/:id/questions',
    element: <LegacyRedirect to={resources.ContestQuestions} />,
  },
  {
    path: '/competitions/contests/contest/:id/problem/:symbol',
    element: <LegacyRedirect to={resources.ContestProblem} />,
  },
  {
    path: '/competitions/contests/user-statistics',
    element: <LegacyRedirect to={resources.ContestsUserStatistics} />,
  },

  { path: '/practice/challenges', element: <LegacyRedirect to={resources.Challenges} /> },
  { path: '/practice/challenges/rating', element: <LegacyRedirect to={resources.ChallengesRating} /> },
  { path: '/practice/challenges/challenge/:id', element: <LegacyRedirect to={resources.Challenge} /> },

  { path: '/practice/duels', element: <LegacyRedirect to={resources.Duels} /> },
  { path: '/practice/duels/rating', element: <LegacyRedirect to={resources.DuelsRating} /> },
  { path: '/practice/duels/duel/:id', element: <LegacyRedirect to={resources.Duel} /> },

  { path: '/competitions/arena', element: <LegacyRedirect to={resources.Arena} /> },
  { path: '/competitions/arena/tournament/:id', element: <LegacyRedirect to={resources.ArenaTournament} /> },

  { path: '/competitions/tournaments', element: <LegacyRedirect to={resources.Tournaments} /> },
  { path: '/competitions/tournaments/tournament/:id', element: <LegacyRedirect to={resources.Tournament} /> },

  { path: '/competitions/hackathons', element: <LegacyRedirect to={resources.Hackathons} /> },
  { path: '/competitions/hackathons/hackathon/:id', element: <LegacyRedirect to={resources.Hackathon} /> },
  {
    path: '/competitions/hackathons/hackathon/:id/projects',
    element: <LegacyRedirect to={resources.HackathonProjects} />,
  },
  {
    path: '/competitions/hackathons/hackathon/:id/projects/:symbol',
    element: <LegacyRedirect to={resources.HackathonProject} />,
  },
  {
    path: '/competitions/hackathons/hackathon/:id/attempts',
    element: <LegacyRedirect to={resources.HackathonAttempts} />,
  },
  {
    path: '/competitions/hackathons/hackathon/:id/registrants',
    element: <LegacyRedirect to={resources.HackathonRegistrants} />,
  },
  {
    path: '/competitions/hackathons/hackathon/:id/standings',
    element: <LegacyRedirect to={resources.HackathonStandings} />,
  },

  { path: '/practice/tests', element: <LegacyRedirect to={resources.Tests} /> },
  { path: '/practice/tests/test/:id', element: <LegacyRedirect to={resources.Test} /> },

  { path: '/practice/projects', element: <LegacyRedirect to={resources.Projects} /> },
  {
    path: '/practice/projects/project/:id',
    element: (
      <LegacyRedirect
        to={resources.Project}
        mapParams={({ id }) => ({ slug: id })}
      />
    ),
  },

  { path: '/learn/blog', element: <LegacyRedirect to={resources.Blog} /> },
  { path: '/learn/blog/post/:id', element: <LegacyRedirect to={resources.BlogPost} /> },
  { path: '/learn/lugavar', element: <LegacyRedirect to={resources.Lugavar} /> },

  { path: '/learn/courses', element: <LegacyRedirect to={resources.Courses} /> },
  { path: '/learn/courses/course/:id', element: <LegacyRedirect to={resources.Course} /> },
  {
    path: '/learn/courses/course/:id/lesson/1',
    element: <LegacyRedirect to={resources.CourseFirstLesson} />,
  },

  { path: '/users/user/:username', element: <LegacyRedirect to={resources.UserProfile} /> },
  {
    path: '/users/user/:username/followers',
    element: <LegacyRedirect to={resources.UserProfileFollowers} />,
  },
  {
    path: '/users/user/:username/ratings',
    element: <LegacyRedirect to={resources.UserProfileRatings} />,
  },
  {
    path: '/users/user/:username/activity-history',
    element: <LegacyRedirect to={resources.UserProfileActivityHistory} />,
  },
  { path: '/users/user/:username/blog', element: <LegacyRedirect to={resources.UserProfileBlog} /> },
  {
    path: '/users/user/:username/achievements',
    element: <LegacyRedirect to={resources.UserProfileAchievements} />,
  },
];
