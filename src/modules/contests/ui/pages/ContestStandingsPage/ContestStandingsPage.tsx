import { Suspense, lazy, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContestStandingsPage } from 'modules/contests/application/hooks/useContestStandingsPage';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import ContestStandingsCountdown from 'modules/contests/ui/shared/components/ContestStandingsCountdown';
import {
  contestHasPenalties,
  contestUsesRating,
} from 'modules/contests/ui/shared/utils/contestType';
import DialogLoading from 'shared/components/loading/DialogLoading';
import ContestStandingsControls from './components/ContestStandingsControls';
import ContestStandingsTable from './components/ContestStandingsTable';
import ContestExclusionDialog from './dialogs/ContestExclusionDialog';

const ContestantResultsDialog = lazy(() => import('./ContestantResultsDialog'));
const ContestReplayDialog = lazy(() => import('./dialogs/ContestReplayDialog'));

const ContestStandingsPage = () => {
  const { t } = useTranslation();
  const {
    contestId,
    contest,
    isContestLoading,
    error,
    contestProblems,
    contestFilters,
    selectedFilter,
    followingOnly,
    officialOnly,
    activeFiltersCount,
    participantUsername,
    participantTarget,
    standingsPage,
    contestants,
    total,
    isLoading,
    paginationModel,
    onPaginationModelChange,
    currentUsername,
    canModerate,
    canSelectFinalists,
    onFiltersChange,
    onClearFilters,
  } = useContestStandingsPage();
  const [selectedContestant, setSelectedContestant] = useState<ContestantEntity | null>(null);
  const [moderation, setModeration] = useState<{
    contestId: number;
    contestant: ContestantEntity;
  } | null>(null);
  const moderationTarget = moderation?.contestId === contestId ? moderation?.contestant : null;
  const openModeration = useCallback(
    (contestant: ContestantEntity) => {
      if (contestId) setModeration({ contestId, contestant });
    },
    [contestId],
  );
  const [replayOpen, setReplayOpen] = useState(false);
  const [resultsRequested, setResultsRequested] = useState(false);
  const selectedContestantId =
    selectedContestant?.rowType !== 'upsolve' ? selectedContestant?.id : undefined;
  return (
    <ContestPageLayout
      flush
      error={error}
      header={
        <ContestPageHeader
          title={contest?.title ?? t('contests.tabs.standings')}
          contest={contest}
          contestId={contestId}
          isRated={contestUsesRating(contest?.type, contest?.isRated)}
          isLoading={isContestLoading}
          actions={
            <ContestStandingsControls
              contest={contest}
              contestFilters={contestFilters}
              selectedFilter={selectedFilter}
              followingOnly={followingOnly}
              officialOnly={officialOnly}
              activeFiltersCount={activeFiltersCount}
              onFiltersChange={onFiltersChange}
              onClearFilters={onClearFilters}
              onReplay={() => setReplayOpen(true)}
            />
          }
        />
      }
    >
      {contest ? <ContestStandingsCountdown contest={contest} /> : null}

      {replayOpen && contest?.statusCode === ContestStatus.Finished && contestId && (
        <Suspense fallback={<DialogLoading onClose={() => setReplayOpen(false)} />}>
          <ContestReplayDialog
            key={contestId}
            contestId={contestId}
            title={contest.title}
            contestType={contest.type}
            typeInfo={contest.typeInfo}
            problemDetails={contestProblems}
            showPenalties={contestHasPenalties(contest.type, contest.typeInfo)}
            onClose={() => setReplayOpen(false)}
          />
        </Suspense>
      )}

      <ContestStandingsTable
        contest={contest}
        contestId={contestId}
        contestProblems={contestProblems}
        contestants={contestants}
        total={total}
        isLoading={isLoading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        currentUsername={currentUsername}
        participantTarget={participantTarget}
        participantUsername={participantUsername}
        standingsPage={standingsPage}
        activeFiltersCount={activeFiltersCount}
        canModerate={canModerate}
        canSelectFinalists={canSelectFinalists}
        onModerate={openModeration}
        onContestantClick={(contestant) => {
          setResultsRequested(true);
          setSelectedContestant(contestant);
        }}
      />

      {canModerate && contestId && moderationTarget?.id && (
        <ContestExclusionDialog
          key={moderationTarget.id}
          contestId={contestId}
          contestant={moderationTarget}
          contestantId={moderationTarget.id}
          onClose={() => setModeration(null)}
        />
      )}

      {resultsRequested && (
        <Suspense
          fallback={
            selectedContestantId ? (
              <DialogLoading onClose={() => setSelectedContestant(null)} />
            ) : null
          }
        >
          <ContestantResultsDialog
            open={Boolean(selectedContestantId)}
            onClose={() => setSelectedContestant(null)}
            contestId={contestId}
            contestantId={selectedContestantId}
            contestant={selectedContestant}
            showPenalties={contestHasPenalties(contest?.type, contest?.typeInfo)}
          />
        </Suspense>
      )}
    </ContestPageLayout>
  );
};

export default ContestStandingsPage;
