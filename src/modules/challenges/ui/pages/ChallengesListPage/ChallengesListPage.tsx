import { useTranslation } from 'react-i18next';
import { Box, Divider, Stack } from '@mui/material';
import { useChallengesListPage } from 'modules/challenges/application/hooks/useChallengesListPage';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import FramedPage from 'shared/components/sections/common/FramedPage';
import ChallengesListPageHeroCard from './ChallengesListPageHeroCard.tsx';
import ChallengesListPageHistoryTab from './ChallengesListPageHistoryTab.tsx';
import ChallengesListPageInsightsSection from './ChallengesListPageInsightsSection.tsx';
import ChallengesListPageQueueTab from './ChallengesListPageQueueTab.tsx';
import ChallengesListPageQuickStartTab from './ChallengesListPageQuickStartTab.tsx';

const quickStarts = [
  { timeSeconds: 60, questionsCount: 6 },
  { timeSeconds: 50, questionsCount: 5 },
  { timeSeconds: 40, questionsCount: 5 },
  { timeSeconds: 30, questionsCount: 6 },
];

const ChallengesListPage = () => {
  const {
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
  } = useChallengesListPage();

  const { t } = useTranslation();
  const tabs = [
    { value: 'quickstart' as const, label: t('challenges.quickStartTitle') },
    { value: 'queue' as const, label: t('challenges.waitingRoom') },
    { value: 'history' as const, label: t('challenges.recent') },
  ];

  return (
    <FramedPage>
      <Stack spacing={0} direction="column">
        <ChallengesListPageHeroCard
          userRating={userRating}
          onOpenQuickStart={() => setField('activeTab', 'quickstart')}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 340px' },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ px: 'var(--kep-content-inset)', py: 1 }}>
              <ResponsiveTabs
                value={state.activeTab}
                onChange={(value) => setField('activeTab', value)}
                items={tabs}
                ariaLabel={t('challenges.title')}
                tabsProps={{
                  variant: 'scrollable',
                  scrollButtons: 'auto',
                }}
              />
            </Box>
            <Divider />
            <Box sx={{ p: 'var(--kep-content-inset)' }}>
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
                  error={callsError}
                  onOpenQuickStart={() => setField('activeTab', 'quickstart')}
                  onRefresh={mutateCalls}
                  onAccepted={handleAccept}
                  onRemoved={mutateCalls}
                />
              )}
              {state.activeTab === 'history' && (
                <ChallengesListPageHistoryTab
                  challengesPage={challengesPage}
                  isLoading={isChallengesLoading}
                  error={challengesError}
                  onRetry={() => void mutateChallenges()}
                  page={state.page}
                  onPageChange={handlePageChange}
                  showOnlyMine={state.onlyMine}
                  onToggleOnlyMine={handleToggleOnlyMine}
                  isAuthenticated={Boolean(currentUser)}
                  currentUsername={currentUser?.username}
                />
              )}
            </Box>
          </Box>

          <ChallengesListPageInsightsSection
            ratingPreview={ratingPreview}
            isRatingLoading={isRatingLoading}
            arenas={arenas}
            isArenasLoading={isArenasLoading}
          />
        </Box>
      </Stack>
    </FramedPage>
  );
};

export default ChallengesListPage;
