import { Box, styled } from '@mui/material';
import {
  workspacePaneStyles,
  workspaceRootStyles,
  workspaceToolbarStyles,
} from 'app/theme/styles/workspace';

export const WorkspaceRoot = styled(Box)(({ theme }) => workspaceRootStyles(theme)) as typeof Box;
export const WorkspacePane = styled(Box)(({ theme }) => workspacePaneStyles(theme)) as typeof Box;
export const WorkspaceToolbar = styled(Box)(({ theme }) =>
  workspaceToolbarStyles(theme),
) as typeof Box;
