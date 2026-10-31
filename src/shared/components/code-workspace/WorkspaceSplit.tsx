import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Box } from '@mui/material';

export const WorkspaceResizeHandle = ({
  orientation = 'horizontal',
  disabled = false,
}: {
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
}) => {
  const { t } = useTranslation();
  const vertical = orientation === 'vertical';
  return (
    <Box
      component={PanelResizeHandle}
      disabled={disabled}
      aria-label={t('problems.workspace.resizePanels')}
      sx={{
        width: vertical ? '100%' : 7,
        height: vertical ? 7 : '100%',
        flexShrink: 0,
        display: disabled ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        cursor: vertical ? 'row-resize' : 'col-resize',
        borderBlock: vertical ? 1 : 0,
        borderInline: vertical ? 0 : 1,
        borderColor: 'divider',
        '&:hover, &:focus-visible, &[data-resize-handle-active]': {
          bgcolor: 'action.selected',
          outline: 0,
          '& > span': { bgcolor: 'primary.main' },
        },
      }}
    >
      <Box
        component="span"
        sx={{
          width: vertical ? 28 : '1px',
          height: vertical ? '1px' : 28,
          bgcolor: 'text.disabled',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export const WorkspaceSplit = ({
  editor,
  console,
  direction = 'vertical',
  autoSaveId,
}: {
  editor: ReactNode;
  console: ReactNode;
  direction?: 'horizontal' | 'vertical';
  autoSaveId?: string;
}) => (
  <PanelGroup direction={direction} autoSaveId={autoSaveId} style={{ flex: 1, minHeight: 0 }}>
    <Panel defaultSize={68} minSize={30}>
      {editor}
    </Panel>
    <WorkspaceResizeHandle orientation={direction} />
    <Panel defaultSize={32} minSize={20}>
      {console}
    </Panel>
  </PanelGroup>
);
