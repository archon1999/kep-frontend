import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Grid, Link, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { getRankColor } from 'app/theme/colors/medals';
import type { ContestUserStatisticsOpponent } from 'modules/contests/domain/entities/contest-user-statistics.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import { createNumberFormatter } from 'shared/lib/numberFormat';

const ContestStatisticsOpponents = ({
  opponents,
}: {
  opponents: ContestUserStatisticsOpponent[];
}) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter({ maximumFractionDigits: 0 }, i18n.language);
  return (
    <Grid container spacing={0}>
      {opponents.map((opponent, index) => (
        <Grid
          key={`${opponent.type}-${opponent.opponent}`}
          size={{ xs: 12, md: 4 }}
          sx={{
            minWidth: 0,
            px: { xs: 0, md: index === 0 ? 0 : 2 },
            pr: { md: index === opponents.length - 1 ? 0 : 2 },
            py: { xs: 1.5, md: 0 },
            borderRightStyle: 'solid',
            borderBottomStyle: 'solid',
            borderRightWidth: { xs: 0, md: index === opponents.length - 1 ? 0 : 1 },
            borderBottomWidth: { xs: index === opponents.length - 1 ? 0 : 1, md: 0 },
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            {opponent.type === 'user' ? (
              <UserPopover username={opponent.opponent}>
                <Typography variant="body2" fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
                  {opponent.opponent}
                </Typography>
              </UserPopover>
            ) : (
              <Typography variant="body2" fontWeight={600}>
                {opponent.opponent}
              </Typography>
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: 'right', fontSize: 11 }}
            >
              {t('contests.statistics.sharedContests', { count: opponent.sharedCount })}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 1, mb: 1.5 }}>
            <Typography variant="metric" color="success.main" fontSize={23}>
              {number.format(opponent.userWins)}
            </Typography>
            <Typography color="text.disabled">:</Typography>
            <Typography variant="metric" color="error.main" fontSize={23}>
              {number.format(opponent.opponentWins)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {t('contests.statistics.headToHead')}
            </Typography>
          </Stack>
          <Box sx={{ maxHeight: 284, overflowY: 'auto', scrollbarGutter: 'stable' }}>
            {opponent.contests.map((contest) => (
              <Box key={contest.contestId} sx={{ py: 1, borderTop: 1, borderColor: 'divider' }}>
                <Link
                  component={RouterLink}
                  to={getResourceById(resources.Contest, contest.contestId)}
                  underline="hover"
                  color="text.primary"
                  sx={{
                    fontSize: 12,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    display: 'block',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {contest.contestTitle}
                </Link>
                <Stack direction="row" gap={1} alignItems="baseline" sx={{ mt: 0.5 }}>
                  <Typography
                    variant="metric"
                    fontSize={16}
                    color={getRankColor(
                      contest.userRank,
                      contest.userRank <= contest.opponentRank ? 'success.main' : 'error.main',
                    )}
                  >
                    #{number.format(contest.userRank)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({number.format(contest.userPoints)})
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {t('contests.statistics.versus')}
                  </Typography>
                  <Typography
                    variant="metric"
                    fontSize={16}
                    color={getRankColor(
                      contest.opponentRank,
                      contest.opponentRank <= contest.userRank ? 'success.main' : 'error.main',
                    )}
                  >
                    #{number.format(contest.opponentRank)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({number.format(contest.opponentPoints)})
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
export default ContestStatisticsOpponents;
