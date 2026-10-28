import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonRegistrants } from 'modules/hackathons/application';

export const useHackathonRegistrantsPage = () => {
  const { id } = useParams();

  const [search, setSearch] = useState('');

  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);

  const { data: registrants, isLoading, error } = useHackathonRegistrants(id);

  useDocumentTitle(
    hackathon?.title ? 'pageTitles.hackathonRegistrants' : undefined,
    hackathon?.title ? { hackathonTitle: hackathon.title } : undefined,
  );

  const filteredRegistrants = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return (registrants ?? [])
      .map((registrant, index) => ({ ...registrant, position: index + 1 }))
      .filter(
        (registrant) =>
          !query ||
          `${registrant.username} ${registrant.userFullName ?? ''}`
            .toLocaleLowerCase()
            .includes(query),
      );
  }, [registrants, search]);
  return {
    hackathon,
    isHackathonLoading,
    hackathonError,
    registrants,
    isLoading,
    error,
    filteredRegistrants,
    search,
    setSearch,
  };
};
