import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, Divider, Stack, Tab, Tabs } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
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
import { extractList } from 'modules/challenges/data-access/mappers/challenge.mapper.ts';
import { ChallengeCall } from 'modules/challenges/domain';
import { useArenasList } from 'modules/arena/application/queries.ts';
import { ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { toast } from 'sonner';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { booleanFlagParam, enumParam, numberParam } from 'shared/lib/queryParams';
import ChallengesListPageHeroCard from './ChallengesListPageHeroCard.tsx';
import ChallengesListPageHistoryTab from './ChallengesListPageHistoryTab.tsx';
import ChallengesListPageInsightsSection from './ChallengesListPageInsightsSection.tsx';
import ChallengesListPageQueueTab from './ChallengesListPageQueueTab.tsx';
import ChallengesListPageQuickStartTab from './ChallengesListPageQuickStartTab.tsx';

type ChallengesTab = 'quickstart' | 'queue' | 'history';

const quickStarts = [
  { timeSeconds: 60, questionsCount: 6 },
  { timeSeconds: 50, questionsCount: 5 },
  { timeSeconds: 40, questionsCount: 5 },
  { timeSeconds: 30, questionsCount: 6 },
];

type ChallengesListQueryState = {
  page: number;
  activeTab: ChallengesTab;
  onlyMine: boolean;
};

const ChallengesListPage = () => {
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

  const { data: calls, isLoading: isCallsLoading, mutate: mutateCalls } = useChallengeCalls();
  const normalizedCalls = extractList<ChallengeCall>(calls);
  const { data: challengesPage, isLoading: isChallengesLoading } = useChallengesList({
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
    pageSize: 10,
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

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4} direction="column">
        <ChallengesListPageHeroCard
          userRating={userRating}
          onOpenQuickStart={() => setField('activeTab', 'quickstart')}
        />

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ pb: 0 }}>
            <Tabs
              value={state.activeTab}
              onChange={(_, value) => setField('activeTab', value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="quickstart" label={t('challenges.quickStartTitle')} />
              <Tab value="queue" label={t('challenges.waitingRoom')} />
              <Tab value="history" label={t('challenges.recent')} />
            </Tabs>
          </CardContent>
          <Divider />
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {state.activeTab === 'quickstart' && (
              <ChallengesListPageQuickStartTab
                quickStarts={quickStarts}
                chapters={chapters}
                isCreating={isCreating}
                isAccepting={isAccepting}
                onQuickStart={handleQuickStart}
                onCreateCustom={handleCreate}
              />
            )}
            {state.activeTab === 'queue' && (
              <ChallengesListPageQueueTab
                calls={normalizedCalls}
                isLoading={isCallsLoading}
                onRefresh={mutateCalls}
                onAccepted={handleAccept}
                onRemoved={mutateCalls}
              />
            )}
            {state.activeTab === 'history' && (
              <ChallengesListPageHistoryTab
                challengesPage={challengesPage}
                isLoading={isChallengesLoading}
                page={state.page}
                onPageChange={handlePageChange}
                showOnlyMine={state.onlyMine}
                onToggleOnlyMine={handleToggleOnlyMine}
                isAuthenticated={Boolean(currentUser)}
                currentUsername={currentUser?.username}
              />
            )}
          </Box>
        </Card>

        <ChallengesListPageInsightsSection
          ratingPreview={ratingPreview}
          isRatingLoading={isRatingLoading}
          arenas={arenas}
          isArenasLoading={isArenasLoading}
        />
      </Stack>
    </Box>
  );
};

export default ChallengesListPage;
