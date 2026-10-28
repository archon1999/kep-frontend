import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import {
  useHackathon,
  useHackathonProjects,
  useHackathonStandings,
} from 'modules/hackathons/application';

export const useHackathonStandingsPage = () => {
  const { id } = useParams();

  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);

  const { data: standings, isLoading, error } = useHackathonStandings(id);

  const {
    data: projects,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useHackathonProjects(id);

  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonStandings' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );

  const rankedStandings = useMemo(() => {
    if (!standings) return [];
    let rank = 1;

    return [...standings]
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
      .map((participant, index, arr) => {
        if (index > 0 && participant.points !== arr[index - 1].points) rank = index + 1;
        return { ...participant, rank };
      });
  }, [standings]);
  return {
    hackathon,
    isHackathonLoading,
    hackathonError,
    isLoading,
    error,
    projects,
    isProjectsLoading,
    projectsError,
    rankedStandings,
  };
};
