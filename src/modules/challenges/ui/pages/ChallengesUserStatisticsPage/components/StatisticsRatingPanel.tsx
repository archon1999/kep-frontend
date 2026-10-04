import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { normalizeSupportedLocale } from 'app/locales/locale';
import { resources } from 'app/routes/resources';
import type { ChallengeUserStatistics } from 'modules/challenges/domain';
import ChallengeRatingChangesChart from 'modules/challenges/ui/shared/components/ChallengeRatingChangesChart';
import {
  getChallengesRatingImageSrc,
  getChallengesRatingLevelByRating,
} from 'shared/components/rating/challengesRating';
import { formatDateTime } from 'shared/lib/dateTime';
import { createNumberFormatter } from 'shared/lib/numberFormat';
import { statisticsInset } from './statisticsStyles';

const StatisticsRatingPanel = ({ statistics }: { statistics: ChallengeUserStatistics }) => {
  const { t, i18n } = useTranslation();
  const [range, setRange] = useState('all');
  const history = useMemo(
    () =>
      [...statistics.ratingHistory].sort((a, b) =>
        (a.finishedAt ?? '').localeCompare(b.finishedAt ?? ''),
      ),
    [statistics.ratingHistory],
  );
  const visibleHistory = range === 'recent' ? history.slice(-50) : history;
  const latest = history[history.length - 1];
  const general = statistics.general;
  const locale = normalizeSupportedLocale(i18n.language);
  const number = createNumberFormatter({ maximumFractionDigits: 0, useGrouping: false }, locale);
  const delta = createNumberFormatter(
    { maximumFractionDigits: 1, signDisplay: 'exceptZero' },
    locale,
  );
  const rankTitle =
    general?.rankTitle || getChallengesRatingLevelByRating(general?.currentRating)?.title;
  const rankImage = getChallengesRatingImageSrc(rankTitle);

  return (
    <Box component="section" sx={{ p: statisticsInset, fontVariantNumeric: 'tabular-nums' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        sx={{ mb: 4 }}
      >
        <Typography component="h2" variant="h6">
          {t('challenges.statisticsPage.ratingHistory')}
        </Typography>
        {history.length > 50 && (
          <TextField
            select
            size="small"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            slotProps={{
              select: { inputProps: { 'aria-label': t('challenges.statisticsPage.rating.range') } },
            }}
            sx={{
              minWidth: { xs: 128, sm: 168 },
              '& .MuiInputBase-root': { fontSize: 14 },
            }}
          >
            <MenuItem value="all">{t('challenges.statisticsPage.rating.all')}</MenuItem>
            <MenuItem value="recent">{t('challenges.statisticsPage.rating.recent')}</MenuItem>
          </TextField>
        )}
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        gap={2.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Typography variant="h4" component="p" fontWeight={500}>
              {general ? number.format(general.currentRating) : '—'}
            </Typography>
            {rankImage && (
              <Box
                component="img"
                src={rankImage}
                alt={rankTitle}
                sx={{ width: 36, height: 36, objectFit: 'contain' }}
              />
            )}
          </Stack>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('challenges.statisticsPage.cards.currentRating')}
            </Typography>
            {general?.ratingPlace != null && (
              <>
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  ·
                </Box>
                <Link
                  component={RouterLink}
                  to={resources.ChallengesRating}
                  underline="hover"
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                  title={t('challenges.totalPlayers', { count: general.playersCount })}
                >
                  {t('challenges.statisticsPage.rankPlace', {
                    value: number.format(general.ratingPlace),
                  })}
                </Link>
              </>
            )}
          </Stack>
        </Box>
        <Stack direction="row" gap={{ xs: 3, sm: 4 }}>
          {[
            { key: 'overview.bestRating', value: general?.bestRating, date: general?.bestRatingAt },
            { key: 'lowestRating', value: general?.worstRating, date: general?.worstRatingAt },
          ].map((record) => (
            <Box key={record.key}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('challenges.statisticsPage.' + record.key)}
              </Typography>
              <Typography variant="h5" component="p" fontWeight={500} sx={{ mt: 0.5 }}>
                {record.value == null ? '—' : number.format(record.value)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {record.date ? formatDateTime(record.date, 'compactDateNoComma') : '—'}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
      <ChallengeRatingChangesChart
        history={visibleHistory}
        height={300}
        rankBandOpacity={0}
        monochrome
        markerSize={0}
        lineWidth={2}
        smooth={false}
        tooltipTrigger="axis"
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={1}
        sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}
      >
        <Typography variant="caption" color="text.secondary">
          {t('challenges.statisticsPage.rating.ratedCount', { count: history.length })}
        </Typography>
        {latest && (
          <Typography variant="caption" color="text.secondary">
            {latest.opponentUsername}
            {' · '}
            <Box
              component="span"
              sx={{
                fontWeight: 600,
                color:
                  latest.delta > 0
                    ? 'success.main'
                    : latest.delta < 0
                      ? 'error.main'
                      : 'text.secondary',
              }}
            >
              {delta.format(latest.delta)} {t('challenges.statisticsPage.rating.pointsUnit')}
            </Box>
            {latest.finishedAt
              ? ` · ${formatDateTime(latest.finishedAt, 'compactDateNoComma')}`
              : ''}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default StatisticsRatingPanel;
