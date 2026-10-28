import type { CSSObject } from '@mui/material/styles';

/** Component-scoped layout and decoration; shared controls use the MUI theme. */
export const filterStyles: CSSObject[] = [
  {
    '&.contests-filter-controls, & .contests-filter-controls': {
      display: 'flex',
      alignItems: 'center',
      flex: '1',
      flexWrap: 'wrap',
      minWidth: '0',
      gap: '8px',
    },
  },
  {
    '&.contests-inline-filter, & .contests-inline-filter, &.contests-clear-filters, & .contests-clear-filters':
      {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '0',
        padding: '7px 10px',
        border: '1px solid var(--kep-line)',
        borderRadius: '0',
        background: 'transparent',
        color: 'var(--kep-muted)',
        font: '500 12px/1.4 var(--kep-font-family)',
        cursor: 'pointer',
      },
  },
  {
    '&.contests-inline-filter > span, & .contests-inline-filter > span': {
      maxWidth: '180px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  {
    '&.contests-inline-filter svg, & .contests-inline-filter svg': {
      color: 'var(--kep-logo-ice)',
      flexShrink: '0',
    },
  },
  {
    '&.contests-inline-filter:hover, & .contests-inline-filter:hover, &.contests-clear-filters:hover, & .contests-clear-filters:hover':
      {
        borderColor: 'var(--kep-logo-ice)',
        color: 'var(--kep-text)',
      },
  },
  {
    '&.contests-inline-filter:focus-visible, & .contests-inline-filter:focus-visible, &.contests-clear-filters:focus-visible, & .contests-clear-filters:focus-visible':
      {
        outline: '2px solid var(--kep-logo-ice)',
        outlineOffset: '3px',
      },
  },
  {
    '@media (max-width: 600px)': {
      '&.contests-filter-controls, & .contests-filter-controls': { flexBasis: '100%' },
      '&.contests-inline-filter > span, & .contests-inline-filter > span': { maxWidth: '150px' },
    },
  },
];
