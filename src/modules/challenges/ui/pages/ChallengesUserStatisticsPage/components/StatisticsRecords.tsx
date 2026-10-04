import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Divider, Grid, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { normalizeSupportedLocale } from 'app/locales/locale';
import { getResourceById, resources } from 'app/routes/resources';
import type {
  ChallengeStatisticsMatchRecord,
  ChallengeStatisticsRatingRecord,
  ChallengeUserStatistics,
} from 'modules/challenges/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { statisticsInset, statisticsPanelSx } from './statisticsStyles';

const panelSx = { p: statisticsInset, minWidth: 0 };
type RecordEntry = ChallengeStatisticsRatingRecord | ChallengeStatisticsMatchRecord;

const StatisticsRecords = ({ statistics }: { statistics: ChallengeUserStatistics }) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter(
    { maximumFractionDigits: 0 },
    normalizeSupportedLocale(i18n.language),
  );
  const ratingChange = createNumberFormatter(
    { maximumFractionDigits: 2 },
    normalizeSupportedLocale(i18n.language),
  );
  const records = statistics.records;
  const highlights: { label: string; entry?: RecordEntry | null; color: string }[] = [
    { label: 'biggestGain', entry: records?.biggestGain, color: 'success.main' },
    { label: 'biggestDrop', entry: records?.biggestDrop, color: 'error.main' },
    { label: 'bestVictory', entry: records?.bestVictory, color: 'success.main' },
    { label: 'worstDefeat', entry: records?.worstDefeat, color: 'error.main' },
    { label: 'mostDominantWin', entry: records?.mostDominantWin, color: 'success.main' },
    { label: 'closestLoss', entry: records?.mostPainfulLoss, color: 'error.main' },
  ];
  const streaks = [
    { label: 'currentWinStreak', data: records?.currentWinStreak, color: 'success.main' },
    { label: 'longestWinStreak', data: records?.longestWinStreak, color: 'success.main' },
    { label: 'currentLossStreak', data: records?.currentLossStreak, color: 'error.main' },
    { label: 'longestLossStreak', data: records?.longestLossStreak, color: 'error.main' },
  ];

  return (
    <Grid container spacing={0} component="section" sx={{ height: 1 }}>
      <Grid size={12}>
        <Paper sx={[statisticsPanelSx, panelSx]}>
          <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
            {t('challenges.statisticsPage.details.records')}
          </Typography>
          <Stack divider={<Divider />}>
            {highlights.map(({ label, entry, color }) => {
              const isMatch = entry && 'userScore' in entry;
              return (
                <Stack key={label} direction="row" alignItems="center" spacing={1.5} sx={{ py: 2 }}>
                  <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {t(`challenges.statisticsPage.records.${label}`)}
                    </Typography>
                    {entry ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflowWrap: 'anywhere' }}
                      >
                        {entry.opponentUsername}
                        {isMatch ? ` (${number.format(entry.opponentRating)})` : ''}
                        {entry.finishedAt
                          ? ` · ${formatDateTime(entry.finishedAt, 'compactDateTimeNoComma')}`
                          : ''}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('challenges.statisticsPage.noData')}
                      </Typography>
                    )}
                  </Stack>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={entry ? color : 'text.disabled'}
                    sx={{
                      fontSize: 18,
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {entry
                      ? isMatch
                        ? `${number.format(entry.userScore)} : ${number.format(entry.opponentScore)}`
                        : `${entry.delta > 0 ? '+' : ''}${ratingChange.format(entry.delta)}`
                      : '—'}
                  </Typography>
                  {entry ? (
                    <Tooltip title={t('challenges.statisticsPage.records.open')}>
                      <IconButton
                        component={RouterLink}
                        to={getResourceById(resources.Challenge, entry.challengeId)}
                        size="small"
                        aria-label={t('challenges.statisticsPage.records.open')}
                        sx={{ flexShrink: 0, color: 'text.secondary' }}
                      >
                        <IconifyIcon
                          icon="material-symbols:arrow-forward-rounded"
                          sx={{ fontSize: 20 }}
                        />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>
              );
            })}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={12}>
        <Paper sx={[statisticsPanelSx, panelSx]}>
          <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
            {t('challenges.statisticsPage.records.streaks')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              columnGap: 4,
              rowGap: 2,
            }}
          >
            {streaks.map(({ label, data, color }) => (
              <Stack key={label} spacing={0.75} sx={{ py: 2 }}>
                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {t(`challenges.statisticsPage.records.${label}`)}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={500}
                    color={data ? color : 'text.disabled'}
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {data ? number.format(data.count) : '—'}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {data?.startAt
                    ? `${formatDateTime(data.startAt, 'compactDate')} – ${formatDateTime(data.endAt, 'compactDate')}`
                    : t('challenges.statisticsPage.noData')}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StatisticsRecords;
