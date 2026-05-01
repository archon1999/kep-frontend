import { Avatar, Card, CardContent, Chip, Divider, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import ChallengeChip, { ChallengeChipTone } from 'shared/components/challenges/ChallengeChip.tsx';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';

interface ArenaPlayerStatisticsCardProps {
  statistics?: ArenaPlayerStatistics;
  loading?: boolean;
  username?: string;
}

const StatisticItem = ({
  label,
  value,
  color = 'text.primary',
}: {
  label: string;
  value: string | number;
  color?: string;
}) => (
  <Stack direction="column" spacing={0.5}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={800} color={color}>
      {value}
    </Typography>
  </Stack>
);

const getToneFromScore = (score: number): ChallengeChipTone => {
  if (score > 0) return 'win';
  if (score === 0) return 'draw';
  return 'loss';
};

const ArenaPlayerStatisticsCard = ({
  statistics,
  loading,
  username,
}: ArenaPlayerStatisticsCardProps) => {
  const { t } = useTranslation();
  const safeStats = {
    username: statistics?.username || username || '',
    avatar: statistics?.avatar,
    rating: statistics?.rating ?? 0,
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
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={120} />
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
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 3,
              background:
                'linear-gradient(135deg, rgba(255,193,7,0.12), rgba(255,255,255,0.9) 55%)',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
              <UserPopover username={safeStats.username || username || ''} avatar={safeStats.avatar}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={safeStats.avatar}
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'warning.lighter',
                      color: 'warning.darker',
                      fontWeight: 800,
                    }}
                  >
                    {safeStats.username.charAt(0).toUpperCase() || 'P'}
                  </Avatar>
                  <Stack direction="column" spacing={0.35}>
                    <Typography variant="overline" color="text.secondary">
                      {t('arena.playerStatistics')}
                    </Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {safeStats.username || username || t('arena.selectPlayer')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {safeStats.rankTitle}
                    </Typography>
                  </Stack>
                </Stack>
              </UserPopover>

              <Stack
                direction={{ xs: 'row', sm: 'column' }}
                spacing={1.25}
                justifyContent="space-between"
                alignItems={{ xs: 'center', sm: 'flex-end' }}
              >
                <StatisticItem
                  label={t('arena.performanceShort')}
                  value={safeStats.performance}
                  color="warning.dark"
                />
                <StatisticItem
                  label={t('arena.columns.rating')}
                  value={safeStats.rating}
                  color="info.dark"
                />
              </Stack>
            </Stack>
          </Paper>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Paper variant="outlined" sx={{ p: 1.5, minWidth: 120, borderRadius: 2 }}>
              <StatisticItem
                label={t('arena.statisticsLabels.winRate')}
                value={`${safeStats.winRate}%`}
                color="success.dark"
              />
            </Paper>
            <Paper variant="outlined" sx={{ p: 1.5, minWidth: 120, borderRadius: 2 }}>
              <StatisticItem
                label={t('arena.statisticsLabels.drawRate')}
                value={`${safeStats.drawRate}%`}
                color="text.secondary"
              />
            </Paper>
            <Paper variant="outlined" sx={{ p: 1.5, minWidth: 120, borderRadius: 2 }}>
              <StatisticItem
                label={t('arena.statisticsLabels.lossRate')}
                value={`${safeStats.lossRate}%`}
                color="error.main"
              />
            </Paper>
          </Stack>

          {safeStats.opponents.length ? (
            <Stack direction="column" spacing={1}>
              <Divider />
              <Typography variant="subtitle2" color="text.secondary">
                {t('arena.opponents')}
              </Typography>
              <Stack direction="column" spacing={1}>
                {safeStats.opponents.map((opponent) => (
                  <Paper
                    key={`${safeStats.username}-${opponent.username}`}
                    variant="outlined"
                    sx={{ p: 1.25, borderRadius: 2 }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <UserPopover username={opponent.username} avatar={opponent.avatar}>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar src={opponent.avatar} sx={{ width: 36, height: 36 }}>
                            {opponent.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Stack direction="column" spacing={0.25}>
                            <Typography fontWeight={700}>{opponent.username}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {opponent.rankTitle} {opponent.rating ?? 0}
                            </Typography>
                          </Stack>
                        </Stack>
                      </UserPopover>
                      <ChallengeChip tone={getToneFromScore(opponent.result)} />
                    </Stack>
                  </Paper>
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
