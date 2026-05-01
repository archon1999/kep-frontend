import { useTranslation } from 'react-i18next';
import { alpha, Button, ButtonProps, IconButton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface AdminBatchAction {
  label: string;
  icon?: string;
  color?: ButtonProps['color'];
  onClick: () => void;
  disabled?: boolean;
}

interface AdminBatchActionsToolbarProps {
  selectedCount: number;
  selectedLabel: string;
  actions: AdminBatchAction[];
  disabled?: boolean;
  onClear?: () => void;
}

const AdminBatchActionsToolbar = ({
  selectedCount,
  selectedLabel,
  actions,
  disabled,
  onClear,
}: AdminBatchActionsToolbarProps) => {
  const { t } = useTranslation();

  if (selectedCount === 0) {
    return null;
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
      sx={(theme) => ({
        position: 'fixed',
        left: '50%',
        bottom: { xs: 16, md: 24 },
        zIndex: theme.zIndex.drawer + 2,
        width: { xs: 'calc(100% - 24px)', sm: 'auto' },
        minWidth: { sm: 520 },
        maxWidth: 'calc(100vw - 32px)',
        transform: 'translateX(-50%)',
        px: { xs: 2, sm: 4 },
        py: 2,
        borderRadius: 1,
        bgcolor: alpha(theme.palette.primary.light, 0.16),
        boxShadow: theme.shadows[10],
        backdropFilter: 'blur(10px)',
      })}
    >
      <Stack direction="column" spacing={0.5} sx={{ minWidth: 150 }}>
        <Typography variant="h6" color="text.secondary" fontWeight={500}>
          {selectedLabel}
        </Typography>
        <Typography variant="h6" color="text.primary" fontWeight={700}>
          {selectedCount}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
        {actions.map((action) => (
          <Button
            key={action.label}
            size="large"
            variant={action.color === 'error' ? 'soft' : 'contained'}
            color={action.color ?? 'primary'}
            onClick={action.onClick}
            disabled={disabled || action.disabled}
            startIcon={action.icon ? <IconifyIcon icon={action.icon} /> : undefined}
          >
            {action.label}
          </Button>
        ))}
        {onClear ? (
          <IconButton
            size="large"
            color="default"
            onClick={onClear}
            disabled={disabled}
            aria-label={t('admin.actions.clearSelection')}
          >
            <IconifyIcon icon="mdi:close" width={28} height={28} />
          </IconButton>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default AdminBatchActionsToolbar;
