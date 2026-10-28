import { useParams } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useProjectDetails } from 'modules/projects/application/queries';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { numberParam } from 'shared/lib/queryParams';

export const useProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentUser } = useAuth();
  const { state, setField } = useRouteQueryState({
    defaults: { activeTab: 0 },
    schema: { activeTab: { ...numberParam({ min: 0, max: 2 }), param: 'tab' } },
    historyByKey: { activeTab: 'push' },
  });
  const {
    data: project,
    isLoading,
    error,
    mutate,
  } = useProjectDetails(slug, currentUser?.username);
  useDocumentTitle(
    project ? 'pageTitles.project' : undefined,
    project ? { projectTitle: project.title ?? '' } : undefined,
  );

  return {
    project,
    isLoading,
    hasError: Boolean(error),
    activeTab: state.activeTab,
    onTabChange: (value: number) => setField('activeTab', value),
    onRetry: () => {
      void mutate();
    },
    onSubmitted: () => {
      setField('activeTab', 1);
      void mutate();
    },
  };
};
