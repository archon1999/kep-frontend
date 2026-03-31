import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Button, Card, CardContent, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { authPaths } from 'app/routes/route-config';
import { useArenasList } from 'modules/arena/application/queries.ts';
import { ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import KepIcon from 'shared/components/base/KepIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { toast } from 'sonner';
import { useAcceptChallengeCall, useCreateChallengeCall } from '../../application/mutations.ts';
import {
  useChallengeCalls,
  useChallengeChapters,
  useChallengeUserRating,
  useChallengesList,
  useChallengesRating,
} from '../../application/queries.ts';
import { extractList } from '../../data-access/mappers/challenge.mapper.ts';
import { ChallengeCall } from '../../domain';
import ChallengesHistoryTab from '../components/ChallengesHistoryTab.tsx';
import ChallengesQueueTab from '../components/ChallengesQueueTab.tsx';
import ChallengesQuickStartTab from '../components/ChallengesQuickStartTab.tsx';
import ChallengesRatingPreviewCard from '../components/ChallengesRatingPreviewCard.tsx';
import ChallengesArenaWinnersCard from '../components/ChallengesArenaWinnersCard.tsx';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { booleanFlagParam, enumParam, numberParam } from 'shared/lib/queryParams';

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
      navigate(authPaths.login);
      return;
    }

    await createCall(payload);
    await mutateCalls();
    setField('activeTab', 'queue');
    toast.success(t('challenges.callCreatedToast'));
  };

  const handleQuickStart = async (payload: { timeSeconds: number; questionsCount: number }) => {
    if (!currentUser) {
      navigate(authPaths.login);
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
        <Card
          sx={{
            borderRadius: 4,
            p: { xs: 2.5, md: 3 },
            background: 'linear-gradient(120deg, rgba(25,118,210,0.08), rgba(0,171,85,0.12))',
            border: '1px solid',
            borderColor: 'primary.lighter',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={1.5} direction="column">
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="challenges" fontSize={30} color="primary.main" />
                <Typography variant="h4" fontWeight={800}>
                  {t('challenges.title')}
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                {t('challenges.subtitle')}
              </Typography>
            </Stack>

            <Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  variant="text"
                  startIcon={<KepIcon name="challenge-time" fontSize={18} />}
                  onClick={() => setField('activeTab', 'quickstart')}
                >
                  {t('challenges.quickStartTitle')}
                </Button>
                <Button
                  variant="text"
                  startIcon={<KepIcon name="ranking" fontSize={18} />}
                  onClick={() => navigate(resources.ChallengesRating)}
                >
                  {t('challenges.viewRating')}
                </Button>
                <Button
                  variant="text"
                  startIcon={<KepIcon name="statistics" fontSize={18} />}
                  onClick={() => navigate(resources.ChallengesUserStatistics)}
                >
                  {t('challenges.statisticsTitle')}
                </Button>
              </Stack>

              {userRating && (
                <>
                  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    <Typography variant="h3" fontWeight={800}>
                      {userRating.rating}
                    </Typography>
                    <ChallengesRatingChip title={userRating.rankTitle} />
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Typography color="success">
                        {userRating.wins}W
                      </Typography>
                      <Typography color="textSecondary">
                        {userRating.draws}D
                      </Typography>
                      <Typography color="error">
                        {userRating.losses}L
                      </Typography>
                    </Stack>

                  </Stack>
                </>
              )}
            </Stack>
          </Stack>
        </Card>

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
              <ChallengesQuickStartTab
                quickStarts={quickStarts}
                chapters={chapters}
                isCreating={isCreating}
                isAccepting={isAccepting}
                onQuickStart={handleQuickStart}
                onCreateCustom={handleCreate}
              />
            )}
            {state.activeTab === 'queue' && (
              <ChallengesQueueTab
                calls={normalizedCalls}
                isLoading={isCallsLoading}
                onRefresh={mutateCalls}
                onAccepted={handleAccept}
                onRemoved={mutateCalls}
              />
            )}
            {state.activeTab === 'history' && (
              <ChallengesHistoryTab
                challengesPage={challengesPage}
                isLoading={isChallengesLoading}
                page={state.page}
                onPageChange={handlePageChange}
                showOnlyMine={state.onlyMine}
                onToggleOnlyMine={handleToggleOnlyMine}
                isAuthenticated={Boolean(currentUser)}
              />
            )}
          </Box>
        </Card>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ChallengesRatingPreviewCard ratingPreview={ratingPreview} isLoading={isRatingLoading} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ChallengesArenaWinnersCard arenas={arenas} isLoading={isArenasLoading} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ChallengesListPage;
