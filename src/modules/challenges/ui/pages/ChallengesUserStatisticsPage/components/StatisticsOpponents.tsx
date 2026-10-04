import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { normalizeSupportedLocale } from 'app/locales/locale';
import { getResourceById, resources } from 'app/routes/resources';
import type {
  ChallengeStatisticsMatchRecord,
  ChallengeStatisticsOpponentRow,
  ChallengeUserStatistics,
} from 'modules/challenges/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { formatDateTime } from 'shared/lib/dateTime';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { statisticsInset, statisticsPanelSx } from './statisticsStyles';

const panelContentSx = { p: statisticsInset, minWidth: 0, fontVariantNumeric: 'tabular-nums' };

const OpponentList = ({ items }: { items: ChallengeStatisticsOpponentRow[] }) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter(
    { maximumFractionDigits: 0 },
    normalizeSupportedLocale(i18n.language),
  );

  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('challenges.statisticsPage.noData')}
      </Typography>
    );
  }

  return (
    <Stack
      component="ul"
      direction="column"
      divider={<Divider component="li" />}
      sx={{ m: 0, p: 0, listStyle: 'none' }}
    >
      {items.map((opponent) => (
        <Stack component="li" key={opponent.username} direction="column" spacing={1} sx={{ py: 2 }}>
          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="baseline">
            <UserPopover username={opponent.username} sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} sx={{ overflowWrap: 'anywhere' }}>
                {opponent.username}
              </Typography>
            </UserPopover>
            <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
              {t('challenges.statisticsPage.opponents.matchCount', { count: opponent.count })}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.statisticsPage.opponents.averageRating', {
                value: number.format(opponent.averageOpponentRating),
              })}
            </Typography>
            <Typography
              variant="body2"
              aria-label={t('challenges.statisticsPage.opponents.record')}
              sx={{ whiteSpace: 'nowrap' }}
            >
              <Box component="span" sx={{ color: 'success.main' }}>
                {number.format(opponent.wins)}
              </Box>
              {' / '}
              {number.format(opponent.draws)}
              {' / '}
              <Box component="span" sx={{ color: 'error.main' }}>
                {number.format(opponent.losses)}
              </Box>
            </Typography>
          </Stack>
          {opponent.lastPlayedAt ? (
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(opponent.lastPlayedAt, 'compactDateTimeNoComma')}
            </Typography>
          ) : null}
        </Stack>
      ))}
    </Stack>
  );
};

const OpponentTable = ({ items }: { items: ChallengeStatisticsOpponentRow[] }) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter(
    { maximumFractionDigits: 0 },
    normalizeSupportedLocale(i18n.language),
  );

  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('challenges.statisticsPage.noData')}
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table
        size="small"
        aria-label={t('challenges.statisticsPage.opponents.mostPlayed')}
        sx={{ minWidth: 640 }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: 0 }}>{t('challenges.statisticsPage.history.opponent')}</TableCell>
            <TableCell align="right">{t('challenges.statisticsPage.challengesShort')}</TableCell>
            <TableCell align="right">{t('challenges.statisticsPage.avgOpponent')}</TableCell>
            <TableCell align="right">{t('challenges.statisticsPage.results.win')}</TableCell>
            <TableCell align="right">{t('challenges.statisticsPage.results.draw')}</TableCell>
            <TableCell align="right">{t('challenges.statisticsPage.results.loss')}</TableCell>
            <TableCell align="right" sx={{ pr: 0 }}>
              {t('challenges.statisticsPage.history.date')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((opponent) => (
            <TableRow
              key={opponent.username}
              sx={{ height: 48, '&:last-child td': { borderBottom: 0 } }}
            >
              <TableCell sx={{ pl: 0, py: 1.5 }}>
                <UserPopover username={opponent.username}>
                  <Typography variant="body2" fontWeight={500}>
                    {opponent.username}
                  </Typography>
                </UserPopover>
              </TableCell>
              <TableCell align="right">{number.format(opponent.count)}</TableCell>
              <TableCell align="right">{number.format(opponent.averageOpponentRating)}</TableCell>
              <TableCell align="right" sx={{ color: 'success.main' }}>
                {number.format(opponent.wins)}
              </TableCell>
              <TableCell align="right">{number.format(opponent.draws)}</TableCell>
              <TableCell align="right" sx={{ color: 'error.main' }}>
                {number.format(opponent.losses)}
              </TableCell>
              <TableCell
                align="right"
                sx={{ pr: 0, whiteSpace: 'nowrap', color: 'text.secondary' }}
              >
                {opponent.lastPlayedAt
                  ? formatDateTime(opponent.lastPlayedAt, 'compactDateTimeNoComma')
                  : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MatchList = ({ items }: { items: ChallengeStatisticsMatchRecord[] }) => {
  const { t, i18n } = useTranslation();
  const number = createNumberFormatter(
    { maximumFractionDigits: 0 },
    normalizeSupportedLocale(i18n.language),
  );

  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('challenges.statisticsPage.noData')}
      </Typography>
    );
  }

  return (
    <Stack
      component="ul"
      direction="column"
      divider={<Divider component="li" />}
      sx={{ m: 0, p: 0, listStyle: 'none' }}
    >
      {items.map((match) => (
        <Stack
          component="li"
          key={match.challengeId}
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ py: 2 }}
        >
          <Stack direction="column" spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap" useFlexGap>
              <UserPopover username={match.opponentUsername} sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500} sx={{ overflowWrap: 'anywhere' }}>
                  {match.opponentUsername}
                </Typography>
              </UserPopover>
              <Typography variant="body2" color="text.secondary">
                {number.format(match.opponentRating)}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {match.finishedAt ? formatDateTime(match.finishedAt, 'compactDateTimeNoComma') : '—'}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            fontWeight={600}
            color={
              match.result === 'win'
                ? 'success.main'
                : match.result === 'loss'
                  ? 'error.main'
                  : 'text.primary'
            }
            sx={{ whiteSpace: 'nowrap' }}
          >
            {number.format(match.userScore)} : {number.format(match.opponentScore)}
          </Typography>
          <Tooltip title={t('challenges.statisticsPage.records.open')}>
            <IconButton
              component={RouterLink}
              to={getResourceById(resources.Challenge, match.challengeId)}
              size="small"
              aria-label={t('challenges.statisticsPage.records.open')}
              sx={{ color: 'text.secondary', flexShrink: 0 }}
            >
              <IconifyIcon icon="material-symbols:arrow-forward-rounded" sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}
    </Stack>
  );
};

