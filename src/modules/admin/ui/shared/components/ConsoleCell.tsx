import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Chip, LinearProgress, Link, Stack, Tooltip, Typography } from '@mui/material';
import { adminResourcePath } from 'app/routes/admin-routes';
import { getRankColor } from 'app/theme/colors/medals';
import { useAdminRegistry } from 'modules/admin/application';
import type { AdminCell } from 'modules/admin/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import AttemptLanguage from 'shared/components/problems/AttemptLanguage';
import AttemptVerdict from 'shared/components/problems/AttemptVerdict';
import type { VerdictKey } from 'shared/components/problems/attemptVerdict.utils';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import Streak from 'shared/components/rating/Streak';
import { formatDateTime } from 'shared/lib/dateTime';

export default function ConsoleCell({
  cell,
  name = '',
  resourceKey = '',
}: {
  cell?: AdminCell;
  name?: string;
  resourceKey?: string;
}) {
  const { t } = useTranslation();
  if (cell?.kind === 'problemLimits')
    return (
      <Stack gap={0.5} sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {[
          {
            icon: 'mdi:timer-outline',
            name: 'time_limit',
            value: cell.value,
            unit: t('admin.workspace.milliseconds'),
          },
          {
            icon: 'mdi:memory',
            name: 'memory_limit',
            value: cell.total,
            unit: t('admin.workspace.megabytes'),
          },
        ].map((limit) => (
          <Tooltip key={limit.name} title={t('admin.console.fields.' + limit.name)}>
            <Stack direction="row" alignItems="center" gap={0.75}>
              <IconifyIcon icon={limit.icon} sx={{ color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                {limit.value == null ? '—' : `${limit.value} ${limit.unit}`}
              </Typography>
            </Stack>
          </Tooltip>
        ))}
      </Stack>
    );
  if (cell?.kind === 'problemSolvers')
    return (
      <Stack
        direction="row"
        alignItems="center"
        gap={0.75}
        sx={{ fontVariantNumeric: 'tabular-nums' }}
      >
        <Tooltip title={t('admin.workspace.solvedUsers')}>
          <Stack
            direction="row"
            alignItems="center"
            gap={0.4}
            aria-label={`${t('admin.workspace.solvedUsers')}: ${cell.value}`}
            sx={{ color: 'success.main' }}
          >
            <IconifyIcon icon="mdi:check" sx={{ fontSize: 15 }} />
            <Typography variant="body2" fontWeight={600}>
              {String(cell.value ?? 0)}
            </Typography>
          </Stack>
        </Tooltip>
        <Typography variant="caption" color="text.disabled">
          /
        </Typography>
        <Tooltip title={t('admin.workspace.unsolvedUsers')}>
          <Stack
            direction="row"
            alignItems="center"
            gap={0.4}
            aria-label={`${t('admin.workspace.unsolvedUsers')}: ${cell.total}`}
            sx={{ color: 'error.main' }}
          >
            <IconifyIcon icon="mdi:close" sx={{ fontSize: 15 }} />
            <Typography variant="body2" fontWeight={600}>
              {cell.total ?? 0}
            </Typography>
          </Stack>
        </Tooltip>
      </Stack>
    );
  if (cell?.kind === 'secret') return <Typography color="text.secondary">••••••••</Typography>;
  if (!cell || cell.value === null || cell.value === '')
    return <Typography color="text.disabled">—</Typography>;
  if (cell.kind === 'date' || cell.kind === 'datetime') {
    const value = String(cell.value);
    const date = formatDateTime(value, 'compactDate', '');
    if (!date) return <Typography color="text.disabled">—</Typography>;
    return (
      <Tooltip
        title={formatDateTime(value, cell.kind === 'date' ? 'fullDate' : 'compactDateTimeNoComma')}
      >
        <Stack
          component="time"
          dateTime={value}
          direction="row"
          alignItems="center"
          gap={0.75}
          sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
        >
          <IconifyIcon
            icon="mdi:calendar-blank-outline"
            sx={{ fontSize: 16, color: 'text.disabled' }}
          />
          <Box>
            <Typography variant="body2" sx={{ fontSize: 12 }}>
              {date}
            </Typography>
            {cell.kind === 'datetime' && (
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(value, 'time')}
              </Typography>
            )}
          </Box>
        </Stack>
      </Tooltip>
    );
  }
  if (name === 'rank') {
    const rank = Number(cell.value);
    return (
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: getRankColor(rank) }}>
        {rank >= 1 && rank <= 3 && (
          <IconifyIcon icon={rank === 1 ? 'mdi:trophy-outline' : 'mdi:medal-outline'} />
        )}
        <Typography variant="body2" sx={{ fontFamily: 'var(--kep-display-font)' }}>
          {cell.display}
        </Typography>
      </Stack>
    );
  }
  if (cell.kind === 'progress') {
    const progress = cell.total ? Math.min(100, (Number(cell.value) / cell.total) * 100) : 0;
    return (
      <Stack spacing={0.5} sx={{ minWidth: 70 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color={progress === 100 ? 'success.main' : 'text.secondary'}
        >
          {cell.display}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progress === 100 ? 'success' : 'primary'}
          aria-label={t('admin.console.fields.daily_progress')}
          sx={{ height: 4, borderRadius: 1 }}
        />
      </Stack>
    );
  }
  if (cell.kind === 'contestRating' || cell.kind === 'challengeRating')
    return (
      <Stack direction="row" alignItems="center" spacing={0.75}>
        {cell.kind === 'contestRating' ? (
          <ContestsRatingChip title={cell.title} imgSize={22} />
        ) : (
          <ChallengesRatingChip title={cell.title} />
        )}
        <Typography variant="body2" sx={{ fontFamily: 'var(--kep-display-font)' }}>
          {cell.display}
        </Typography>
      </Stack>
    );
  if (
    name === 'kepcoin' ||
    (/kepcoin|^kepcoin\./.test(resourceKey) && name === 'value') ||
    /kepcoin/.test(name)
  )
    return <KepcoinValue value={cell.display} iconSize={18} fontWeight={600} />;
  if (name === 'streak' || name === 'max_streak')
    return <Streak streak={Number(cell.value)} iconSize={18} />;
  if (cell.kind === 'verdict')
    return <AttemptVerdict verdict={Number(cell.value) as VerdictKey} title={cell.display} />;
  if (name === 'lang') return <AttemptLanguage lang={String(cell.value)} langFull={cell.display} />;
  if (cell.username || cell.resource === 'backend.user')
    return (
      <UserPopover username={cell.username || cell.display}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <IconifyIcon icon="mdi:account-outline" sx={{ fontSize: 17, color: 'primary.main' }} />
          <Typography component="span" variant="body2" fontWeight={600}>
            {cell.display}
          </Typography>
        </Stack>
      </UserPopover>
    );
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
  if (cell.kind === 'relation' && cell.resource) return <RelationLink cell={cell} />;
  if (cell.kind === 'file' && cell.url)
    return (
      <Link href={cell.url} target="_blank" rel="noopener noreferrer">
        {cell.display.split('/').slice(-1)[0]} <IconifyIcon icon="mdi:open-in-new" />
      </Link>
    );
  const text = cell.display;
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

function RelationLink({ cell }: { cell: AdminCell }) {
  const { data: catalog = [] } = useAdminRegistry();
  return (
    <Link
      component={RouterLink}
      to={`${adminResourcePath(cell.resource!, catalog)}/${encodeURIComponent(String(cell.value))}`}
      underline="hover"
    >
      {cell.display}
    </Link>
  );
}
