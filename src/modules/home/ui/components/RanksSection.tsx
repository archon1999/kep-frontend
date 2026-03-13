import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import type { HomeUserRatings } from '../../domain/entities/home.entity';

interface RanksSectionProps {
  ratings?: HomeUserRatings | null;
  isLoading?: boolean;
}

type RatingKey = 'skillsRating' | 'activityRating' | 'contestsRating' | 'challengesRating';

interface RankCardMeta {
  key: RatingKey;
  label: string;
  infoKey: string;
  icon: Parameters<typeof KepIcon>[0]['name'];
}

interface RatingEntry {
  value?: number;
  rank?: number;
  percentile?: number;
}

const rankCards: RankCardMeta[] = [
  {
    key: 'skillsRating',
    label: 'homePage.ranks.labels.skills',
    infoKey: 'homePage.ranks.info.skillsRating',
    icon: 'rating',
  },
  {
    key: 'activityRating',
    label: 'homePage.ranks.labels.activity',
    infoKey: 'homePage.ranks.info.activityRating',
    icon: 'rating',
  },
  {
    key: 'contestsRating',
    label: 'homePage.ranks.labels.contests',
    infoKey: 'homePage.ranks.info.contests',
    icon: 'contests',
  },
  {
    key: 'challengesRating',
    label: 'homePage.ranks.labels.challenges',
    infoKey: 'homePage.ranks.info.challenges',
    icon: 'challenges',
  },
];

const getRatingEntry = (ratings?: HomeUserRatings | null, key?: RatingKey): RatingEntry => {
  if (!ratings || !key) {
    return {};
  }

  return (ratings as unknown as Record<string, RatingEntry | undefined>)[key] ?? {};
};

const RanksSection = ({ ratings, isLoading }: RanksSectionProps) => {
  const { t } = useTranslation();
  const cards = useMemo(
    () => rankCards.map((card) => ({ ...card, ...getRatingEntry(ratings, card.key) })),
    [ratings],
  );

  return (
    <Stack direction="column" spacing={3}>
      <Typography variant="h5" fontWeight={600}>
        {t('homePage.ranks.title')}
      </Typography>

      <Stack spacing={2} direction="column">
        {cards.map(({ label, infoKey, icon, value, rank, percentile }) => {
          if (isLoading) {
            return <Skeleton key={label} variant="rounded" height={144} />;
          }

          return (
            <Paper
              key={label}
              background={2}
              sx={{
                outline: 'none',
                p: 2,
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <KepIcon name={icon} fontSize={26} color="primary.main" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    {t(label)}
                  </Typography>
                </Stack>

                <Tooltip title={t(infoKey)}>
                  <IconButton size="small" color="primary" sx={{ bgcolor: 'primary.lighter' }}>
                    <IconifyIcon icon="material-symbols:info-outline-rounded" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography variant="h4" fontWeight={700}>
                  {value ?? '—'}
                </Typography>

                <Tooltip title={t('homePage.ranks.percentile', { percentile: percentile })}>
                  <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
                    #{rank}
                  </Typography>
                </Tooltip>
              </Stack>

              <Tooltip title={percentile}>
                <LinearProgress variant="determinate" value={percentile ?? 0} />
              </Tooltip>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default RanksSection;
