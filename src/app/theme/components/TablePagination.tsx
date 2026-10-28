import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles';
import CustomTablePaginationAction from 'shared/components/pagination/CustomTablePaginationAction';

const TablePagination: Components<Omit<Theme, 'components'>>['MuiTablePagination'] = {
  defaultProps: {
    rowsPerPageOptions: [],
    labelDisplayedRows: () => null,
    ActionsComponent: CustomTablePaginationAction,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.vars.palette.background.elevation1,
      borderBottomLeftRadius: theme.preset === 'default' ? 0 : 16,
      borderBottomRightRadius: theme.preset === 'default' ? 0 : 16,
      ...(theme.preset === 'default' && {
        backgroundColor: 'transparent',
        borderTop: `1px solid ${theme.vars.palette.divider}`,
      }),
    }),
    toolbar: {
      paddingRight: '24px !important',
      minHeight: '46px !important',
    },
    spacer: {
      display: 'none',
    },
    actions: {
      marginLeft: 8,
      flex: 1,
    },
    selectLabel: {
      paddingLeft: 10,
      display: 'none',
    },
    input: {
      display: 'none',
    },
    displayedRows: { display: 'none' },
  },
};

export default TablePagination;
