import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestFinalists } from 'modules/contests/application/queries';

export function useContestFinalistsPage() {
  const { id } = useParams<{ id: string }>();
  const contestId = id ? Number(id) : undefined;
  const { data: contest, error: contestError, isLoading: contestLoading } = useContest(contestId);
  const {
    data: finalists,
    error: finalistsError,
    isLoading: finalistsLoading,
  } = useContestFinalists(contest?.finalistsEnabled ? contestId : undefined);

  useDocumentTitle(contest?.title ? 'pageTitles.contestFinalists' : undefined, {
    contestTitle: contest?.title,
  });

  return {
    contestId,
    contest,
    finalists,
    contestLoading,
    loading: contestLoading || finalistsLoading,
    error: contestError || finalistsError,
    notFound: !contestId || (contest && !contest.finalistsEnabled),
  };
}
