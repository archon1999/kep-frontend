import { styled } from '@mui/material';
import { dashboardStyles } from './dashboard.styles';
import { homeStyles } from './home.styles';
import { workspaceStyles } from './workspace.styles';

export const HomePageRoot = styled('div')(() => [
  { display: 'contents' },
  homeStyles,
  dashboardStyles,
  workspaceStyles,
]);
