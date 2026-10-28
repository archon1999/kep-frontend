import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonProjects } from 'modules/hackathons/application';

export const useHackathonProjectsPage = () => {
  const { id } = useParams();

  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);

  const { data: projects, isLoading, error } = useHackathonProjects(id);

  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonProjects' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );
  return { id, hackathon, isHackathonLoading, hackathonError, projects, isLoading, error };
};
