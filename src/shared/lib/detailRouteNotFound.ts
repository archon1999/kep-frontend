import { matchPath } from 'react-router';
import { resources } from 'app/routes/resources';
import router from 'app/routes/router';

const detailRoutePatterns = [
  resources.Problem,
  resources.StudyPlan,
  resources.Contest,
  resources.ContestStandings,
  resources.ContestProblems,
  resources.ContestAttempts,
  resources.ContestStatistics,
  resources.ContestRegistrants,
  resources.ContestRatingChanges,
  resources.ContestQuestions,
  resources.ContestProblem,
  resources.Challenge,
  resources.Duel,
  resources.ArenaTournament,
  resources.Tournament,
  resources.Hackathon,
  resources.HackathonProjects,
  resources.HackathonProject,
  resources.HackathonAttempts,
  resources.HackathonRegistrants,
  resources.HackathonStandings,
  resources.Test,
  resources.TestPass,
  resources.Project,
  resources.BlogPost,
  resources.BlogEdit,
  resources.UserProfile,
  resources.UserProfileRatings,
  resources.UserProfileActivityHistory,
  resources.UserProfilePurchases,
  resources.UserProfileBlog,
  resources.UserProfileAchievements,
] as const;

let isRedirecting = false;

const getErrorStatus = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;
  if (typeof status === 'number') {
    return status;
  }

  const responseStatus = (error as { response?: { status?: unknown } }).response?.status;
  return typeof responseStatus === 'number' ? responseStatus : undefined;
};

const isDetailRoute = (pathname: string) =>
  detailRoutePatterns.some((pattern) => matchPath({ path: pattern, end: true }, pathname));

const getDetailRouteErrorResource = (errorStatus: number) => {
  if (errorStatus === 403) {
    return resources.Forbidden;
  }

  return resources.NotFound;
};

export const shouldRedirectDetailRouteToNotFound = (error: unknown, pathname?: string) => {
  const errorStatus = getErrorStatus(error);
  const currentPathname =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : undefined);

  if (
    !currentPathname ||
    currentPathname === resources.NotFound ||
    currentPathname === resources.Forbidden
  ) {
    return false;
  }

  if (!errorStatus || errorStatus < 400 || errorStatus >= 500) {
    return false;
  }

  return isDetailRoute(currentPathname);
};

export const redirectDetailRouteToNotFound = (error: unknown, pathname?: string) => {
  if (!shouldRedirectDetailRouteToNotFound(error, pathname) || isRedirecting) {
    return false;
  }

  const errorStatus = getErrorStatus(error);
  if (!errorStatus) {
    return false;
  }

  isRedirecting = true;

  void router.navigate(getDetailRouteErrorResource(errorStatus)).finally(() => {
    isRedirecting = false;
  });

  return true;
};
