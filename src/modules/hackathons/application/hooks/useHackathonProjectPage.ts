import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonProject } from 'modules/hackathons/application';

export const useHackathonProjectPage = () => {
  const { id, symbol } = useParams();
  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
    mutate: refreshHackathon,
  } = useHackathon(id);
  const { data: hackathonProject, isLoading, error, mutate } = useHackathonProject(id, symbol);
  const project = hackathonProject?.project;
  const canOpenWorkspace = Boolean(
    hackathon && hackathon.id > 0 && hackathon.id === Number(id) && !hackathonError,
  );
  useDocumentTitle(
    project?.title ? 'pageTitles.hackathonProject' : undefined,
    project?.title ? { projectTitle: project.title } : undefined,
  );

  const onRefresh = () => {
    void mutate();
    void refreshHackathon();
  };

  return {
    id,
    project,
    hackathon,
    hackathonProject,
    canOpenWorkspace,
    isLoading: isLoading || isHackathonLoading,
    error: error || hackathonError,
    hasProjectError: Boolean(error),
    onRefresh,
  };
};
