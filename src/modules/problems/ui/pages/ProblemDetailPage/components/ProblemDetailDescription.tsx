import type { useProblemDetailPage } from 'modules/problems/application/hooks/useProblemDetailPage';
import { getDifficultyColor } from 'modules/problems/config/difficulty';
import { ProblemDescription } from 'modules/problems/ui/shared/components/problem-detail/ProblemDescription';
import ProblemDescriptionSkeleton from 'modules/problems/ui/shared/components/problem-detail/ProblemDescriptionSkeleton';

type Props = {
  model: Pick<
    ReturnType<typeof useProblemDetailPage>,
    | 'problem'
    | 'selectedLanguage'
    | 'showInitialSkeleton'
    | 'activeTab'
    | 'handleTabChange'
    | 'myAttemptsOnly'
    | 'handleToggleMyAttempts'
    | 'attemptsLangFilter'
    | 'attemptsVerdictFilter'
    | 'handleAttemptsLangFilterChange'
    | 'handleAttemptsVerdictFilterChange'
    | 'attemptsPagination'
    | 'onAttemptsPaginationChange'
    | 'attemptsPage'
    | 'mutateAttempts'
    | 'isAttemptsLoading'
    | 'handleFavoriteToggle'
    | 'handleLikeDislike'
  >;
  isMobileDetail: boolean;
};
export const ProblemDetailDescription = ({ model, isMobileDetail }: Props) => {
  const {
    problem,
    selectedLanguage,
    showInitialSkeleton,
    activeTab,
    handleTabChange,
    myAttemptsOnly,
    handleToggleMyAttempts,
    attemptsLangFilter,
    attemptsVerdictFilter,
    handleAttemptsLangFilterChange,
    handleAttemptsVerdictFilterChange,
    attemptsPagination,
    onAttemptsPaginationChange,
    attemptsPage,
    mutateAttempts,
    isAttemptsLoading,
    handleFavoriteToggle,
    handleLikeDislike,
  } = model;
  const selectedDifficultyColor = getDifficultyColor(problem?.difficulty);
  return problem && !showInitialSkeleton ? (
    <ProblemDescription
      problem={problem}
      selectedDifficultyColor={selectedDifficultyColor}
      activeTab={activeTab === 'code' ? 'description' : activeTab}
      onTabChange={handleTabChange}
      hideTabs={isMobileDetail}
      myAttemptsOnly={myAttemptsOnly}
      onToggleMyAttempts={handleToggleMyAttempts}
      attemptsLangFilter={attemptsLangFilter}
      onAttemptsLangFilterChange={handleAttemptsLangFilterChange}
      attemptsVerdictFilter={attemptsVerdictFilter}
      onAttemptsVerdictFilterChange={handleAttemptsVerdictFilterChange}
      attempts={attemptsPage?.data ?? []}
      attemptsTotal={attemptsPage?.total ?? 0}
      attemptsPagination={attemptsPagination}
      onAttemptsPaginationChange={onAttemptsPaginationChange}
      isAttemptsLoading={isAttemptsLoading}
      onAttemptsRefresh={() => mutateAttempts()}
      onFavoriteToggle={handleFavoriteToggle}
      onLike={() => handleLikeDislike('like')}
      onDislike={() => handleLikeDislike('dislike')}
      selectedLanguage={selectedLanguage}
    />
  ) : (
    <ProblemDescriptionSkeleton />
  );
};
