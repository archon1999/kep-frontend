import { TablePaginationOwnProps } from '@mui/material';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';

/** Keep MUI table pagination on the same control as framed lists. */
const CustomTablePaginationAction = ({
  page,
  rowsPerPage,
  count,
  onPageChange,
  disabled,
}: TablePaginationOwnProps) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage) || 1);
  return (
    <ListPagination
      page={Math.min(page + 1, totalPages)}
      count={totalPages}
      disabled={disabled}
      onChange={(value) => onPageChange?.(null, value - 1)}
    />
  );
};

export default CustomTablePaginationAction;
