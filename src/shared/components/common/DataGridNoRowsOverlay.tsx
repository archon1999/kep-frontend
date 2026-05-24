import { Stack, Typography } from '@mui/material';
import { useGridRootProps } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const DEFAULT_MUI_NO_ROWS_LABEL = 'No rows';

const DataGridNoRowsOverlay = () => {
  const { t } = useTranslation();
  const rootProps = useGridRootProps();
  const noRowsLabel = rootProps.localeText.noRowsLabel;
  const label =
    noRowsLabel && noRowsLabel !== DEFAULT_MUI_NO_ROWS_LABEL
      ? noRowsLabel
      : t('common.dataGrid.noRows.default');

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.25}
      sx={{
        height: '100%',
        minHeight: 180,
        px: 3,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={(theme) => ({
          width: 52,
          height: 52,
          borderRadius: 2,
          bgcolor: 'background.elevation1',
          color: 'primary.main',
          border: '1px solid',
          borderColor: theme.vars.palette.dividerLight,
        })}
      >
        <IconifyIcon icon="mdi:table-off" sx={{ fontSize: 28 }} />
      </Stack>

      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
        {label}
      </Typography>
    </Stack>
  );
};

export default DataGridNoRowsOverlay;
