import { Avatar, Card, CardContent, Chip, Divider, Skeleton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import ChallengeChip, { ChallengeChipTone } from 'shared/components/challenges/ChallengeChip.tsx';
import UserPopover from 'modules/users/ui/components/UserPopover';
import { useTranslation } from 'react-i18next';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';

interface ArenaPlayerStatisticsCardProps {
  statistics?: ArenaPlayerStatistics;
  loading?: boolean;
  username?: string;
}

const StatisticItem = ({ label, value }: { label: string; value: string | number }) => (
  <Stack direction="column" spacing={0.5}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={800}>{value}</Typography>
  </Stack>
);

const getToneFromScore = (score: number): ChallengeChipTone => {
  if (score > 0) return 'win';
  if (score === 0) return 'draw';
  return 'loss';
};

const ArenaPlayerStatisticsCard = ({ statistics, loading, username }: ArenaPlayerStatisticsCardProps) => {
  const { t } = useTranslation();
  const safeStats = {
    username: statistics?.username || username || '',
    rankTitle: statistics?.rankTitle || t('challenges.rankUnknown'),
    performance: statistics?.performance ?? 0,
    challenges: statistics?.challenges ?? 0,
    wins: statistics?.wins ?? 0,
    draws: statistics?.draws ?? 0,
    losses: statistics?.losses ?? 0,
    winRate: statistics?.winRate ?? 0,
    drawRate: statistics?.drawRate ?? 0,
    lossRate: statistics?.lossRate ?? 0,
    opponents: statistics?.opponents ?? [],
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rounded" height={12} />
            <Skeleton variant="rounded" height={12} />
            <Skeleton variant="rounded" height={12} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (!statistics && !username) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {t('arena.selectPlayer')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
            <UserPopover username={safeStats.username || username || ''}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.lighter', color: 'warning.darker', fontWeight: 800 }}>
                  {safeStats.username.charAt(0).toUpperCase() || 'P'}
                </Avatar>
                <Stack direction="column" spacing={0.25}>
                  <Typography variant="overline" color="text.secondary">
                    {t('arena.playerStatistics')}
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {safeStats.username || username || t('arena.selectPlayer')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {safeStats.rankTitle}
                  </Typography>
                </Stack>
              </Stack>
            </UserPopover>
            <Chip
              color="warning"
              variant="soft"
              icon={<IconifyIcon icon="mdi:chart-line" fontSize={18} />}
              label={`${safeStats.performance}`}
            />
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <ChallengeChip tone="win" label={`W ${safeStats.wins}`} sx={{ minWidth: 68 }} />
            <ChallengeChip tone="draw" label={`D ${safeStats.draws}`} sx={{ minWidth: 68 }} />
            <ChallengeChip tone="loss" label={`L ${safeStats.losses}`} sx={{ minWidth: 68 }} />
            <Chip
              variant="outlined"
              color="warning"
              icon={<IconifyIcon icon="mdi:swords" fontSize={18} />}
              label={`${t('arena.statisticsLabels.challenges')}: ${safeStats.challenges}`}
            />
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <StatisticItem label={t('arena.statisticsLabels.winRate')} value={`${safeStats.winRate}%`} />
            <StatisticItem label={t('arena.statisticsLabels.drawRate')} value={`${safeStats.drawRate}%`} />
            <StatisticItem label={t('arena.statisticsLabels.lossRate')} value={`${safeStats.lossRate}%`} />
          </Stack>

          {safeStats.opponents?.length ? (
            <Stack direction="column" spacing={1}>
              <Divider />
              <Typography variant="subtitle2" color="text.secondary">
                {t('arena.opponents')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {safeStats.opponents.map((opponent) => (
                  <Stack key={`${safeStats.username}-${opponent.username}`} direction="row" spacing={0.75} alignItems="center">
                    <ChallengeChip tone={getToneFromScore(opponent.result)} />
                    <Typography variant="body2">{opponent.username}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaPlayerStatisticsCard;
