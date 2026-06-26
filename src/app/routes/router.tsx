import { type ReactNode, Suspense } from 'react';
import { Navigate, Outlet, RouteObject, createBrowserRouter, useLocation } from 'react-router';
import App from 'app/App.tsx';
import AuthLayout from 'app/layouts/auth-layout';
import DefaultAuthLayout from 'app/layouts/auth-layout/DefaultAuthLayout';
import MainLayout from 'app/layouts/main-layout';
import { AccountSettingsPage } from 'modules/account-settings/ui/pages';
import {
  AdminContestFilterFormPage,
  AdminContestFiltersListPage,
  AdminContestFormPage,
  AdminContestQuestionFormPage,
  AdminContestQuestionsListPage,
  AdminContestTypeFormPage,
  AdminContestTypesListPage,
  AdminContestsListPage,
} from 'modules/admin/contests/ui/pages';
import {
  AdminProblemAttemptFormPage,
  AdminProblemAttemptsListPage,
  AdminProblemChapterFormPage,
  AdminProblemChaptersListPage,
  AdminProblemFormPage,
  AdminProblemTagFormPage,
  AdminProblemTagsListPage,
  AdminProblemsListPage,
} from 'modules/admin/problems/ui/pages';
import {
  AdminTeamFormPage,
  AdminTeamsListPage,
  AdminUserFormPage,
  AdminUsersListPage,
} from 'modules/admin/users/ui/pages';
import { ArenaDetailPage, ArenaListPage } from 'modules/arena/ui/pages';
import { LoginPage } from 'modules/authentication/ui/pages';
import { BlogEditorPage, BlogListPage, BlogPostPage } from 'modules/blog/ui/pages';
import { CalendarPage } from 'modules/calendar/ui/pages';
import {
  ChallengeDetailPage,
  ChallengesListPage,
  ChallengesRatingPage,
  ChallengesUserStatisticsPage,
} from 'modules/challenges/ui/pages';
import {
  ContestAttemptsPage,
  ContestPage,
  ContestProblemPage,
  ContestProblemsPage,
  ContestQuestionsPage,
  ContestRatingChangesPage,
  ContestRegistrantsPage,
  ContestStandingsPage,
  ContestStatisticsPage,
  ContestsListPage,
  ContestsRatingPage,
  ContestsUserStatisticsPage,
} from 'modules/contests/ui/pages';
import { DuelDetailPage, DuelsListPage, DuelsRatingPage } from 'modules/duels/ui/pages';
import { Page403, Page404, RouteErrorPage } from 'modules/errors/ui/pages';
import {
  HackathonAttemptsPage,
  HackathonPage,
  HackathonProjectPage,
  HackathonProjectsPage,
  HackathonRegistrantsPage,
  HackathonStandingsPage,
  HackathonsListPage,
} from 'modules/hackathons/ui/pages';
import { HomePage, UpdatesPage } from 'modules/home/ui/pages';
import { KepCoverPage } from 'modules/kep-cover/ui/pages';
import { KepcoinEarnPage, KepcoinPage } from 'modules/kepcoin/ui/pages';
import {
  ProblemDetailPage,
  ProblemsAttemptsPage,
  ProblemsListPage,
  ProblemsRatingHistoryPage,
  ProblemsRatingPage,
  ProblemsUserStatisticsPage,
  StudyPlanPage,
  StudyPlansPage,
} from 'modules/problems/ui/pages';
import { ProjectDetailPage, ProjectsListPage } from 'modules/projects/ui/pages';
import { ShopPage } from 'modules/shop/ui/pages';
import { TestDetailPage, TestPassPage, TestsListPage } from 'modules/testing/ui/pages';
import { TournamentPage, TournamentsListPage } from 'modules/tournaments/ui/pages';
import { UserProfilePage, UsersListPage } from 'modules/users/ui/pages';
import AuthGuard from 'shared/components/guard/AuthGuard';
import SuperuserGuard from 'shared/components/guard/SuperuserGuard';
import PageLoader from 'shared/components/loading/PageLoader';
import { legacyRedirectRoutes } from './legacy-routes';
import { resources } from './resources';
import { authPaths, rootPaths } from './route-config';
import { adminMenu } from './sitemap';

