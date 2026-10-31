import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Chip, Link, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import type { AdminCell } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';

export default function ConsoleCell({ cell }: { cell?: AdminCell }) {
  const { t } = useTranslation();
  if (cell?.kind === 'secret') return <Typography color="text.secondary">••••••••</Typography>;
  if (!cell || cell.value === null || cell.value === '')
    return <Typography color="text.disabled">—</Typography>;
  if (cell.kind === 'boolean')
    return (
      <Chip
        size="small"
        color={cell.value ? 'success' : 'neutral'}
        variant="soft"
        icon={<IconifyIcon icon={cell.value ? 'mdi:check' : 'mdi:minus'} />}
        label={t(cell.value ? 'admin.status.yes' : 'admin.status.no')}
      />
    );
  if (cell.kind === 'image' && cell.url)
    return (
      <Box
        component="img"
        src={cell.url}
        alt=""
        sx={{ maxWidth: 64, maxHeight: 48, objectFit: 'contain', borderRadius: 0.5 }}
      />
    );
  if (cell.kind === 'link' && cell.url)
    return (
      <Link href={cell.url} target="_blank" rel="noopener noreferrer">
        {cell.display || cell.url}
      </Link>
    );
  if (cell.kind === 'relation' && cell.resource)
    return (
      <Link
        component={RouterLink}
        to={`${resources.AdminManage}/${cell.resource.replace('.', '/')}/${encodeURIComponent(String(cell.value))}`}
        underline="hover"
      >
        {cell.display}
      </Link>
    );
  if (cell.kind === 'file' && cell.url)
    return (
      <Link href={cell.url} target="_blank" rel="noopener noreferrer">
        {cell.display.split('/').slice(-1)[0]} <IconifyIcon icon="mdi:open-in-new" />
      </Link>
    );
  const text =
    cell.kind === 'date' || cell.kind === 'datetime'
      ? formatDateTime(String(cell.value))
      : cell.display;
  return (
    <Box
      component="span"
      title={text}
      sx={{
        fontFamily: cell.kind === 'number' ? 'var(--kep-display-font)' : undefined,
        fontFeatureSettings: cell.kind === 'number' ? '"ss01" 1' : undefined,
        fontVariantNumeric: 'tabular-nums',
        overflowWrap: 'anywhere',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {text || '—'}
    </Box>
  );
}
