import { Suspense, lazy } from 'react';
import { Outlet, RouteObject, createBrowserRouter, useLocation } from 'react-router';
import App from 'app/App.tsx';
import AuthLayout from 'app/layouts/auth-layout';
import DefaultAuthLayout from 'app/layouts/auth-layout/DefaultAuthLayout';
import MainLayout from 'app/layouts/main-layout';
import Page404 from 'modules/errors/ui/pages/Page404';
import PageLoader from 'shared/components/loading/PageLoader';
import { resources } from './resources';
import { legacyRedirectRoutes } from './legacy-routes';
import { authPaths, rootPaths } from './route-config';

const Home = lazy(() => import('modules/home/ui/pages/HomePage'));
const KepCoverPage = lazy(() => import('modules/kep-cover/ui/pages/KepCoverPage'));
const KepcoinPage = lazy(() => import('modules/kepcoin/ui/pages/KepcoinPage'));
const KepcoinEarnPage = lazy(() => import('modules/kepcoin/ui/pages/KepcoinEarnPage'));
const ShopPage = lazy(() => import('modules/shop/ui/pages/ShopPage'));
const ProblemsListPage = lazy(() => import('modules/problems/ui/pages/ProblemsListPage'));
const ProblemsRatingPage = lazy(() => import('modules/problems/ui/pages/ProblemsRatingPage'));
const ProblemsRatingHistoryPage = lazy(() => import('modules/problems/ui/pages/ProblemsRatingHistoryPage'));
const ProblemsAttemptsPage = lazy(() => import('modules/problems/ui/pages/ProblemsAttemptsPage'));
const ProblemDetailPage = lazy(() => import('modules/problems/ui/pages/ProblemDetailPage'));
const ProblemsUserStatisticsPage = lazy(() => import('modules/problems/ui/pages/ProblemsUserStatisticsPage'));
const UsersListPage = lazy(() => import('modules/users/ui/pages/UsersListPage'));
const ProjectsListPage = lazy(() => import('modules/projects/ui/pages/ProjectsListPage'));
const ProjectDetailPage = lazy(() => import('modules/projects/ui/pages/ProjectDetailPage'));
const TestsListPage = lazy(() => import('modules/testing/ui/pages/TestsListPage'));
const TestDetailPage = lazy(() => import('modules/testing/ui/pages/TestDetailPage'));
const TestPassPage = lazy(() => import('modules/testing/ui/pages/TestPassPage'));
const ChallengesListPage = lazy(() => import('modules/challenges/ui/pages/ChallengesListPage'));
const ChallengeDetailPage = lazy(() => import('modules/challenges/ui/pages/ChallengeDetailPage'));
const ChallengesRatingPage = lazy(() => import('modules/challenges/ui/pages/ChallengesRatingPage'));
const ChallengeUserStatisticsPage = lazy(() => import('modules/challenges/ui/pages/UserStatisticsPage'));
const DuelsListPage = lazy(() => import('modules/duels/ui/pages/DuelsListPage'));
const DuelsRatingPage = lazy(() => import('modules/duels/ui/pages/DuelsRatingPage'));
const DuelDetailPage = lazy(() => import('modules/duels/ui/pages/DuelDetailPage'));
const ArenaListPage = lazy(() => import('modules/arena/ui/pages/ArenaListPage'));
const ArenaDetailPage = lazy(() => import('modules/arena/ui/pages/ArenaDetailPage'));
const ContestsListPage = lazy(() => import('modules/contests/ui/pages/ContestsListPage'));
const ContestsRatingPage = lazy(() => import('modules/contests/ui/pages/ContestsRatingPage'));
const ContestsUserStatisticsPage = lazy(
  () => import('modules/contests/ui/pages/ContestsUserStatisticsPage'),
);
const ContestPage = lazy(() => import('modules/contests/ui/pages/ContestPage'));
const ContestProblemsPage = lazy(() => import('modules/contests/ui/pages/ContestProblemsPage'));
const ContestProblemPage = lazy(() => import('modules/contests/ui/pages/ContestProblemPage'));
const ContestAttemptsPage = lazy(() => import('modules/contests/ui/pages/ContestAttemptsPage'));
const ContestStatisticsPage = lazy(
  () => import('modules/contests/ui/pages/ContestStatisticsPage'),
);
const ContestStandingsPage = lazy(() => import('modules/contests/ui/pages/ContestStandingsPage'));
const ContestRegistrantsPage = lazy(
  () => import('modules/contests/ui/pages/ContestRegistrantsPage'),
);
const ContestRatingChangesPage = lazy(
  () => import('modules/contests/ui/pages/ContestRatingChangesPage'),
);
const ContestQuestionsPage = lazy(() => import('modules/contests/ui/pages/ContestQuestionsPage'));
const TournamentsListPage = lazy(() => import('modules/tournaments/ui/pages/TournamentsListPage'));
const TournamentPage = lazy(() => import('modules/tournaments/ui/pages/TournamentPage'));
const HackathonsListPage = lazy(() => import('modules/hackathons/ui/pages/HackathonsListPage'));
const HackathonPage = lazy(() => import('modules/hackathons/ui/pages/HackathonPage'));
const HackathonProjectsPage = lazy(() => import('modules/hackathons/ui/pages/HackathonProjectsPage'));
const HackathonProjectPage = lazy(() => import('modules/hackathons/ui/pages/HackathonProjectPage'));
const HackathonAttemptsPage = lazy(() => import('modules/hackathons/ui/pages/HackathonAttemptsPage'));
const HackathonRegistrantsPage = lazy(() => import('modules/hackathons/ui/pages/HackathonRegistrantsPage'));
const HackathonStandingsPage = lazy(() => import('modules/hackathons/ui/pages/HackathonStandingsPage'));
const AccountSettingsPage = lazy(() => import('modules/account-settings/ui/pages/AccountSettingsPage'));
const BlogListPage = lazy(() => import('modules/blog/ui/pages/BlogListPage'));
const BlogEditorPage = lazy(() => import('modules/blog/ui/pages/BlogEditorPage'));
const BlogPostPage = lazy(() => import('modules/blog/ui/pages/BlogPostPage'));
const UserProfilePage = lazy(() => import('modules/users/ui/pages/UserProfilePage'));
const UserProfileAboutTab = lazy(() => import('modules/users/ui/components/user-profile/UserProfileAboutTab'));
const UserProfileBlogTab = lazy(() => import('modules/users/ui/components/user-profile/UserProfileBlogTab'));
const UserProfileRatingsTab = lazy(() => import('modules/users/ui/components/user-profile/UserProfileRatingsTab'));
const UserProfileActivityHistoryTab = lazy(
  () => import('modules/users/ui/components/user-profile/UserProfileActivityHistoryTab'),
);
const UserProfilePurchasesTab = lazy(
  () => import('modules/users/ui/components/user-profile/UserProfilePurchasesTab'),
);
const UserProfileAchievementsTab = lazy(
  () => import('modules/users/ui/components/user-profile/UserProfileAchievementsTab'),
);

