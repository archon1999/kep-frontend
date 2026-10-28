import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, ButtonBase, Skeleton, Stack, Typography } from '@mui/material';
import { contentInsetSx } from 'app/theme/styles/content';
import type { GamesOverview } from 'modules/games/application';
import type { GamesLeaderboard, LeaderboardPlayer } from 'modules/games/domain';
import { gamesCatalog } from 'modules/games/ui/shared';
import LeaderboardScore from 'modules/games/ui/shared/components/LeaderboardScore';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import SectionHeader from 'shared/components/sections/common/SectionHeader';

type Props = {
  leaderboard?: GamesLeaderboard;

  leaderboardError?: unknown;

  isLoading: boolean;

  onRetryLeaderboard: () => void;

  overview: GamesOverview;

  overviewError?: unknown;

  overviewLoading: boolean;

  onRetryOverview: () => void;

  isAuthenticated: boolean;
};

const podiumColors = ['var(--kep-gold)', 'var(--kep-silver)', 'var(--kep-bronze)'] as const;

const PlayerRow = ({ player }: { player: LeaderboardPlayer }) => (
  <Stack
    component="li"
    direction="row"
    spacing={1.25}
    alignItems="center"
    sx={{
      minWidth: 0,

      minHeight: 60,

      px: 'var(--kep-content-inset)',

      borderBottom: 1,

      borderColor: 'divider',

      borderRadius: 0,

      bgcolor: player.isCurrentUser ? 'action.selected' : undefined,
    }}
  >
    <Typography
      variant="metric"
      sx={{
        fontSize: 20,

        width: 27,

        flexShrink: 0,

        color: player.rank <= 3 ? podiumColors[player.rank - 1] : 'text.secondary',

        fontWeight: 700,

        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {String(player.rank).padStart(2, '0')}
    </Typography>

    <UserPopover
      username={player.username}
      avatar={player.avatar ?? undefined}
      sx={{ flex: 1, minWidth: 0 }}
    >
      <ButtonBase
        sx={{
          width: '100%',

          minWidth: 0,

          gap: 1.25,

          textAlign: 'left',

          borderRadius: 0,

          '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' },
        }}
      >
        <Avatar
          src={player.avatar ?? undefined}
          alt={player.username}
          sx={{ width: 27, height: 27, fontSize: 12 }}
        >
          {player.username.slice(0, 1).toUpperCase()}
        </Avatar>

        <Typography
          component="span"
          variant="body2"
          fontWeight={player.isCurrentUser ? 700 : 500}
          noWrap
          sx={{ flex: 1, minWidth: 0 }}
        >
          {player.username}
        </Typography>
      </ButtonBase>
    </UserPopover>

    <LeaderboardScore player={player} />
  </Stack>
);

const OverallRankingPanel = ({
  leaderboard,

  leaderboardError,

  isLoading,

  onRetryLeaderboard,

  overview,

  overviewError,

  overviewLoading,

  onRetryOverview,

  isAuthenticated,
}: Props) => {
  const { t } = useTranslation();

  const player = leaderboard?.currentUser;

  const top = leaderboard?.top.slice(0, 10) ?? [];

  const scoreParts = gamesCatalog.map(({ id }) => ({
    id,

    score: overview.bestByGame[id] ?? 0,
  }));

  return (
    <Box component="aside" aria-labelledby="overall-ranking-heading">
      <SectionHeader id="overall-ranking-heading" title={t('games.overall')} />

      <Typography variant="body2" color="text.secondary" sx={{ ...contentInsetSx, pb: 0 }}>
        {t('games.rankDescription')}
      </Typography>
      {isAuthenticated && (
        <Box sx={{ ...contentInsetSx, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" gap={2} justifyContent="space-between" alignItems="baseline">
            <Box>
              <Typography variant="metric" fontSize={36}>
                {isLoading ? '—' : player ? player.score.toLocaleString() : '—'}
              </Typography>
              <Typography display="block" variant="label" color="text.secondary" sx={{ mt: 1 }}>
                {t('games.overallScore')}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="metric" fontSize={28}>
                #{player?.rank ?? '—'}
              </Typography>
              <Typography display="block" variant="label" color="text.secondary" sx={{ mt: 1 }}>
                {t('games.yourPosition')}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 3, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('games.played')}
            </Typography>

            <Typography variant="caption">
              {overviewLoading || overviewError
                ? '—'
                : `${overview.playedCount}/${gamesCatalog.length}`}
            </Typography>
          </Stack>

          <Stack direction="row" gap={0.5}>
            {scoreParts.map(({ id, score }) => (
              <Box
                key={id}
                title={`${t(`games.catalog.${id}.title`)}: ${score}`}
                sx={{
                  flex: 1,
                  height: 4,
                  bgcolor: score ? 'primary.main' : 'action.disabledBackground',
                }}
              />
            ))}
          </Stack>

          {Boolean(overviewError) && (
            <Stack gap={1} sx={{ mt: 2 }}>
              <Typography variant="caption" color="error.main">
                {t('games.overviewError')}
              </Typography>
              <Button size="small" onClick={onRetryOverview}>
                {t('games.retry')}
              </Button>
            </Stack>
          )}
        </Box>
      )}

      <Stack direction="row" justifyContent="space-between" gap={1} sx={contentInsetSx}>
        <Typography variant="label" color="text.secondary">
          {t('games.topTen')}
        </Typography>

        {leaderboard && (
          <Typography variant="caption" color="text.secondary">
            {t('games.players', { count: leaderboard.totalPlayers })}
          </Typography>
        )}
      </Stack>

      {leaderboardError ? (
        <Stack gap={1} sx={contentInsetSx}>
          <Typography variant="body2" color="error.main">
            {t('games.rankingError')}
          </Typography>
          <Button onClick={onRetryLeaderboard}>{t('games.retry')}</Button>
        </Stack>
      ) : isLoading ? (
        <Stack gap={1} sx={contentInsetSx}>
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} variant="rectangular" height={44} />
          ))}
        </Stack>
      ) : top.length ? (
        <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {top.map((entry) => (
            <PlayerRow key={entry.userId} player={entry} />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={contentInsetSx}>
          {t('games.emptyRanking')}
        </Typography>
      )}

      {player && !top.some((entry) => entry.isCurrentUser) && (
        <Box component="ol" sx={{ m: 0, mt: 2, p: 0, listStyle: 'none' }}>
          <PlayerRow player={player} />
        </Box>
      )}
    </Box>
  );
};

export default OverallRankingPanel;
