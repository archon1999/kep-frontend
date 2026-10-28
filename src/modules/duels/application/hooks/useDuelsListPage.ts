import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useDuelsRating } from 'modules/duels/application/queries.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { enumParam } from 'shared/lib/queryParams';

type DuelsTab = 'my_duels' | 'waiting_room' | 'history';

type DuelsListQueryState = {
  activeTab: DuelsTab;
};

export const useDuelsListPage = () => {
  const { currentUser } = useAuth();

  const redirectToLogin = useLoginRedirect();

  useDocumentTitle('pageTitles.duels');

  const { state, setField } = useRouteQueryState<DuelsListQueryState>({
    defaults: {
      activeTab: 'waiting_room',
    },
    schema: {
      activeTab: {
        ...enumParam(['my_duels', 'waiting_room', 'history'] as const),
        param: 'tab',
      },
    },
    historyByKey: {
      activeTab: 'push',
    },
  });

  const { data: ratingPage } = useDuelsRating({
    page: 1,
    pageSize: 1,
    pinCurrentUser: true,
  });

  const ratingRows = [...(ratingPage?.data ?? []), ...(ratingPage?.pinnedRows ?? [])];

  const currentUserRating = currentUser
    ? ratingRows.find((row) => row.user.username === currentUser.username)
    : undefined;
  return { currentUser, redirectToLogin, state, setField, currentUserRating };
};
