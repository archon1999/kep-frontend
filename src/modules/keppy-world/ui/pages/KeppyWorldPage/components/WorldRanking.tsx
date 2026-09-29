import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { Alert, Avatar, Button, ButtonBase, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import { formatDateTime } from 'shared/lib/dateTime';
import { useWorldLeaderboard } from '../../../../application';

const WorldRanking = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'week' | 'all'>('week');
  const { currentUser } = useAuth();
  const { data, error, isLoading, mutate } = useWorldLeaderboard(period, true, currentUser?.username);
  return <Stack spacing={2}>
    <ToggleButtonGroup size="small" value={period} exclusive onChange={(_event, value) => value && setPeriod(value)}>
      <ToggleButton value="week">{t('keppyWorld.thisWeek')}</ToggleButton><ToggleButton value="all">{t('keppyWorld.allTime')}</ToggleButton>
    </ToggleButtonGroup>
    {isLoading && <Skeleton height={150} />}
    {error && <Alert severity="warning" action={<Button onClick={() => void mutate()}>{t('keppyWorld.retry')}</Button>}>{t('keppyWorld.loadError')}</Alert>}
    {data?.length === 0 && <Typography color="text.secondary" variant="body2">{t('keppyWorld.emptyRanking')}</Typography>}
    {data?.map((player) => <Stack key={player.username} direction="row" alignItems="center" gap={1.25} sx={{ px: 1, py: 1, borderRadius: 1.5, bgcolor: player.isCurrentUser ? 'action.selected' : undefined }}>
      <Typography sx={{ width: 22, color: player.rank === 1 ? 'warning.main' : 'text.secondary', fontSize: 13 }}>{player.rank}</Typography>
      <UserPopover username={player.username} avatar={player.avatar} sx={{ minWidth: 0, flex: 1 }}><ButtonBase sx={{ width: '100%', justifyContent: 'flex-start', gap: 1, minWidth: 0 }}><Avatar src={player.avatar} sx={{ width: 30, height: 30, fontSize: 12 }}>{player.username.slice(0, 1)}</Avatar><Typography noWrap variant="body2">{player.username}</Typography></ButtonBase></UserPopover>
      <Tooltip title={formatDateTime(player.achievedAt, 'compactDateTimeNoComma', '')} slotProps={{ popper: { disablePortal: true } }}><Typography tabIndex={0} variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>{player.xp.toLocaleString()} XP</Typography></Tooltip>
    </Stack>)}
  </Stack>;
};
export default WorldRanking;
