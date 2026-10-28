import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon } from 'modules/hackathons/application';
import { useProjectAttempts } from 'modules/projects/application/queries';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';

export const useHackathonAttemptsPage = () => {
  const { id } = useParams();

  const hackathonId = id ? Number(id) : undefined;

  const { state, setField } = useRouteQueryState({
    defaults: { page: 1 },
    schema: { page: { ...numberParam({ min: 1 }), param: 'page' } },
    historyByKey: { page: 'push' },
  });

  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);

  const { data, isLoading, error, mutate } = useProjectAttempts(undefined, {
    page: state.page,
    hackathonId,
  });

  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonAttempts' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );
  return {
    state,
    setField,
    hackathon,
    isHackathonLoading,
    hackathonError,
    data,
    isLoading,
    error,
    mutate,
  };
};
