import type { Theme } from '@mui/material/styles';

export const workspaceRootStyles = (theme: Theme) => ({
  height: '100dvh',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  color: theme.vars.palette.text.primary,
  background: theme.vars.palette.background.default,
  '& *': { scrollbarWidth: 'thin' as const },
});

export const workspacePaneStyles = (theme: Theme) => ({
  height: '100%',
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
  position: 'relative' as const,
  background: theme.vars.palette.background.default,
});

export const workspaceToolbarStyles = (theme: Theme) => ({
  flexShrink: 0,
  minHeight: 45,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '4px 16px',
  borderBottom: `1px solid ${theme.vars.palette.divider}`,
  background: theme.vars.palette.background.default,
  '& .MuiOutlinedInput-root': { borderRadius: 0 },
  [theme.breakpoints.down('sm')]: { padding: '4px 12px', gap: '8px' },
});
