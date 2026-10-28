import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestRegistrants } from 'modules/contests/application/queries';
import { ContestRegistrantsOrdering } from 'modules/contests/domain/enums/contest.enums';
import usePaginatedRouteState from 'shared/hooks/usePaginatedRouteState';
import useStableGridRowCount from 'shared/hooks/useStableGridRowCount';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';
import { enumParam } from 'shared/lib/queryParams';

type ContestRegistrantsQueryState = {
  ordering: ContestRegistrantsOrdering;
};

const registrantsOrderingValues = Object.values(ContestRegistrantsOrdering);

export const useContestRegistrantsPage = () => {
  const { id } = useParams<{ id: string }>();

  const contestId = id ? Number(id) : undefined;

  const { data: contest, isLoading: isContestLoading, error: contestError } = useContest(contestId);

  useDocumentTitle(contest?.title, { contestTitle: contest?.title });

  const { state, patchFilters, paginationModel, onPaginationModelChange, pageParams } =
    usePaginatedRouteState<ContestRegistrantsQueryState>({
      initialPageSize: 20,
      defaults: {
        ordering: ContestRegistrantsOrdering['-contests_rating'],
      },
      schema: {
        ordering: {
          ...enumParam(registrantsOrderingValues),
          param: 'ordering',
        },
      },
    });

  const setOrdering = (ordering: typeof state.ordering) => patchFilters({ ordering });

  const ordering = state.ordering;

  const sortModel = useMemo<GridSortModel>(() => {
    if (
      ordering === ContestRegistrantsOrdering.id ||
      ordering === ContestRegistrantsOrdering['-id']
    ) {
      return [
        {
          field: 'rowIndex',
          sort: ordering === ContestRegistrantsOrdering.id ? 'asc' : 'desc',
        },
      ];
    }

    if (
      ordering === ContestRegistrantsOrdering.contests_rating ||
      ordering === ContestRegistrantsOrdering['-contests_rating']
    ) {
      return [
        {
          field: 'rating',
          sort: ordering === ContestRegistrantsOrdering.contests_rating ? 'asc' : 'desc',
        },
      ];
    }

    return [
      {
        field: 'username',
        sort: ordering === ContestRegistrantsOrdering.username ? 'asc' : 'desc',
      },
    ];
  }, [ordering]);

  const {
    data: registrantsPage,
    isLoading,
    error: sectionError,
  } = useContestRegistrants(contestId, {
    page: pageParams.page,
    pageSize: pageParams.pageSize,
    ordering,
  });

  const total = registrantsPage?.total ?? 0;

  const stableRowCount = useStableGridRowCount(total, isLoading);

  const registrants = registrantsPage?.data ?? [];

  const handleSortChange = (model: GridSortModel) => {
    if (!model.length) {
      setOrdering(ContestRegistrantsOrdering['-contests_rating']);
      return;
    }

    const { field, sort } = model[0];
    if (field === 'rowIndex') {
      setOrdering(
        sort === 'asc' ? ContestRegistrantsOrdering.id : ContestRegistrantsOrdering['-id'],
      );
      return;
    }
    if (field === 'rating') {
      setOrdering(
        sort === 'asc'
          ? ContestRegistrantsOrdering.contests_rating
          : ContestRegistrantsOrdering['-contests_rating'],
      );
      return;
    }
    if (field === 'username') {
      setOrdering(
        sort === 'asc'
          ? ContestRegistrantsOrdering.username
          : ContestRegistrantsOrdering['-username'],
      );
      return;
    }
    setOrdering(ContestRegistrantsOrdering['-contests_rating']);
  };
  return {
    contest,
    isContestLoading,
    contestError,
    paginationModel,
    onPaginationModelChange,
    isLoading,
    sectionError,
    stableRowCount,
    contestId,
    sortModel,
    registrants,
    handleSortChange,
  };
};
