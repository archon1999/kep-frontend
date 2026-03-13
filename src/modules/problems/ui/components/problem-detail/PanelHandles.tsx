import { Box } from '@mui/material';
import { PanelResizeHandle } from 'react-resizable-panels';

export const PanelHandle = () => (
  <PanelResizeHandle
    style={{
      width: 10,
      cursor: 'col-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        height: 48,
        width: 2,
        borderRadius: 1,
        bgcolor: 'divider',
      }}
    />
  </PanelResizeHandle>
);

export const VerticalHandle = () => (
  <PanelResizeHandle
    style={{
      height: 10,
      cursor: 'row-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 2,
        borderRadius: 1,
        bgcolor: 'divider',
      }}
    />
  </PanelResizeHandle>
);
