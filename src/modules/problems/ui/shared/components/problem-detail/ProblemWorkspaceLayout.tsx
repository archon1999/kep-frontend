import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { Alert, Box, Button, CircularProgress, LinearProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { PanelHandle } from 'modules/problems/ui/shared/components/problem-detail/PanelHandles';

type Props = {
  isMobile: boolean;
  showEditor: boolean;
  description: ReactNode;
  editor: ReactNode;
  tabs?: ReactNode;
  footer: ReactNode;
  loading: boolean;
  refreshing?: boolean;
  blockWhileRefreshing?: boolean;
  hasLoadError: boolean;
  onRetry: () => void;
};
export const ProblemWorkspaceLayout = ({
  isMobile,
  showEditor,
  description,
  editor,
  tabs,
  footer,
  loading,
  refreshing,
  blockWhileRefreshing = false,
  hasLoadError,
  onRetry,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minHeight: 0,
        minWidth: 0,
      }}
      aria-busy={loading || refreshing}
    >
      {loading || refreshing ? (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />
      ) : null}
      {refreshing && blockWhileRefreshing ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            bgcolor: (theme) =>
              alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.3 : 0.45),
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
        >
          <CircularProgress size={28} />
        </Box>
      ) : null}
      {hasLoadError ? (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert
            severity="error"
            action={
              <Button onClick={onRetry} disabled={loading}>
                {t('common.retry')}
              </Button>
            }
          >
            {t('common.loadFailed')}
          </Alert>
        </Box>
      ) : isMobile ? (
        <>
          {tabs}
          <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
            {showEditor ? editor : description}
          </Box>
          {footer}
        </>
      ) : (
        <PanelGroup direction="horizontal" style={{ flex: 1, minHeight: 0 }}>
          <Panel defaultSize={46} minSize={30}>
            {description}
          </Panel>
          <PanelHandle orientation="horizontal" />
          <Panel defaultSize={54} minSize={35}>
            {editor}
          </Panel>
        </PanelGroup>
      )}
    </Box>
  );
};
