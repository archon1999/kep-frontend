import { useStudyPlans } from 'modules/problems/application/queries.ts';

export const useStudyPlansPage = () => {
  const { data: studyPlans, isLoading } = useStudyPlans();
  return { studyPlans, isLoading };
};
