import { PanelResizeHandle } from 'react-resizable-panels';
import { Box } from '@mui/material';

interface PanelHandleProps {
  orientation?: 'horizontal' | 'vertical';
}

export const PanelHandle = ({ orientation = 'horizontal' }: PanelHandleProps) => {
  const isVertical = orientation === 'vertical';

  return (
    <PanelResizeHandle
      style={{
        width: isVertical ? '100%' : 10,
        height: isVertical ? 10 : '100%',
        cursor: isVertical ? 'row-resize' : 'col-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: isVertical ? 48 : 2,
          height: isVertical ? 2 : 48,
          borderRadius: 1,
          bgcolor: 'divider',
        }}
      />
    </PanelResizeHandle>
  );
};

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
