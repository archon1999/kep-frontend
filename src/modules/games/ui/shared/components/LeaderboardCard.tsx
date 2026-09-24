import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useGamesLeaderboard } from 'modules/games/application';
import type { LeaderboardId, LeaderboardPlayer } from 'modules/games/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const podiumColors = ['#D99214', '#8396A9', '#B5744D'] as const;

const PlayerRow = ({ player }: { player: LeaderboardPlayer }) => (
  <Stack
    component="li"
    direction="row"
    alignItems="center"
    spacing={1.25}
    sx={{
      minWidth: 0,
      minHeight: 45,
      px: 1,
      borderRadius: 1.25,
      bgcolor: player.isCurrentUser ? 'action.selected' : undefined,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        width: 23,
        flexShrink: 0,
        color: player.rank <= 3 ? podiumColors[player.rank - 1] : 'text.secondary',
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {String(player.rank).padStart(2, '0')}
    </Typography>
    <Avatar
      src={player.avatar ?? undefined}
      alt={player.username}
      sx={{ width: 27, height: 27, bgcolor: 'primary.light', fontSize: 12 }}
    >
      {player.username.slice(0, 1).toUpperCase()}
    </Avatar>
    <Typography
      variant="body2"
      fontWeight={player.isCurrentUser ? 700 : 500}
      noWrap
      sx={{ flex: 1, minWidth: 0 }}
    >
      {player.username}
    </Typography>
    <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>
      {player.score.toLocaleString()}
    </Typography>
  </Stack>
);

type Props = { id: LeaderboardId; embedded?: boolean; compact?: boolean };

const LeaderboardCard = ({ id, embedded = false, compact = false }: Props) => {
  const { t } = useTranslation();
  const { data, error, isLoading, mutate } = useGamesLeaderboard(id);
  const currentInTop = data?.top.some((player) => player.isCurrentUser);
  const isStrip = compact && (data?.top.length ?? 0) <= 3;

  if (compact && !data) {
    if (isLoading) return <Skeleton height={24} width={180} />;
    if (error)
      return (
        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary">
            {t('games.rankingError')}
          </Typography>
          <Button size="small" onClick={() => void mutate()} sx={{ minWidth: 0, p: 0 }}>
            {t('games.retry')}
          </Button>
        </Stack>
      );
  }

  if (compact && data && !data.top.length && !data.currentUser) {
    return (
      <Typography variant="caption" color="text.secondary">
        {t('games.emptyRanking')}
      </Typography>
    );
  }

  return (
    <Paper
      component="section"
      background={embedded ? 0 : 5}
      sx={{
        border: 0,
        outline: 0,
        boxShadow: 'none',
        borderRadius: 2.5,
        p: { xs: 2, md: 2.5 },
        minWidth: 0,
        ...(isStrip && {
          display: { md: 'grid' },
          gridTemplateColumns: { md: 'minmax(190px, 230px) minmax(0, 1fr)' },
          alignItems: 'center',
          columnGap: 2,
        }),
      }}
    >
      <Stack
        direction={isStrip ? { xs: 'row', md: 'column' } : 'row'}
        justifyContent="space-between"
        alignItems={isStrip ? { xs: 'center', md: 'flex-start' } : 'center'}
        useFlexGap
        flexWrap="wrap"
        columnGap={1.5}
        rowGap={1}
        sx={{ px: isStrip ? 0 : 1, mb: isStrip ? { xs: 1.5, md: 0 } : 1.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 38,
              height: 38,
              flex: '0 0 auto',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 2,
              bgcolor: 'warning.lighter',
              color: 'warning.dark',
            }}
          >
            <IconifyIcon icon="mdi:trophy-outline" width={21} />
          </Box>
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontSize: { xs: 17, sm: 18 },
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.015em',
            }}
          >
            {t(id === 'overall' ? 'games.overall' : 'games.leaderboard')}
          </Typography>
        </Stack>
        {data && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{
              px: 1.25,
              py: 0.625,
              borderRadius: 5,
              bgcolor: 'background.elevation1',
              color: 'primary.dark',
              whiteSpace: 'nowrap',
            }}
          >
            <IconifyIcon icon="mdi:account-group-outline" width={16} aria-hidden="true" />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
            >
              {t('games.players', { count: data.totalPlayers })}
            </Typography>
          </Stack>
        )}
      </Stack>
      {isLoading ? (
        <Stack spacing={0.75}>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} height={43} variant="rounded" />
          ))}
        </Stack>
      ) : error ? (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('games.rankingError')}
          </Typography>
          <Button size="small" onClick={() => void mutate()}>
            {t('games.retry')}
          </Button>
        </Stack>
      ) : data?.top.length ? (
        <Box
          component="ol"
          sx={{
            m: 0,
            p: 0,
            listStyle: 'none',
            ...(isStrip && {
              display: { sm: 'grid' },
              gridTemplateColumns: { sm: `repeat(${data.top.length}, minmax(0, 1fr))` },
              gap: 1,
              ...(data.top.length === 1 && {
                justifySelf: { md: 'end' },
                width: { md: 320 },
              }),
            }),
          }}
        >
          {data.top.slice(0, 10).map((player) => (
            <PlayerRow key={player.userId} player={player} />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 1 }}>
          {t('games.emptyRanking')}
        </Typography>
      )}
      {data?.currentUser && !currentInTop && (
        <Box
          component="ol"
          sx={{
            m: 0,
            mt: 1,
            p: 0,
            listStyle: 'none',
            ...(isStrip && { gridColumn: { md: 2 } }),
          }}
        >
          <PlayerRow player={data.currentUser} />
        </Box>
      )}
    </Paper>
  );
};

export default LeaderboardCard;