const IS_PROD = import.meta.env.PROD;

const withAuthGuard = (element: ReactNode) => <AuthGuard>{element}</AuthGuard>;
const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

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
    errorElement: IS_PROD ? <RouteErrorPage /> : undefined,
    children: [
      {
        path: resources.Admin,
        element: (
          <SuperuserGuard>
            <MainLayout menuItems={adminMenu}>
              <SuspenseOutlet />
            </MainLayout>
          </SuperuserGuard>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={resources.AdminProblems} replace />,
          },
          {
            path: 'problems',
            element: <AdminProblemsListPage />,
            handle: { titleKey: 'pageTitles.adminProblems' },
          },
          {
            path: 'problems/new',
            element: <AdminProblemFormPage />,
            handle: { titleKey: 'pageTitles.adminProblemCreate' },
          },
          {
            path: 'problems/attempts',
            element: <AdminProblemAttemptsListPage />,
            handle: { titleKey: 'pageTitles.adminProblemAttempts' },
          },
          {
            path: 'problems/attempts/new',
            element: <AdminProblemAttemptFormPage />,
            handle: { titleKey: 'pageTitles.adminProblemAttemptCreate' },
          },
          {
            path: 'problems/attempts/:id',
            element: <AdminProblemAttemptFormPage />,
            handle: { titleKey: 'pageTitles.adminProblemAttemptEdit' },
          },
          {
            path: 'problems/chapters',
            element: <AdminProblemChaptersListPage />,
            handle: { titleKey: 'pageTitles.adminProblemChapters' },
          },
          {
            path: 'problems/chapters/new',
            element: <AdminProblemChapterFormPage />,
            handle: { titleKey: 'pageTitles.adminProblemChapterCreate' },
          },
          {
            path: 'problems/chapters/:id',
            element: <AdminProblemChapterFormPage />,
            handle: { titleKey: 'pageTitles.adminProblemChapterEdit' },
          },
          {
            path: 'problems/tags',
            element: <AdminProblemTagsListPage />,
            handle: { titleKey: 'pageTitles.adminProblemTags' },
          },
          {
            path: 'problems/tags/new',
            element: <AdminProblemTagFormPage />,
            handle: { titleKey: 'pageTitles.adminProblemTagCreate' },
          },
          {
            path: 'problems/tags/:id',
            element: <AdminProblemTagFormPage />,
            handle: { titleKey: 'pageTitles.adminProblemTagEdit' },
          },
          {
            path: 'problems/:id',
            element: <AdminProblemFormPage />,
            handle: { titleKey: 'pageTitles.adminProblemEdit' },
          },
          {
            path: 'contests',
            element: <AdminContestsListPage />,
            handle: { titleKey: 'pageTitles.adminContests' },
          },
          {
            path: 'contests/new',
            element: <AdminContestFormPage />,
            handle: { titleKey: 'pageTitles.adminContestCreate' },
          },
          {
            path: 'contests/questions',
            element: <AdminContestQuestionsListPage />,
            handle: { titleKey: 'pageTitles.adminContestQuestions' },
          },
          {
            path: 'contests/questions/new',
            element: <AdminContestQuestionFormPage />,
            handle: { titleKey: 'pageTitles.adminContestQuestionCreate' },
          },
          {
            path: 'contests/questions/:id',
            element: <AdminContestQuestionFormPage />,
            handle: { titleKey: 'pageTitles.adminContestQuestionEdit' },
          },
          {
            path: 'contests/types',
            element: <AdminContestTypesListPage />,
            handle: { titleKey: 'pageTitles.adminContestTypes' },
          },
          {
            path: 'contests/types/new',
            element: <AdminContestTypeFormPage />,
            handle: { titleKey: 'pageTitles.adminContestTypeCreate' },
          },
          {
            path: 'contests/types/:id',
            element: <AdminContestTypeFormPage />,
            handle: { titleKey: 'pageTitles.adminContestTypeEdit' },
          },
          {
            path: 'contests/filters',
            element: <AdminContestFiltersListPage />,
            handle: { titleKey: 'pageTitles.adminContestFilters' },
          },
          {
            path: 'contests/filters/new',
            element: <AdminContestFilterFormPage />,
            handle: { titleKey: 'pageTitles.adminContestFilterCreate' },
          },
          {
            path: 'contests/filters/:id',
            element: <AdminContestFilterFormPage />,
            handle: { titleKey: 'pageTitles.adminContestFilterEdit' },
          },
          {
            path: 'contests/:id',
            element: <AdminContestFormPage />,
            handle: { titleKey: 'pageTitles.adminContestEdit' },
          },
          {
            path: 'users',
            element: <AdminUsersListPage />,
            handle: { titleKey: 'pageTitles.adminUsers' },
          },
          {
            path: 'users/new',
            element: <AdminUserFormPage />,
            handle: { titleKey: 'pageTitles.adminUserCreate' },
          },
          {
            path: 'users/teams',
            element: <AdminTeamsListPage />,
            handle: { titleKey: 'pageTitles.adminTeams' },
          },
          {
            path: 'users/teams/new',
            element: <AdminTeamFormPage />,
            handle: { titleKey: 'pageTitles.adminTeamCreate' },
          },
          {
            path: 'users/teams/:id',
            element: <AdminTeamFormPage />,
            handle: { titleKey: 'pageTitles.adminTeamEdit' },
          },
          {
            path: 'users/:id',
            element: <AdminUserFormPage />,
            handle: { titleKey: 'pageTitles.adminUserEdit' },
          },
        ],
      },
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
            element: <HomePage />,
            handle: { titleKey: 'pageTitles.home' },
          },
          {
            path: resources.Updates,
            element: <UpdatesPage />,
            handle: { titleKey: 'pageTitles.updates' },
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
          },
          {
            path: resources.Problems,
            element: <ProblemsListPage />,
            handle: { titleKey: 'pageTitles.problems' },
          },
          {
            path: resources.StudyPlans,
            element: <StudyPlansPage />,
            handle: { titleKey: 'pageTitles.studyPlans' },
          },
          {
            path: resources.StudyPlan,
            element: <StudyPlanPage />,
            handle: { titleKey: 'pageTitles.studyPlan', fallbackTitleKey: 'pageTitles.studyPlans' },
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
            element: withAuthGuard(<ProblemsUserStatisticsPage />),
            handle: { titleKey: 'pageTitles.problemsStats' },
          },
          {
            path: resources.Attempts,
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
            element: withAuthGuard(<TestPassPage />),
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
            element: withAuthGuard(<ChallengesUserStatisticsPage />),
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
            handle: {
              titleKey: 'pageTitles.arenaTournament',
              fallbackTitleKey: 'pageTitles.arena',
            },
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
            element: withAuthGuard(<ContestsUserStatisticsPage />),
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
            handle: {
              titleKey: 'pageTitles.contestProblems',
              fallbackTitleKey: 'pageTitles.contests',
            },
          },
          {
            path: resources.ContestAttempts,
            element: <ContestAttemptsPage />,
            handle: {
              titleKey: 'pageTitles.contestAttempts',
              fallbackTitleKey: 'pageTitles.contests',
            },
          },
          {
            path: resources.ContestStatistics,
            element: <ContestStatisticsPage />,
            handle: {
              titleKey: 'pageTitles.contestStatistics',
              fallbackTitleKey: 'pageTitles.contests',
            },
          },
          {
            path: resources.ContestStandings,
            element: <ContestStandingsPage />,
            handle: {
              titleKey: 'pageTitles.contestStandings',
              fallbackTitleKey: 'pageTitles.contests',
            },
          },
          {
            path: resources.ContestStandingsParticipant,
            element: <ContestStandingsPage />,
            handle: {
              titleKey: 'pageTitles.contestStandings',
              fallbackTitleKey: 'pageTitles.contests',
            },
          },
          {
            path: resources.ContestRegistrants,
            element: <ContestRegistrantsPage />,
            handle: {
              titleKey: 'pageTitles.contestRegistrants',
              fallbackTitleKey: 'pageTitles.contests',
            },
          },
          {
            path: resources.ContestRatingChanges,
            element: <ContestRatingChangesPage />,
            handle: {
              titleKey: 'pageTitles.contestRatingChanges',
              fallbackTitleKey: 'pageTitles.contests',
            },
          },
          {
            path: resources.ContestQuestions,
            element: <ContestQuestionsPage />,
            handle: {
              titleKey: 'pageTitles.contestQuestions',
              fallbackTitleKey: 'pageTitles.contests',
            },
          },
          {
            path: resources.Tournaments,
            element: <TournamentsListPage />,
            handle: { titleKey: 'pageTitles.tournaments' },
          },
          {
            path: resources.Tournament,
            element: <TournamentPage />,
            handle: {
              titleKey: 'pageTitles.tournament',
              fallbackTitleKey: 'pageTitles.tournaments',
            },
          },
          {
            path: resources.Shop,
            element: <ShopPage />,
            handle: { titleKey: 'pageTitles.shop' },
          },
          {
            path: resources.Kepcoin,
            element: withAuthGuard(<KepcoinPage />),
            handle: { titleKey: 'pageTitles.kepcoin' },
          },
          {
            path: resources.KepcoinEarn,
            element: withAuthGuard(<KepcoinEarnPage />),
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
            handle: {
              titleKey: 'pageTitles.hackathonProjects',
              fallbackTitleKey: 'pageTitles.hackathons',
            },
          },
          {
            path: resources.HackathonProject,
            element: <HackathonProjectPage />,
            handle: {
              titleKey: 'pageTitles.hackathonProject',
              fallbackTitleKey: 'pageTitles.hackathons',
            },
          },
          {
            path: resources.HackathonAttempts,
            element: <HackathonAttemptsPage />,
            handle: {
              titleKey: 'pageTitles.hackathonAttempts',
              fallbackTitleKey: 'pageTitles.hackathons',
            },
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
            handle: {
              titleKey: 'pageTitles.hackathonStandings',
              fallbackTitleKey: 'pageTitles.hackathons',
            },
          },
          {
            path: resources.Blog,
            element: <BlogListPage />,
            handle: { titleKey: 'pageTitles.blog' },
          },
          {
            path: resources.BlogCreate,
            element: withAuthGuard(<BlogEditorPage />),
            handle: { titleKey: 'pageTitles.blog' },
          },
          {
            path: resources.BlogEdit,
            element: withAuthGuard(<BlogEditorPage />),
            handle: { titleKey: 'pageTitles.blogPost', fallbackTitleKey: 'pageTitles.blog' },
          },
          {
            path: resources.BlogPost,
            element: <BlogPostPage />,
            handle: { titleKey: 'pageTitles.blogPost', fallbackTitleKey: 'pageTitles.blog' },
          },
          {
            path: resources.Settings,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsChangePassword,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsInformation,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsSocial,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsSkills,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsCareer,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsTeams,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsNotifications,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
          {
            path: resources.SettingsSystem,
            element: withAuthGuard(<AccountSettingsPage />),
            handle: { titleKey: 'pageTitles.accountSettings' },
          },
        ],
      },

      {
        path: resources.Problem,
        element: withSuspense(<ProblemDetailPage />),
        handle: { titleKey: 'pageTitles.problem', fallbackTitleKey: 'pageTitles.problems' },
      },
      {
        path: resources.ContestProblem,
        element: withSuspense(<ContestProblemPage />),
        handle: { titleKey: 'pageTitles.contestProblem', fallbackTitleKey: 'pageTitles.contests' },
      },
      {
        path: resources.Duel,
        element: withSuspense(<DuelDetailPage />),
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
                element: <LoginPage />,
                handle: { titleKey: 'pageTitles.login' },
              },
            ],
          },
        ],
      },

      {
        path: resources.Forbidden,
        element: <Page403 />,
        handle: { titleKey: 'pageTitles.forbidden' },
      },

      {
        path: resources.NotFound,
        element: <Page404 />,
        handle: { titleKey: 'pageTitles.notFound' },
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