const StatisticsOpponents = ({ statistics }: { statistics: ChallengeUserStatistics }) => {
  const { t, i18n } = useTranslation();
  const locale = normalizeSupportedLocale(i18n.language);
  const number = createNumberFormatter({ maximumFractionDigits: 0 }, locale);
  const percentage = createNumberFormatter({ maximumFractionDigits: 1 }, locale);
  const opponents = statistics.opponents;

  if (!opponents) {
    return (
      <Paper component="section" sx={[statisticsPanelSx, panelContentSx]}>
        <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
          {t('challenges.statisticsPage.details.opponents')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('challenges.statisticsPage.noData')}
        </Typography>
      </Paper>
    );
  }

  const buckets = [
    { label: 'higher', data: opponents.vsHigherRated },
    { label: 'same', data: opponents.vsSameRated },
    { label: 'lower', data: opponents.vsLowerRated },
  ];

  return (
    <Grid
      container
      component="section"
      spacing={0}
      aria-label={t('challenges.statisticsPage.details.opponents')}
    >
      <Grid size={{ xs: 12, lg: 5 }}>
        <Stack direction="column" sx={{ height: 1 }}>
          <Paper sx={[statisticsPanelSx, panelContentSx]}>
            <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
              {t('challenges.statisticsPage.opponents.summary')}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t('challenges.statisticsPage.avgOpponent')}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {number.format(opponents.averageOpponentRating)}
              </Typography>
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Stack direction="column" spacing={3}>
              {buckets.map(({ label, data }) => (
                <Stack key={label} direction="column" spacing={1}>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Typography variant="body2">
                      {t('challenges.statisticsPage.buckets.' + label)}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {percentage.format(data.winRate)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, data.winRate))}
                    aria-label={
                      t('challenges.statisticsPage.buckets.' + label) +
                      ': ' +
                      t('challenges.statisticsPage.winRate')
                    }
                    sx={{ height: 4, borderRadius: 0, bgcolor: 'action.hover' }}
                  />
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      {t('challenges.statisticsPage.opponents.matchCount', { count: data.count })}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      aria-label={t('challenges.statisticsPage.opponents.record')}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {number.format(data.wins)} / {number.format(data.draws)} /{' '}
                      {number.format(data.losses)}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
          <Paper sx={[statisticsPanelSx, panelContentSx, { flex: 1 }]}>
            <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
              {t('challenges.statisticsPage.opponents.rivals')}
            </Typography>
            <OpponentList items={opponents.rivals} />
          </Paper>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <Stack direction="column" sx={{ height: 1 }}>
          <Paper sx={[statisticsPanelSx, panelContentSx]}>
            <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
              {t('challenges.statisticsPage.opponents.mostPlayed')}
            </Typography>
            <OpponentTable items={opponents.mostPlayedOpponents} />
          </Paper>
          <Grid container spacing={0} sx={{ flex: 1 }}>
            {[
              { title: 'bestVictories', items: opponents.bestVictories },
              { title: 'worstDefeats', items: opponents.worstDefeats },
            ].map(({ title, items }) => (
              <Grid key={title} size={{ xs: 12, md: 6 }}>
                <Paper sx={[statisticsPanelSx, panelContentSx, { height: 1 }]}>
                  <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
                    {t('challenges.statisticsPage.opponents.' + title)}
                  </Typography>
                  <MatchList items={items} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default StatisticsOpponents;
