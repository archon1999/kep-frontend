import { ChangeEvent, forwardRef } from 'react';
import { TablePagination, useEventCallback } from '@mui/material';
import { GridSlotProps } from '@mui/x-data-grid';
import DataGridPaginationAction from './DataGridPaginationAction';
import TableLabelDisplayedRows from './TableLabelDisplayedRows';

type BasePaginationProps = GridSlotProps['basePagination'];

type DataGridPaginationProps = BasePaginationProps & {
  showFullPagination?: boolean;
};

const DataGridPagination = forwardRef<HTMLDivElement, DataGridPaginationProps>((props, ref) => {
  const { onRowsPerPageChange, showFullPagination = false, ...rest } = props;
  const rowsPerPageOptions = [10, 20, 50];

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={rowsPerPageOptions}
      ActionsComponent={(props) => (
        <DataGridPaginationAction showFullPagination={showFullPagination} {...props} />
      )}
      onRowsPerPageChange={useEventCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          onRowsPerPageChange?.(Number(event.target.value));
        },
      )}
      labelDisplayedRows={TableLabelDisplayedRows}
      {...rest}
      ref={ref}
    />
  );
});

DataGridPagination.displayName = 'DataGridPagination';

export default DataGridPagination;
