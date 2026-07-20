import { Box, Stack, Typography, alpha } from '@mui/material';
import { GridOverlayProps, useGridRootProps } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

const DEFAULT_MUI_NO_ROWS_LABEL = 'No rows';

export interface DataGridNoRowsOverlayProps extends GridOverlayProps {
  title?: string;
  description?: string;
  filteredDescription?: string;
  filtered?: boolean;
}

declare module '@mui/x-data-grid' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface NoRowsOverlayPropsOverrides extends DataGridNoRowsOverlayProps {}
}

export const hasDataGridActiveFilters = (filters: Record<string, unknown>) =>
  Object.values(filters).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return Boolean(value);
  });

export const getDataGridNoRowsOverlaySlotProps = (
  props: Omit<DataGridNoRowsOverlayProps, keyof GridOverlayProps>,
) => ({
  noRowsOverlay: props,
});

const DataGridEmptyIllustration = () => (
  <Box
    aria-hidden
    sx={(theme) => ({
      position: 'relative',
      width: 112,
      height: 88,
      color: alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.46 : 0.34),
    })}
  >
    {[
      { top: 16, left: 16, size: 6 },
      { top: 8, right: 24, size: 4 },
      { bottom: 18, left: 28, size: 5 },
      { bottom: 26, right: 10, size: 6 },
      { top: 36, left: 6, size: 4 },
      { top: 42, right: 2, size: 4 },
    ].map((dot, index) => (
      <Box
        key={index}
        sx={{
          position: 'absolute',
          width: dot.size,
          height: dot.size,
          top: dot.top,
          right: dot.right,
          bottom: dot.bottom,
          left: dot.left,
          borderRadius: '50%',
          border: '1px solid currentColor',
          opacity: 0.75,
        }}
      />
    ))}

    <Box
      sx={(theme) => ({
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 64,
        height: 50,
        transform: 'translate(-50%, -50%)',
        borderRadius: 2,
        bgcolor: alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.16 : 0.1),
        boxShadow: `0 18px 34px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.28 : 0.08)}`,
        overflow: 'hidden',
      })}
    >
      <Stack
        direction="row"
        spacing={0.5}
        sx={(theme) => ({
          height: 12,
          alignItems: 'center',
          px: 1,
          bgcolor: alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.18 : 0.16),
        })}
      >
        {[0, 1, 2].map((item) => (
          <Box
            key={item}
            sx={(theme) => ({
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.background.paper, 0.86),
            })}
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ p: 1 }}>
        <Stack spacing={0.75} flex={1}>
          {[0, 1, 2].map((item) => (
            <Box
              key={item}
              sx={(theme) => ({
                width: item === 1 ? '72%' : '100%',
                height: 5,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.18 : 0.12),
              })}
            />
          ))}
        </Stack>
        <Box
          sx={(theme) => ({
            width: 22,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.18 : 0.12),
          })}
        />
      </Stack>
    </Box>
  </Box>
);

const DataGridNoRowsOverlay = ({
  title,
  description,
  filteredDescription,
  filtered,
  ...props
}: DataGridNoRowsOverlayProps) => {
  const { t } = useTranslation();
  const rootProps = useGridRootProps();
  const noRowsLabel = rootProps.localeText.noRowsLabel;
  const fallbackTitle =
    noRowsLabel && noRowsLabel !== DEFAULT_MUI_NO_ROWS_LABEL
      ? noRowsLabel
      : t('common.dataGrid.noRows.default');
  const resolvedTitle = title ?? fallbackTitle;
  const resolvedDescription = filtered
    ? (filteredDescription ?? t('common.dataGrid.emptyState.filteredDescription'))
    : (description ?? t('common.dataGrid.emptyState.description'));

  return (
    <Stack
      {...props}
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{
        height: '100%',
        minHeight: 260,
        px: 3,
        textAlign: 'center',
        color: 'text.secondary',
      }}
      aria-live="polite"
    >
      <DataGridEmptyIllustration />

      <Stack spacing={0.5} alignItems="center" sx={{ maxWidth: 460 }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
          {resolvedTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resolvedDescription}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default DataGridNoRowsOverlay;
