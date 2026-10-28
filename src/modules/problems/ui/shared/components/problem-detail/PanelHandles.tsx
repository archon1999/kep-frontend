import { useTranslation } from 'react-i18next';
import { PanelResizeHandle } from 'react-resizable-panels';
import { Box } from '@mui/material';

export const PanelHandle = ({
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
        transition: 'background-color 120ms ease',
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
export const VerticalHandle = () => <PanelHandle orientation="vertical" />;
