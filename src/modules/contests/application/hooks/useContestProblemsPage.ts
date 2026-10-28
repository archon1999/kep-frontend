import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestProblems } from 'modules/contests/application/queries';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';

export const useContestProblemsPage = () => {
  const { id } = useParams<{ id: string }>();

  const contestId = id ? Number(id) : undefined;

  const { data: contest, isLoading: isContestLoading, error: contestError } = useContest(contestId);

  const canLoad = Boolean(contest && contest.statusCode !== ContestStatus.NotStarted);

  const {
    data: problems = [],
    isLoading,
    error,
  } = useContestProblems(contestId, undefined, canLoad);

  useDocumentTitle(contest?.title ? 'pageTitles.contestProblems' : undefined, {
    contestTitle: contest?.title,
  });

  const loading = isContestLoading || (canLoad && isLoading);
  return { contest, isContestLoading, contestError, problems, error, contestId, canLoad, loading };
};
