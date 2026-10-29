import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import type { AdminAuditEntry } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';

export default function AuditList({ entries }: { entries: AdminAuditEntry[] }) {
  const { t } = useTranslation();
  if (!entries.length)
    return (
      <Typography color="text.secondary" sx={{ py: 3 }}>
        {t('admin.console.noHistory')}
      </Typography>
    );
  return (
    <Stack component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {entries.map((entry) => (
        <Stack
          key={entry.id}
          component="li"
          direction="row"
          spacing={1.5}
          sx={{ py: 1.75, borderBottom: 1, borderColor: 'divider', '&:last-child': { border: 0 } }}
        >
          <Box
            sx={{
              color:
                entry.action === 3
                  ? 'error.main'
                  : entry.action === 1
                    ? 'success.main'
                    : 'primary.main',
              pt: 0.25,
            }}
          >
            <IconifyIcon
              icon={
                entry.action === 3
                  ? 'mdi:delete-outline'
                  : entry.action === 1
                    ? 'mdi:plus-circle-outline'
                    : 'mdi:pencil-outline'
              }
            />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" fontWeight={650} sx={{ overflowWrap: 'anywhere' }}>
              {entry.object}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {entry.actor} · {t(`admin.console.auditActions.${entry.action}`)}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'right', maxWidth: 130 }}
          >
            {formatDateTime(entry.at)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
