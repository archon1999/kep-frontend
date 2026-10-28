import { useParams } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthProvider';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useDuelDetail } from 'modules/duels/application/queries.ts';

export const useDuelDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { currentUser } = useAuth();

  const duelId = Number(id);

  const {
    data: duel,
    error: duelError,
    isLoading,
    isValidating,
    mutate: mutateDuel,
  } = useDuelDetail(Number.isNaN(duelId) ? undefined : duelId);

  useDocumentTitle(
    duel?.playerFirst?.username ? 'pageTitles.duel' : undefined,
    duel
      ? {
          playerFirstUsername: duel.playerFirst.username,
          playerSecondUsername: duel.playerSecond?.username ?? '',
        }
      : undefined,
  );
  return { currentUser, duel, duelError, isLoading, isValidating, mutateDuel };
};
