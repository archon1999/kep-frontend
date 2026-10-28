import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { GridOverlayProps, useGridRootProps } from '@mui/x-data-grid';
import EmptyState from './EmptyState';

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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface NoResultsOverlayPropsOverrides extends DataGridNoRowsOverlayProps {}
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
    <Box
      {...props}
      sx={{
        height: '100%',
        minHeight: 260,
        px: 3,
        textAlign: 'center',
        color: 'text.secondary',
      }}
      aria-live="polite"
    >
      <EmptyState
        title={resolvedTitle}
        description={resolvedDescription}
        kind={filtered ? 'search' : 'empty'}
        compact
        sx={{ height: '100%' }}
      />
    </Box>
  );
};

export default DataGridNoRowsOverlay;

export const DataGridNoResultsOverlay = (props: DataGridNoRowsOverlayProps) => {
  const { t } = useTranslation();
  return (
    <DataGridNoRowsOverlay
      title={t('common.dataGrid.emptyState.filteredTitle')}
      {...props}
      filtered
    />
  );
};
