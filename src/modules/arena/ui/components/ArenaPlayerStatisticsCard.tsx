import { useTranslation } from 'react-i18next';
import { Avatar, Box, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import ChallengeChip, { ChallengeChipTone } from 'shared/components/challenges/ChallengeChip.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity.ts';

interface ArenaPlayerStatisticsCardProps {
  statistics?: ArenaPlayerStatistics;
  loading?: boolean;
  username?: string;
}

const OverviewStat = ({
  icon,
  label,
  value,
  valueColor = 'text.primary',
  iconColor = 'warning.main',
}: {
  icon: string;
  label: string;
  value: string | number;
  valueColor?: string;
  iconColor?: string;
}) => (
  <Stack
    spacing={1}
    sx={{
      minHeight: 92,
      p: 1.5,
      borderRadius: 2,
      bgcolor: 'background.default',
      justifyContent: 'space-between',
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
      <IconifyIcon icon={icon} color={iconColor} fontSize={18} />
      <Typography variant="body2" color="text.secondary" noWrap>
        {label}
      </Typography>
    </Stack>
    <Typography variant="h5" fontWeight={800} color={valueColor} sx={{ lineHeight: 1.1 }}>
      {value}
    </Typography>
  </Stack>
);

const buildOpponentMeta = (rankTitle?: string, rating?: number) => {
  const parts = [rankTitle, typeof rating === 'number' ? String(rating) : undefined].filter(
    Boolean,
  );
  return parts.join(' / ');
};

const getToneFromScore = (score: number): ChallengeChipTone => {
  if (score > 0) return 'win';
  if (score === 0) return 'draw';
  return 'loss';
};

const getScoreColor = (score: number, opponentScore: number) => {
  if (score > opponentScore) return 'success.main';
  if (score < opponentScore) return 'error.main';
  return 'text.secondary';
};

const getInitial = (value: string) => value.trim().charAt(0).toUpperCase() || 'P';

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
    rankTitle: statistics?.rankTitle || '',
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
      <Stack direction="column" spacing={1.5}>
        <Skeleton variant="rounded" height={132} />
        <Skeleton variant="rounded" height={108} />
        <Skeleton variant="rounded" height={188} />
      </Stack>
    );
  }

  const playerMeta = buildOpponentMeta(statistics?.rankTitle, statistics?.rating);
  const headerContent = (
    <Stack direction="row" spacing={1.5} alignItems="center" minWidth={0}>
      <Avatar
        src={safeStats.avatar}
        sx={(theme) => ({
          width: 36,
          height: 36,
          bgcolor: alpha(theme.palette.warning.main, 0.14),
          color: 'warning.dark',
          fontWeight: 800,
        })}
      >
        {getInitial(safeStats.username)}
      </Avatar>
      <Stack direction="column" spacing={0.75} minWidth={0}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="h5" fontWeight={900} sx={{ lineHeight: 1.1 }}>
            {safeStats.username || username || t('arena.selectPlayer')}
          </Typography>
          {safeStats.rankTitle ? <ChallengesRatingChip title={safeStats.rankTitle} /> : null}
        </Stack>
        {playerMeta ? (
          <Typography variant="body1" color="text.secondary">
            {playerMeta}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );

  return (
    <Stack direction="column" spacing={3}>
      <Box
        sx={(theme) => ({
          p: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha(theme.palette.warning.main, 0.16),
          background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${theme.palette.background.paper} 72%)`,
        })}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
          {safeStats.username ? (
            <UserPopover username={safeStats.username} avatar={safeStats.avatar}>
              {headerContent}
            </UserPopover>
          ) : (
            headerContent
          )}

          <Box
            sx={{
              display: 'grid',
              gap: 1.25,
              width: '100%',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              maxWidth: { md: 280 },
            }}
          >
            <OverviewStat
              icon="mdi:chart-line"
              label={t('arena.performanceShort')}
              value={safeStats.performance}
              valueColor="warning.dark"
            />
            <OverviewStat
              icon="mdi:star-circle-outline"
              label={t('arena.columns.rating')}
              value={safeStats.rating}
              iconColor="info.main"
              valueColor="info.dark"
            />
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
            lg: 'repeat(7, minmax(0, 1fr))',
          },
        }}
      >
        <OverviewStat
          icon="mdi:sword-cross"
          label={t('arena.statisticsLabels.challenges')}
          value={safeStats.challenges}
        />
        <OverviewStat
          icon="mdi:trophy-outline"
          label={t('arena.statisticsLabels.wins')}
          value={safeStats.wins}
          iconColor="success.main"
          valueColor="success.dark"
        />
        <OverviewStat
          icon="mdi:handshake-outline"
          label={t('arena.statisticsLabels.draws')}
          value={safeStats.draws}
          iconColor="text.secondary"
          valueColor="text.secondary"
        />
        <OverviewStat
          icon="mdi:close-circle-outline"
          label={t('arena.statisticsLabels.losses')}
          value={safeStats.losses}
          iconColor="error.main"
          valueColor="error.main"
        />
        <OverviewStat
          icon="mdi:trending-up"
          label={t('arena.statisticsLabels.winRate')}
          value={`${safeStats.winRate}%`}
          iconColor="success.main"
          valueColor="success.dark"
        />
        <OverviewStat
          icon="mdi:swap-horizontal"
          label={t('arena.statisticsLabels.drawRate')}
          value={`${safeStats.drawRate}%`}
          iconColor="text.secondary"
          valueColor="text.secondary"
        />
        <OverviewStat
          icon="mdi:trending-down"
          label={t('arena.statisticsLabels.lossRate')}
          value={`${safeStats.lossRate}%`}
          iconColor="error.main"
          valueColor="error.main"
        />
      </Box>

      {safeStats.opponents.length ? (
        <Stack direction="column" spacing={1.5}>
          <Divider />
          <Stack direction="row" spacing={1} alignItems="center">
            <IconifyIcon icon="mdi:account-group-outline" color="warning.main" fontSize={20} />
            <Typography variant="h6" fontWeight={800}>
              {t('arena.opponents')}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={1}>
            {safeStats.opponents.map((opponent) => {
              const rowContent = (
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
                    <Avatar src={opponent.avatar} sx={{ width: 44, height: 44 }}>
                      {getInitial(opponent.username)}
                    </Avatar>
                    <Stack direction="column" spacing={0.35} minWidth={0}>
                      <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Typography fontWeight={800} noWrap>
                          {opponent.username}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" flex="0 0 auto">
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Typography
                        variant="body1"
                        fontWeight={800}
                        color={getScoreColor(opponent.playerScore, opponent.opponentScore)}
                      >
                        {opponent.playerScore}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="text.secondary">
                        :
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={800}
                        color={getScoreColor(opponent.opponentScore, opponent.playerScore)}
                      >
                        {opponent.opponentScore}
                      </Typography>
                    </Stack>
                    <ChallengeChip tone={getToneFromScore(opponent.result)} />
                  </Stack>
                </Stack>
              );

              return (
                <Box key={`${safeStats.username}-${opponent.username}`}>
                  {opponent.username ? (
                    <UserPopover username={opponent.username} avatar={opponent.avatar}>
                      {rowContent}
                    </UserPopover>
                  ) : (
                    rowContent
                  )}
                </Box>
              );
            })}
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default ArenaPlayerStatisticsCard;
