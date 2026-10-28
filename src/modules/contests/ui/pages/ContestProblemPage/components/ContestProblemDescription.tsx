import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { getResourceByParams, resources } from 'app/routes/resources';
import type { useContestProblemPage } from 'modules/contests/application/hooks/useContestProblemPage';
import ProblemsAttemptsTable from 'modules/problems/ui/shared/components/ProblemsAttemptsTable.tsx';
import { ProblemBody } from 'modules/problems/ui/shared/components/problem-detail/ProblemBody';
import ProblemDescriptionSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemDescriptionSkeleton';
import ProblemIntro from 'modules/problems/ui/shared/components/problem-detail/ProblemIntro';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { WorkspacePane } from 'shared/components/sections/common/Workspace';
import ContestantResultsFooter from './ContestantResultsFooter';

type Props = {
  model: Pick<
    ReturnType<typeof useContestProblemPage>,
    | 'problem'
    | 'selectedLanguage'
    | 'isSubmitting'
    | 'showInitialSkeleton'
    | 'currentUser'
    | 'contest'
    | 'contestId'
    | 'contestant'
    | 'problemSymbol'
    | 'redirectToLogin'
    | 'activeTab'
    | 'sortedProblems'
    | 'attemptsPage'
    | 'attemptsPagination'
    | 'onAttemptsPaginationChange'
    | 'isAttemptsLoading'
    | 'mutateAttempts'
    | 'upsolveHref'
    | 'canOpenOriginalProblem'
  >;
  isNarrowLayout: boolean;
};
export const ContestProblemDescription = ({ model, isNarrowLayout }: Props) => {
  const {
    problem,
    selectedLanguage,
    isSubmitting,
    showInitialSkeleton,
    currentUser,
    contest,
    contestId,
    contestant,
    problemSymbol,
    redirectToLogin,
    activeTab,
    sortedProblems,
    attemptsPage,
    attemptsPagination,
    onAttemptsPaginationChange,
    isAttemptsLoading,
    mutateAttempts,
    upsolveHref,
    canOpenOriginalProblem,
  } = model;
  const { t } = useTranslation();
  const attemptsSectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (activeTab === 'attempts' && !isSubmitting)
      attemptsSectionRef.current?.scrollIntoView({ block: 'start' });
  }, [activeTab, isSubmitting, problem?.id, isNarrowLayout, showInitialSkeleton]);
  return problem && !showInitialSkeleton ? (
    <WorkspacePane component="section" aria-label={t('contests.problem.description')}>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
          <Stack spacing={2}>
            <ProblemIntro
              symbol={problemSymbol}
              title={problem.title}
              timeLimit={selectedLanguage?.timeLimit ?? problem.timeLimit ?? 0}
              memoryLimit={selectedLanguage?.memoryLimit ?? problem.memoryLimit ?? 0}
            />

            <ProblemBody problem={problem} />

            {isNarrowLayout && canOpenOriginalProblem && upsolveHref ? (
              <Button
                component={RouterLink}
                to={upsolveHref}
                variant="text"
                startIcon={<IconifyIcon icon="mdi:open-in-new" width={18} height={18} />}
                sx={{ alignSelf: 'flex-start' }}
              >
                {t('contests.problem.openOriginal')}
              </Button>
            ) : null}
          </Stack>
        </Box>
        <Box
          component="section"
          ref={attemptsSectionRef}
          aria-labelledby="contest-problem-attempts-title"
          sx={{ borderTop: 1, borderColor: 'divider' }}
        >
          <Typography
            id="contest-problem-attempts-title"
            component="h2"
            variant="body1"
            sx={{ px: { xs: 2, md: 3 }, py: 2, fontWeight: 600 }}
          >
            {t('contests.problem.myAttempts')}
          </Typography>
          {currentUser ? (
            !isAttemptsLoading && attemptsPage?.total === 0 ? (
              <Typography
                color="text.secondary"
                variant="body2"
                sx={{ px: { xs: 2, md: 3 }, pb: 3 }}
              >
                {t('common.dataGrid.noRows.problemAttempts')}
              </Typography>
            ) : (
              <ProblemsAttemptsTable
                surface="section"
                paginationStyle="list"
                mobileCards={isNarrowLayout}
                attempts={attemptsPage?.data ?? []}
                total={attemptsPage?.total ?? 0}
                paginationModel={attemptsPagination}
                onPaginationChange={onAttemptsPaginationChange}
                isLoading={isAttemptsLoading}
                onRerun={() => mutateAttempts()}
                showProblemColumn={false}
                showContestTimeSubmitted
                getProblemLink={(attempt) =>
                  getResourceByParams(resources.ContestProblem, {
                    id: contest?.id ?? contestId ?? '',
                    symbol: attempt.contestProblemSymbol ?? problemSymbol ?? '',
                  })
                }
              />
            )
          ) : (
            <Box sx={{ px: { xs: 2, md: 3 }, pb: 2 }}>
              <Button variant="outlined" onClick={() => redirectToLogin()}>
                {t('auth.login')}
              </Button>
            </Box>
          )}
        </Box>
        {isNarrowLayout ? (
          <ContestantResultsFooter
            contestant={contestant}
            contestProblems={sortedProblems}
            contestId={contest?.id ?? contestId}
            contestType={contest?.type}
            contestTypeInfo={contest?.typeInfo}
            isRated={contest?.isRated}
          />
        ) : null}
      </Box>

      {!isNarrowLayout ? (
        <ContestantResultsFooter
          contestant={contestant}
          contestProblems={sortedProblems}
          contestId={contest?.id ?? contestId}
          contestType={contest?.type}
          contestTypeInfo={contest?.typeInfo}
          isRated={contest?.isRated}
        />
      ) : null}
    </WorkspacePane>
  ) : (
    <ProblemDescriptionSkeleton />
  );
};
