import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { useArenasList } from 'modules/arena/application/queries.ts';
import { ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import {
  useAcceptChallengeCall,
  useCreateChallengeCall,
} from 'modules/challenges/application/mutations.ts';
import {
  useChallengeCalls,
  useChallengeChapters,
  useChallengeUserRating,
  useChallengesList,
  useChallengesRating,
} from 'modules/challenges/application/queries.ts';
import { ChallengeCall } from 'modules/challenges/domain';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { booleanFlagParam, enumParam, numberParam } from 'shared/lib/queryParams';
import { toast } from 'sonner';

type ChallengesTab = 'quickstart' | 'queue' | 'history';

type ChallengesListQueryState = {
  page: number;
  activeTab: ChallengesTab;
  onlyMine: boolean;
};

export const useChallengesListPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const redirectToLogin = useLoginRedirect();

  useDocumentTitle('pageTitles.challenges');

  const { state, setField } = useRouteQueryState<ChallengesListQueryState>({
    defaults: {
      page: 1,
      activeTab: 'queue',
      onlyMine: false,
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: 'page',
      },
      activeTab: {
        ...enumParam(['quickstart', 'queue', 'history'] as const),
        param: 'tab',
      },
      onlyMine: {
        ...booleanFlagParam(),
        param: 'onlyMine',
      },
    },
    historyByKey: {
      page: 'push',
      activeTab: 'push',
    },
    pageResetKeys: ['activeTab', 'onlyMine'],
  });

  const pageSize = 7;

  const {
    data: calls,
    isLoading: isCallsLoading,
    error: callsError,
    mutate: mutateCalls,
  } = useChallengeCalls();

  const normalizedCalls = calls ?? [];

  const {
    data: challengesPage,
    isLoading: isChallengesLoading,
    error: challengesError,
    mutate: mutateChallenges,
  } = useChallengesList({
    page: state.page,
    pageSize,
    username: state.onlyMine && currentUser ? currentUser.username : undefined,
  });

  const { data: ratingPreview, isLoading: isRatingLoading } = useChallengesRating({
    page: 1,
    pageSize: 10,
    ordering: '-rating',
  });

  const { data: chapters } = useChallengeChapters();

  const { data: userRating } = useChallengeUserRating(currentUser?.username);

  const { data: arenas, isLoading: isArenasLoading } = useArenasList({
    status: ArenaStatus.Finished,
    pageSize: 5,
  });

  const { trigger: createCall, isMutating: isCreating } = useCreateChallengeCall();

  const { trigger: acceptCall, isMutating: isAccepting } = useAcceptChallengeCall();

  const handleCreate = async (payload: {
    timeSeconds: number;
    questionsCount: number;
    chapters?: number[];
  }) => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    await createCall(payload);
    await mutateCalls();
    setField('activeTab', 'queue');
    toast.success(t('challenges.callCreatedToast'));
  };

  const handleQuickStart = async (payload: { timeSeconds: number; questionsCount: number }) => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    const existing = normalizedCalls.find(
      (call: ChallengeCall) =>
        call.timeSeconds === payload.timeSeconds &&
        call.questionsCount === payload.questionsCount &&
        call.username !== currentUser?.username,
    );

    if (existing) {
      const result = await acceptCall(existing.id);
      if (result?.challengeId) {
        navigate(getResourceById(resources.Challenge, result.challengeId));
        return;
      }
    }

    await handleCreate(payload);
  };

  const handleAccept = (challengeId?: number) => {
    if (challengeId) navigate(getResourceById(resources.Challenge, challengeId));
    mutateCalls();
  };

  const handleToggleOnlyMine = (checked: boolean) => {
    setField('onlyMine', checked);
  };

  const handlePageChange = (value: number) => setField('page', value);
  return {
    currentUser,
    state,
    setField,
    isCallsLoading,
    callsError,
    challengesError,
    mutateChallenges,
    mutateCalls,
    challengesPage,
    isChallengesLoading,
    ratingPreview,
    isRatingLoading,
    chapters,
    userRating,
    arenas,
    isArenasLoading,
    isCreating,
    isAccepting,
    normalizedCalls,
    handleCreate,
    handleQuickStart,
    handleAccept,
    handleToggleOnlyMine,
    handlePageChange,
  };
};
