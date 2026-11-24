import { styled } from '@mui/material';
import { readingFontFamily } from 'app/theme/fonts';
import { dashboardStyles } from './dashboard.styles';
import { homeStyles } from './home.styles';
import { workspaceStyles } from './workspace.styles';

export const HomePageRoot = styled('div')(({ theme }) => [
  {
    display: 'contents',
    '--kep-home-ui-font':
      theme.preset === 'default' && theme.typography.fontFamily === readingFontFamily
        ? 'Inter, var(--kep-reading-font)'
        : 'var(--kep-reading-font)',
  },
  homeStyles,
  dashboardStyles,
  workspaceStyles,
]);
