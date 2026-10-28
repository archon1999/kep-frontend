import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceByParams, resources } from 'app/routes/resources';
import {
  cancelContestRegistration,
  registerForContest,
  startVirtualContest,
} from 'modules/contests/application/mutations';
import {
  useContest,
  useContestProblems,
  useContestStatisticsSummary,
} from 'modules/contests/application/queries';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { createNumberFormatter, normalizeNumberLocale } from 'shared/lib/numberFormat';

export const useContestPage = () => {
  const { id } = useParams<{ id: string }>();

  const contestId = id ? Number(id) : undefined;

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const redirectToLogin = useLoginRedirect();

  const {
    data: contest,
    mutate: mutateContest,
    isLoading: isContestLoading,
    error: contestError,
  } = useContest(contestId);

  const canLoadContestProblems = Boolean(
    contest && contest.statusCode !== ContestStatus.NotStarted,
  );

  const {
    data: contestProblems,
    isLoading: problemsLoading,
    error: problemsError,
  } = useContestProblems(contestId, undefined, canLoadContestProblems);

  const {
    data: statisticsSummary,
    isLoading: isStatisticsSummaryLoading,
    error: statisticsError,
  } = useContestStatisticsSummary(contestId);

  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);

  const [isVirtualLoading, setIsVirtualLoading] = useState(false);

  useDocumentTitle('pageTitles.contest', { contestTitle: contest?.title });

  const showProblemsPreview = canLoadContestProblems;

  const showStatisticsSummary = canLoadContestProblems;

  const canRegister = contest ? contest.statusCode !== ContestStatus.Finished : false;

  const isPreviewLoading = isContestLoading || (canLoadContestProblems && problemsLoading);

  const resolvedLocale = useMemo(() => normalizeNumberLocale(i18n.language), [i18n.language]);

  const integerFormatter = useMemo(
    () => createNumberFormatter({ maximumFractionDigits: 0 }, resolvedLocale),
    [resolvedLocale],
  );

  const percentFormatter = useMemo(
    () => createNumberFormatter({ maximumFractionDigits: 2 }, resolvedLocale),
    [resolvedLocale],
  );

  const overviewKpis = useMemo(
    () => [
      {
        key: 'participants',
        icon: 'users',
        label: t('contests.statisticsPage.participants'),
        value:
          statisticsSummary?.participants !== undefined
            ? integerFormatter.format(statisticsSummary.participants)
            : null,
      },
      {
        key: 'attempts',
        icon: 'attempts',
        label: t('contests.statisticsPage.totalAttempts'),
        value:
          statisticsSummary?.attempts?.total !== undefined
            ? integerFormatter.format(statisticsSummary.attempts.total)
            : null,
      },
      {
        key: 'accepted',
        icon: 'verdict',
        label: t('contests.statisticsPage.totalAccepted'),
        value:
          statisticsSummary?.accepted?.total !== undefined
            ? integerFormatter.format(statisticsSummary.accepted.total)
            : null,
      },
      {
        key: 'acceptance',
        icon: 'statistics',
        label: t('contests.statisticsPage.acceptance'),
        value:
          statisticsSummary?.acceptanceRate !== undefined
            ? `${percentFormatter.format(statisticsSummary.acceptanceRate)}%`
            : null,
      },
    ],
    [integerFormatter, percentFormatter, statisticsSummary, t],
  );

  const handleRegistrationToggle = useCallback(async () => {
    if (!contestId || !contest) return;
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    setIsRegistrationLoading(true);
    try {
      if (contest.userInfo?.isRegistered && contest.statusCode === ContestStatus.Already) {
        return;
      }

      if (contest.userInfo?.isRegistered) {
        await cancelContestRegistration(contest.id);
      } else {
        await registerForContest(contest.id);
      }
      await mutateContest();
    } finally {
      setIsRegistrationLoading(false);
    }
  }, [contest, contestId, currentUser, mutateContest, redirectToLogin]);

  const handleStartVirtualContest = useCallback(async () => {
    if (!contest) return;
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    setIsVirtualLoading(true);
    try {
      await startVirtualContest(contest.id);
      await mutateContest();
      navigate(getResourceByParams(resources.ContestProblems, { id: contest.id }));
    } finally {
      setIsVirtualLoading(false);
    }
  }, [contest, currentUser, mutateContest, navigate, redirectToLogin]);
  return {
    contest,
    mutateContest,
    isContestLoading,
    contestError,
    contestProblems,
    problemsError,
    isStatisticsSummaryLoading,
    statisticsError,
    handleRegistrationToggle,
    handleStartVirtualContest,
    contestId,
    showProblemsPreview,
    showStatisticsSummary,
    canRegister,
    isPreviewLoading,
    overviewKpis,
    isRegistrationLoading,
    isVirtualLoading,
  };
};
