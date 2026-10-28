import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useContest, useContestContestants } from 'modules/contests/application/queries';
import { ContestContestantsParams } from 'modules/contests/domain/contracts/contests.repository';
import useGridPagination from 'shared/hooks/useGridPagination';
import type { SortModel as GridSortModel } from 'shared/lib/grid-state';

const getContestantsOrdering = (sortModel: GridSortModel): ContestContestantsParams['ordering'] => {
  const sort = sortModel[0];
  if (!sort?.sort || (sort.field !== 'rank' && sort.field !== 'delta')) {
    return undefined;
  }

  return sort.sort === 'desc' ? `-${sort.field}` : sort.field;
};

export const useContestRatingChangesPage = () => {
  const { id } = useParams<{ id: string }>();

  const contestId = id ? Number(id) : undefined;

  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'rank', sort: 'asc' }]);

  const ordering = getContestantsOrdering(sortModel);

  const { data: contest, isLoading: isContestLoading, error: contestError } = useContest(contestId);

  const {
    data: contestants = [],
    isLoading,
    error: sectionError,
  } = useContestContestants(contestId, { ordering });

  useDocumentTitle(contest?.title, { contestTitle: contest?.title });

  const { paginationModel, onPaginationModelChange } = useGridPagination({
    initialPageSize: 20,
    querySync: {
      pageKey: 'page',
      pageSizeKey: 'pageSize',
    },
  });
  return {
    contest,
    isContestLoading,
    contestError,
    contestants,
    isLoading,
    sectionError,
    paginationModel,
    onPaginationModelChange,
    contestId,
    sortModel,
    setSortModel,
  };
};
