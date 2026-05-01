import { useGridApiContext } from '@mui/x-data-grid';
import CustomTablePaginationAction, {
  CustomTablePaginationActionProps,
} from './CustomTablePaginationAction';

const DataGridPaginationAction = (
  props: CustomTablePaginationActionProps & { pageSize?: number; rowCount?: number },
) => {
  const { page, rowsPerPage, pageSize, count, rowCount, ...rest } = props;
  const resolvedRowsPerPage = rowsPerPage ?? pageSize ?? 1;
  const resolvedCount = count ?? rowCount ?? 0;
  const apiRef = useGridApiContext();

  return (
    <>
      <CustomTablePaginationAction
        page={page}
        count={resolvedCount}
        rowsPerPage={resolvedRowsPerPage}
        onNextClick={() => apiRef.current.setPage(page + 1)}
        onPrevClick={() => apiRef.current.setPage(page - 1)}
        {...rest}
      />
    </>
  );
};

export default DataGridPaginationAction;
