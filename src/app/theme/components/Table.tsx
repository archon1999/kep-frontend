import { Theme, tableCellClasses, tableHeadClasses, tableRowClasses } from '@mui/material';
import { Components } from '@mui/material/styles';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { motion } from '../styles/transitions';

const Table: Components<Omit<Theme, 'components'>>['MuiTable'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '&.disable-edge-padding': {
        [`& .${tableHeadClasses.root}`]: {
          '& th': {
            backgroundColor: 'transparent',
          },
        },
        [`& .${tableCellClasses.head}`]: {
          borderBottom: `1px solid ${theme.vars.palette.dividerLight}`,
        },
        [`& .${tableRowClasses.root}`]: {
          '& td, & th': {
            '&:first-of-type': { paddingLeft: 0 },
            '&:last-of-type': { paddingRight: 0 },
          },
        },
      },
    }),
  },
};

export const TableContainer: Components<Omit<Theme, 'components'>>['MuiTableContainer'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderTopLeftRadius: theme.preset === 'default' ? 0 : 16,
      borderTopRightRadius: theme.preset === 'default' ? 0 : 16,
      minWidth: 0,
      maxWidth: '100%',
    }),
  },
};

export const TableRow: Components<Omit<Theme, 'components'>>['MuiTableRow'] = {
  defaultProps: {},
  styleOverrides: {
    root: ({ theme }) => ({
      transition: 'background-color 180ms ease',
      '&:not(.MuiTableRow-head):hover, &:not(.MuiTableRow-head):focus-within': {
        backgroundColor: theme.vars.palette.action.hover,
      },
      [motion.reduced]: { transition: 'none' },
      '& td, & th': {
        '&:first-of-type': { paddingLeft: 24 },
        '&:last-of-type': { paddingRight: 24 },
      },
      [theme.breakpoints.down('sm')]: {
        '& td, & th': {
          '&:first-of-type': { paddingLeft: 12 },
          '&:last-of-type': { paddingRight: 12 },
        },
      },
    }),
  },
};

export const TableHead: Components<Omit<Theme, 'components'>>['MuiTableHead'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& th': {
        backgroundColor: theme.vars.palette.background.elevation1,
        borderBottom: theme.preset === 'default' ? `1px solid ${theme.vars.palette.divider}` : 0,
        paddingTop: 12,
        paddingBottom: 12,
      },
    }),
  },
};

export const TableCell: Components<Omit<Theme, 'components'>>['MuiTableCell'] = {
  styleOverrides: {
    head: ({ theme }) => (theme.preset === 'default' ? { ...theme.typography.label } : {}),
    root: ({ theme }) => ({
      borderBottom: `1px solid ${theme.preset === 'default' ? theme.vars.palette.divider : theme.vars.palette.dividerLight}`,
      [`&.${tableCellClasses.body}`]: {
        color: theme.vars.palette.text.secondary,
        ...theme.typography.subtitle2,
        fontWeight: 400,
      },
    }),
    stickyHeader: ({ theme }) => ({
      backgroundColor: theme.vars.palette.background.elevation1,
    }),
  },
};
export const TableSortLabel: Components<Omit<Theme, 'components'>>['MuiTableSortLabel'] = {
  defaultProps: {
    IconComponent: (props) => <IconifyIcon icon="material-symbols:sort-rounded" {...props} />,
  },
  styleOverrides: {
    icon: {
      transition: `transform 220ms ${motion.easing}, opacity 160ms ease`,
      [motion.reduced]: { transition: 'none' },
    },
    iconDirectionAsc: {
      transform: 'rotateX(180deg)',
    },
  },
};

export default Table;
