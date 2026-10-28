import { useParams } from 'react-router';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useTournament } from 'modules/tournaments/application';

export const useTournamentPage = () => {
  const { id } = useParams();

  const { data: tournament, isLoading } = useTournament(id);

  useDocumentTitle(
    tournament?.title ? 'pageTitles.tournament' : undefined,
    tournament?.title
      ? {
          tournamentTitle: tournament.title,
        }
      : undefined,
  );
  return { tournament, isLoading };
};
