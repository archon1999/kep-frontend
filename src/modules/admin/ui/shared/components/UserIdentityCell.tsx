import { Avatar, Stack, Typography } from '@mui/material';
import type { AdminRow } from 'modules/admin/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';

export default function UserIdentityCell({ row }: { row: AdminRow }) {
  const username = String(row.cells.username?.value ?? row.label);
  const avatar = row.cells.username?.avatar ?? undefined;
  const fullName = row.cells.get_full_name?.display.trim();
  const identifier =
    row.cells.id?.kind !== 'secret' && !row.id.startsWith('gAAAA') ? `#${row.id}` : '';

  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
      <Avatar
        src={avatar}
        alt={username}
        sx={{
          width: 38,
          height: 38,
          flexShrink: 0,
          bgcolor: 'action.selected',
          color: 'text.secondary',
        }}
      >
        <IconifyIcon icon="mdi:account-outline" sx={{ fontSize: 22 }} />
      </Avatar>
      <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
        <UserPopover username={username} avatar={avatar} fullName={fullName} sx={{ maxWidth: 1 }}>
          <Typography
            component="span"
            variant="body2"
            color="primary.main"
            fontWeight={600}
            title={username}
            noWrap
          >
            {username}
          </Typography>
        </UserPopover>
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
          {fullName && (
            <Typography variant="caption" color="text.secondary" title={fullName} noWrap>
              {fullName}
            </Typography>
          )}
          {identifier && (
            <Typography
              variant="caption"
              color={fullName ? 'text.disabled' : 'text.secondary'}
              sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
            >
              {identifier}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
