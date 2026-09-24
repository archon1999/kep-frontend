import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, ButtonBase, Paper, Stack, Typography } from '@mui/material';
import type { GamesOverview } from 'modules/games/application';
import type { GamesLeaderboard, LeaderboardPlayer } from 'modules/games/domain';
import { gamesCatalog } from 'modules/games/ui/shared';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';

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

const podiumColors = ['#D99214', '#8396A9', '#B5744D'] as const;

const PlayerRow = ({ player }: { player: LeaderboardPlayer }) => (
  <Stack
    component="li"
    direction="row"
    spacing={1.25}
    alignItems="center"
    sx={{
      minWidth: 0,
      minHeight: 46,
      px: 1.25,
      borderRadius: 1.25,
      bgcolor: player.isCurrentUser ? 'action.selected' : undefined,
    }}
  >
    <Typography
      variant="body2"
      sx={{
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
          borderRadius: 1,
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
    <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>
      {player.score.toLocaleString()}
    </Typography>
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
  const scoreParts = gamesCatalog.map(({ id, color }) => ({
    id,
    color,
    score: overview.bestByGame[id] ?? 0,
  }));

  return (
    <Box
      component="section"
      aria-labelledby="overall-ranking-heading"
      sx={{ width: '100%', maxWidth: isAuthenticated ? 1040 : 680, mx: 'auto' }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1.5 }}>
        <Typography id="overall-ranking-heading" variant="h6" component="h2" fontWeight={600}>
          {t('games.overall')}
        </Typography>
        {leaderboard && (
          <Typography variant="caption" color="text.secondary">
            {t('games.players', { count: leaderboard.totalPlayers })}
          </Typography>
        )}
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: isAuthenticated ? 'minmax(0, 300px) minmax(0, 1fr)' : '1fr',
          },
          gap: 2,
        }}
      >
        {isAuthenticated && (
          <Paper
            background={5}
            sx={{
              border: 0,
              outline: 0,
              boxShadow: 'none',
              borderRadius: 2.5,
              p: { xs: 2.5, md: 3 },
              minHeight: 160,
            }}
          >
            <Stack spacing={2.5}>
              <Stack
                direction="row"
                alignItems="flex-end"
                justifyContent="space-between"
                spacing={1}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 33,
                      lineHeight: 1,
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {player ? player.score.toLocaleString() : '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('games.overallScore')}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 23, lineHeight: 1, fontWeight: 600 }}>
                    #{player?.rank ?? '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('games.yourPosition')}
                  </Typography>
                </Box>
              </Stack>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('games.played')}
                  </Typography>
                  <Typography variant="caption" fontWeight={700}>
                    {overviewLoading || overviewError
                      ? '—'
                      : `${overview.playedCount}/${gamesCatalog.length}`}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  {scoreParts.map(({ id, color, score }) => (
                    <Box
                      key={id}
                      title={`${t(`games.catalog.${id}.title`)}: ${score}`}
                      sx={{
                        flex: 1,
                        height: 8,
                        bgcolor: score ? color : 'action.disabledBackground',
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
            {Boolean(overviewError) && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="error.main">
                  {t('games.overviewError')}
                </Typography>
                <Button size="small" onClick={onRetryOverview}>
                  {t('games.retry')}
                </Button>
              </Stack>
            )}
          </Paper>
        )}
        <Paper
          background={1}
          sx={{
            border: 0,
            outline: 0,
            boxShadow: 'none',
            borderRadius: 2.5,
            p: { xs: 2, md: 2.5 },
            minWidth: 0,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ px: 1.25, mb: 0.75 }}>
            {t('games.topTen')}
          </Typography>
          {leaderboardError ? (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.25 }}>
              <Typography variant="body2" color="error.main">
                {t('games.rankingError')}
              </Typography>
              <Button size="small" onClick={onRetryLeaderboard}>
                {t('games.retry')}
              </Button>
            </Stack>
          ) : isLoading ? (
            <Typography variant="body2" color="text.secondary" sx={{ px: 1.25 }}>
              …
            </Typography>
          ) : top.length ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: top.length > 5 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
                },
                columnGap: 2,
              }}
            >
              <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {top.slice(0, 5).map((entry) => (
                  <PlayerRow key={entry.userId} player={entry} />
                ))}
              </Box>
              {top.length > 5 && (
                <Box component="ol" start={6} sx={{ m: 0, p: 0, listStyle: 'none' }}>
                  {top.slice(5).map((entry) => (
                    <PlayerRow key={entry.userId} player={entry} />
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ px: 1.25, py: 1 }}>
              {t('games.emptyRanking')}
            </Typography>
          )}
          {player && !top.some((entry) => entry.isCurrentUser) && (
            <Box component="ol" sx={{ m: 0, mt: 1, p: 0, listStyle: 'none' }}>
              <PlayerRow player={player} />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default OverallRankingPanel;
