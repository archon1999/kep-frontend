import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import type { AdminDetail } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';

export default function PublicationChecks({ checks }: { checks: AdminDetail['checks'] }) {
  const { t } = useTranslation();
  if (!checks?.length) return null;
  return (
    <Box
      component="section"
      sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}
    >
      <Typography component="h2" variant="subtitle2" mb={1.5}>
        {t('admin.console.publicationChecks')}
      </Typography>
      <Stack direction="column" gap={1.5} flexWrap="wrap">
        {checks.map((check) => (
          <Stack key={check.key} direction="row" gap={1} alignItems="center">
            <IconifyIcon
              icon={check.passed ? 'mdi:check-circle-outline' : 'mdi:circle-outline'}
              sx={{ color: check.passed ? 'success.main' : 'warning.main' }}
            />
            <Typography variant="body2" color="text.secondary">
              {t(`admin.console.checks.${check.key}`)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
