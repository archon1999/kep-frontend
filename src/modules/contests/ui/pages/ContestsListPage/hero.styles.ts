import type { CSSObject } from '@mui/material/styles';
import { listContentStyles, listFrameStyles } from 'app/theme/styles/listPage';

export const heroStyles: CSSObject[] = [
  {
    '&.contests-list-page, & .contests-list-page': {
      ...listFrameStyles,
      '--contest-reading-font': 'var(--kep-reading-font)',
    },
    '&.contests-list-content, & .contests-list-content': listContentStyles,
    '&.contests-list-toolbar, & .contests-list-toolbar, &.contests-list-shortcuts, & .contests-list-shortcuts':
      {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      },
    '&.contests-list-toolbar, & .contests-list-toolbar': {
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      padding: '16px var(--kep-content-inset)',
    },
    '&.contests-list-shortcuts, & .contests-list-shortcuts': { flexWrap: 'wrap' },
    '&.contests-list-toolbar .MuiButton-root, & .contests-list-toolbar .MuiButton-root': {
      minHeight: '40px',
      borderRadius: '999px',
    },
    '@media (max-width: 540px)': {
      '&.contests-list-toolbar, & .contests-list-toolbar': { gap: '12px', paddingBlock: '14px' },
      '&.contests-list-shortcuts, & .contests-list-shortcuts': { gap: '10px' },
    },
  },
];
