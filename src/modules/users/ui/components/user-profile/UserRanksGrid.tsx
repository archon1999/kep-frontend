import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid, Skeleton, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';
import { UserRatingInfo, UserRatings } from '../../../domain/entities/user.entity';


const ratingConfig = [
  { key: 'skillsRating', labelKey: 'users.columns.skills', icon: 'rating' },
  { key: 'activityRating', labelKey: 'users.columns.activity', icon: 'todo' },
  { key: 'contestsRating', labelKey: 'users.columns.contests', icon: 'contests' },
  { key: 'challengesRating', labelKey: 'users.columns.challenges', icon: 'challenges' },
] as const;

type RatingKey = (typeof ratingConfig)[number]['key'];

const getStat = (ratings?: UserRatings, key?: RatingKey): UserRatingInfo | undefined => {
  if (!ratings || !key) return undefined;
  return (ratings as any)?.[key] as UserRatingInfo | undefined;
};

type UserRanksGridProps = {
  ratings?: UserRatings;
  isLoading?: boolean;
};

const UserRanksGrid = ({ ratings, isLoading }: UserRanksGridProps) => {
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      ratingConfig.map((meta) => ({
        ...meta,
        stat: getStat(ratings, meta.key),
      })),
    [ratings],
  );

  return (
    <Grid container spacing={1.5}>
      {items.map(({ key, labelKey, icon, stat }) => (
        <Grid key={key} size={{ xs: 6, md: 3 }}>
          <Card
            background={2}
            sx={{
              p: 1.5,
              height: '100%',
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
            }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <KepIcon name={icon} fontSize={18} color="primary.main" />
              <Typography variant="caption" color="text.secondary">
                {t(labelKey)}
              </Typography>
            </Stack>

            {isLoading ? (
              <Skeleton variant="text" width="80%" />
            ) : (
              <Typography variant="subtitle1" fontWeight={700}>
                {stat?.value ?? t('users.emptyValue')}
              </Typography>
            )}

            {stat?.rank !== undefined ? (
              <Typography variant="caption" color="text.secondary">
                #{stat.rank}
              </Typography>
            ) : null}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserRanksGrid;
