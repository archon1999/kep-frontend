import {
  gridPageCountSelector,
  gridPaginationModelSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import {
  ListPagination,
  RouteListPagination,
} from 'shared/components/sections/common/FramedListPage';

/** Adapt DataGrid's zero-based pagination to the reference list control. */
const DataGridListPagination = ({ routePagination = false }: { routePagination?: boolean }) => {
  const apiRef = useGridApiContext();
  const { page } = useGridSelector(apiRef, gridPaginationModelSelector);
  const count = useGridSelector(apiRef, gridPageCountSelector);
  const Pagination = routePagination ? RouteListPagination : ListPagination;
  return (
    <Pagination
      page={page + 1}
      count={count}
      onChange={(value) => apiRef.current.setPage(value - 1)}
    />
  );
};

export const RouteDataGridListPagination = () => <DataGridListPagination routePagination />;

export default DataGridListPagination;
