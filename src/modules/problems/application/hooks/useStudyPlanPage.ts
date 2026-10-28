import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useStudyPlan } from 'modules/problems/application/queries.ts';

export const useStudyPlanPage = () => {
  const params = useParams<{ id: string }>();

  const studyPlanId = Number(params.id);

  const { data: studyPlan, isLoading } = useStudyPlan(
    Number.isNaN(studyPlanId) ? undefined : studyPlanId,
  );

  useDocumentTitle(
    studyPlan ? 'pageTitles.studyPlan' : undefined,
    studyPlan ? { studyPlanTitle: studyPlan.title } : undefined,
  );

  const solvedPercent = useMemo(() => {
    if (!studyPlan?.problemsCount) return 0;
    return Math.round((100 * (studyPlan.statistics.totalSolved ?? 0)) / studyPlan.problemsCount);
  }, [studyPlan?.problemsCount, studyPlan?.statistics.totalSolved]);
  return { studyPlan, isLoading, solvedPercent };
};