const CalendarPage = lazy(() => import('modules/calendar/ui/pages/CalendarPage'));

const Login = lazy(() => import('modules/authentication/ui/pages/LoginPage'));

export const SuspenseOutlet = () => {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <MainLayout>
            <SuspenseOutlet />
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Home />,
            handle: { titleKey: 'pageTitles.home' },
          },
          {
            path: resources.Users,
            element: <UsersListPage />,
            handle: { titleKey: 'pageTitles.users' },
          },
          {
            path: resources.UserProfile,
            element: <UserProfilePage />,
            handle: {
              titleKey: 'pageTitles.userProfile',
              fallbackTitleKey: 'pageTitles.users',
            },
            children: [
              {
                index: true,
                element: <UserProfileAboutTab />,
              },
              {
                path: 'ratings',
                element: <UserProfileRatingsTab />,
              },
              {
                path: 'activity-history',
                element: <UserProfileActivityHistoryTab />,
              },
              {
                path: 'purchases',
                element: <UserProfilePurchasesTab />,
              },
              {
                path: 'blog',
                element: <UserProfileBlogTab />,
              },
              {
                path: 'achievements',
                element: <UserProfileAchievementsTab />,
              },
            ],
          },
          {
            path: resources.Problems,
            element: <ProblemsListPage />,
            handle: { titleKey: 'pageTitles.problems' },
          },
          {
            path: resources.ProblemsRating,
            element: <ProblemsRatingPage />,
            handle: { titleKey: 'pageTitles.problemsRating' },
          },
          {
            path: resources.ProblemsRatingHistory,
            element: <ProblemsRatingHistoryPage />,
            handle: { titleKey: 'pageTitles.problemsRatingHistory' },
          },
          {
            path: resources.ProblemsUserStatistics,
            element: <ProblemsUserStatisticsPage />,
            handle: { titleKey: 'pageTitles.problemsStats' },
          },
          {
            path: resources.Attempts,
            element: <ProblemsAttemptsPage />,
            handle: { titleKey: 'pageTitles.problemsAttempts' },
          },
          {
            path: resources.AttemptsByUser,
            element: <ProblemsAttemptsPage />,
            handle: { titleKey: 'pageTitles.problemsAttempts' },
          },
          {
            path: resources.Projects,
            element: <ProjectsListPage />,
            handle: { titleKey: 'pageTitles.projects' },
          },
          {
            path: resources.Project,
            element: <ProjectDetailPage />,
            handle: {
              titleKey: 'pageTitles.project',
              fallbackTitleKey: 'pageTitles.projects',
            },
          },
          {
            path: resources.Tests,
            element: <TestsListPage />,
            handle: { titleKey: 'pageTitles.tests' },
          },
          {
            path: resources.Test,
            element: <TestDetailPage />,
            handle: { titleKey: 'pageTitles.test', fallbackTitleKey: 'pageTitles.tests' },
          },
          {
            path: resources.TestPass,
            element: <TestPassPage />,
            handle: { titleKey: 'pageTitles.testPass', fallbackTitleKey: 'pageTitles.tests' },
          },
          {
            path: resources.Challenges,
            element: <ChallengesListPage />,
            handle: { titleKey: 'pageTitles.challenges' },
          },
          {
            path: resources.Challenge,
            element: <ChallengeDetailPage />,
            handle: { titleKey: 'pageTitles.challenge', fallbackTitleKey: 'pageTitles.challenges' },
          },
          {
            path: resources.ChallengesRating,
            element: <ChallengesRatingPage />,
            handle: { titleKey: 'pageTitles.challengesRating' },
          },
          {
            path: resources.ChallengesUserStatistics,
            element: <ChallengeUserStatisticsPage />,
            handle: { titleKey: 'pageTitles.challengesStats' },
          },
          {
            path: resources.Duels,
            element: <DuelsListPage />,
            handle: { titleKey: 'pageTitles.duels' },
          },
          {
            path: resources.DuelsRating,
            element: <DuelsRatingPage />,
            handle: { titleKey: 'pageTitles.duelsRating' },
          },
          {
            path: resources.Arena,
            element: <ArenaListPage />,
            handle: { titleKey: 'pageTitles.arena' },
          },
          {
            path: resources.ArenaTournament,
            element: <ArenaDetailPage />,
            handle: { titleKey: 'pageTitles.arenaTournament', fallbackTitleKey: 'pageTitles.arena' },
          },
          {
            path: resources.Contests,
            element: <ContestsListPage />,
            handle: { titleKey: 'pageTitles.contests' },
          },
          {
            path: resources.ContestsRating,
            element: <ContestsRatingPage />,
            handle: { titleKey: 'pageTitles.contestsRating' },
          },
          {
            path: resources.ContestsUserStatistics,
            element: <ContestsUserStatisticsPage />,
            handle: { titleKey: 'pageTitles.contestsStats' },
          },
          {
            path: resources.Contest,
            element: <ContestPage />,
            handle: { titleKey: 'pageTitles.contest', fallbackTitleKey: 'pageTitles.contests' },
          },
          {
            path: resources.ContestProblems,
            element: <ContestProblemsPage />,
            handle: { titleKey: 'pageTitles.contestProblems', fallbackTitleKey: 'pageTitles.contests' },
          },
          {
            path: resources.ContestAttempts,
            element: <ContestAttemptsPage />,
            handle: { titleKey: 'pageTitles.contestAttempts', fallbackTitleKey: 'pageTitles.contests' },
          },
          {
            path: resources.ContestStatistics,
            element: <ContestStatisticsPage />,
            handle: { titleKey: 'pageTitles.contestStatistics', fallbackTitleKey: 'pageTitles.contests' },
          },
          {
            path: resources.ContestStandings,
            element: <ContestStandingsPage />,
            handle: { titleKey: 'pageTitles.contestStandings', fallbackTitleKey: 'pageTitles.contests' },
          },
          {
            path: resources.ContestRegistrants,
            element: <ContestRegistrantsPage />,
            handle: { titleKey: 'pageTitles.contestRegistrants', fallbackTitleKey: 'pageTitles.contests' },
          },
          {
            path: resources.ContestRatingChanges,
            element: <ContestRatingChangesPage />,
            handle: { titleKey: 'pageTitles.contestRatingChanges', fallbackTitleKey: 'pageTitles.contests' },
          },
          {
            path: resources.ContestQuestions,
            element: <ContestQuestionsPage />,
            handle: { titleKey: 'pageTitles.contestQuestions', fallbackTitleKey: 'pageTitles.contests' },
          },
          {
            path: resources.Tournaments,
            element: <TournamentsListPage />,
            handle: { titleKey: 'pageTitles.tournaments' },
          },
          {
            path: resources.Tournament,
            element: <TournamentPage />,
            handle: { titleKey: 'pageTitles.tournament', fallbackTitleKey: 'pageTitles.tournaments' },
          },
          {
            path: resources.Shop,
            element: <ShopPage />,
            handle: { titleKey: 'pageTitles.shop' },
          },
          {
            path: resources.Kepcoin,
            element: <KepcoinPage />,
            handle: { titleKey: 'pageTitles.kepcoin' },
          },
          {
            path: resources.KepcoinEarn,
            element: <KepcoinEarnPage />,
            handle: { titleKey: 'pageTitles.kepcoinEarn' },
          },
          {
            path: resources.KepCover,
            element: <KepCoverPage />,
            handle: { titleKey: 'pageTitles.kepCover', fallbackTitleKey: 'pageTitles.home' },
          },
          {
            path: resources.Calendar,
            element: <CalendarPage />,
            handle: { titleKey: 'pageTitles.calendar' },
          },
          {
            path: resources.Hackathons,
            element: <HackathonsListPage />,
            handle: { titleKey: 'pageTitles.hackathons' },
          },
          {
            path: resources.Hackathon,
            element: <HackathonPage />,
            handle: { titleKey: 'pageTitles.hackathon', fallbackTitleKey: 'pageTitles.hackathons' },
          },
          {
            path: resources.HackathonProjects,
            element: <HackathonProjectsPage />,
            handle: { titleKey: 'pageTitles.hackathonProjects', fallbackTitleKey: 'pageTitles.hackathons' },
          },
          {
            path: resources.HackathonProject,
            element: <HackathonProjectPage />,
            handle: { titleKey: 'pageTitles.hackathonProject', fallbackTitleKey: 'pageTitles.hackathons' },
          },
          {
            path: resources.HackathonAttempts,
            element: <HackathonAttemptsPage />,
            handle: { titleKey: 'pageTitles.hackathonAttempts', fallbackTitleKey: 'pageTitles.hackathons' },
          },
          {
            path: resources.HackathonRegistrants,
            element: <HackathonRegistrantsPage />,
            handle: {
              titleKey: 'pageTitles.hackathonRegistrants',
              fallbackTitleKey: 'pageTitles.hackathons',
            },
          },
          {
            path: resources.HackathonStandings,
            element: <HackathonStandingsPage />,
            handle: { titleKey: 'pageTitles.hackathonStandings', fallbackTitleKey: 'pageTitles.hackathons' },
          },
          {
            path: resources.Blog,
            element: <BlogListPage />,
            handle: { titleKey: 'pageTitles.blog' },
          },
          {
            path: resources.BlogCreate,
            element: <BlogEditorPage />,
            handle: { titleKey: 'pageTitles.blog' },
          },
          {
            path: resources.BlogEdit,
            element: <BlogEditorPage />,
            handle: { titleKey: 'pageTitles.blogPost', fallbackTitleKey: 'pageTitles.blog' },
          },
          {
            path: resources.BlogPost,
            element: <BlogPostPage />,
            handle: { titleKey: 'pageTitles.blogPost', fallbackTitleKey: 'pageTitles.blog' },
          },
          {
            path: resources.Settings,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsChangePassword,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsInformation,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsSocial,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsSkills,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsCareer,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsTeams,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsSystem,
            element: <AccountSettingsPage />,
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
        ],
      },

      {
        path: resources.Problem,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProblemDetailPage />
          </Suspense>
        ),
        handle: { titleKey: 'pageTitles.problem', fallbackTitleKey: 'pageTitles.problems' },
      },
      {
        path: resources.ContestProblem,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContestProblemPage />
          </Suspense>
        ),
        handle: { titleKey: 'pageTitles.contestProblem', fallbackTitleKey: 'pageTitles.contests' },
      },
      {
        path: resources.Duel,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DuelDetailPage />
          </Suspense>
        ),
        handle: { titleKey: 'pageTitles.duel', fallbackTitleKey: 'pageTitles.duels' },
      },

      ...legacyRedirectRoutes,

      {
        path: rootPaths.authRoot,
        element: <AuthLayout />,
        children: [
          {
            element: (
              <DefaultAuthLayout>
                <SuspenseOutlet />
              </DefaultAuthLayout>
            ),
            children: [
              {
                path: authPaths.login,
                element: <Login />,
                handle: { titleKey: 'pageTitles.login' },
              },
            ],
          },
        ],
      },

      {
        path: '*',
        element: <Page404 />,
        handle: { titleKey: 'pageTitles.notFound' },
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: '/',
});

export default router;
