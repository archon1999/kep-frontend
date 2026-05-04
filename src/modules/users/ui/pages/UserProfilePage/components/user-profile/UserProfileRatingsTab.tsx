import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getResourceByUsername, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import {
  useChallengeRatingChanges,
  useChallengeUserRating,
} from 'modules/challenges/application/queries';
import ChallengeRatingChangesChartCard from 'modules/challenges/ui/shared/components/ChallengeRatingChangesChartCard';
import { useContestRatingChanges } from 'modules/contests/application/queries';
import ContestRatingChangesChartCard from 'modules/contests/ui/shared/components/ContestRatingChangesChartCard';
import { useUserProblemsRating } from 'modules/problems/application/queries';
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import KepIcon from 'shared/components/base/KepIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { KepIconName } from 'shared/config/icons';
import { useUserRatings } from 'modules/users/application/queries';

const RatingHeader = ({
  icon,
  title,
  children,
}: {
  icon: KepIconName;
  title: string;
  children?: ReactNode;
}) => (
  <Box
    sx={(theme) => ({
      px: 2,
      py: 1.5,
      borderBottom: 1,
      borderColor: 'divider',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(
        theme.palette.primary.main,
        0.04,
      )})`,
    })}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.25}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar
          variant="rounded"
          sx={(theme) => ({
            width: 40,
            height: 40,
            borderRadius: '8px',
            bgcolor: alpha(theme.palette.primary.main, 0.14),
            color: 'primary.main',
          })}
        >
          <KepIcon name={icon} fontSize={24} />
        </Avatar>
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
      </Stack>

      {children ? (
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
          {children}
        </Stack>
      ) : null}
    </Stack>
  </Box>
);

const LoadingCard = () => (
  <Card variant="outlined" sx={{ borderRadius: '8px' }}>
    <CardContent sx={{ py: 5 }}>
      <Stack direction="column" spacing={1.5} alignItems="center">
        <Skeleton variant="circular" width={42} height={42} />
        <Skeleton variant="text" width="42%" />
        <Skeleton variant="rounded" width="78%" height={18} />
      </Stack>
    </CardContent>
  </Card>
);

const StatBadge = ({
  icon,
  label,
  color = 'primary',
}: {
  icon?: KepIconName;
  label: ReactNode;
  color?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'default';
}) => (
  <Chip
    size="small"
    color={color}
    variant="outlined"
    label={
      <Stack direction="row" spacing={0.5} alignItems="center">
        {icon ? <KepIcon name={icon} fontSize={14} /> : null}
        <span>{label}</span>
      </Stack>
    }
  />
);

const UserProfileRatingsTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();

  const { data: userRatings, isLoading: isRatingsLoading } = useUserRatings(username);
  const { data: problemsRating, isLoading: isProblemsLoading } = useUserProblemsRating(username);
  const { data: challengesRating, isLoading: isChallengesLoading } =
    useChallengeUserRating(username);
  const { data: contestRatingChanges, isLoading: isContestChangesLoading } =
    useContestRatingChanges(username);
  const { data: challengeRatingChanges, isLoading: isChallengeChangesLoading } =
    useChallengeRatingChanges(username);

  const contestsRating = userRatings?.contestsRating;

  const sortedContestChanges = useMemo(() => {
    const changes = contestRatingChanges ?? [];
    return [...changes].sort(
      (a, b) =>
        dayjs(a.contestStartDate ?? a.contestTitle ?? '').valueOf() -
        dayjs(b.contestStartDate ?? b.contestTitle ?? '').valueOf(),
    );
  }, [contestRatingChanges]);

  const sortedChallengeChanges = useMemo(() => {
    const changes = challengeRatingChanges ?? [];
    return [...changes].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  }, [challengeRatingChanges]);

  const difficultyEntries = useMemo(() => {
    const difficulties = problemsRating?.difficulties;
    if (!difficulties) return [];

    return difficultyOptions.map((option) => ({
      key: option.key,
      value: difficulties[option.key] ?? 0,
      color: difficultyColorByKey[option.key],
    }));
  }, [problemsRating?.difficulties]);

  const contestMaxChange = useMemo(() => {
    if (!sortedContestChanges.length) return undefined;
    return sortedContestChanges.reduce((best, item) =>
      Number(item.newRating ?? 0) > Number(best.newRating ?? 0) ? item : best,
    );
  }, [sortedContestChanges]);

  const contestLatestChange = sortedContestChanges[sortedContestChanges.length - 1];
  const contestLatestRating = contestsRating?.value ?? contestLatestChange?.newRating;
  const contestLatestTitle = contestsRating?.title ?? contestLatestChange?.newRatingTitle;
  const contestMaxRating = contestMaxChange?.newRating;
  const contestMaxTitle = contestMaxChange?.newRatingTitle ?? contestLatestTitle;

  const isMainLoading = isProblemsLoading || isRatingsLoading || isChallengesLoading;

  if (isMainLoading) {
    return (
      <Stack direction="column" spacing={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      <Card variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <RatingHeader icon="problem" title={t('problems.title')}>
          <Tooltip title={t('users.profile.ratings.solved')} arrow>
            <span>
              <StatBadge icon="check" label={problemsRating?.solved ?? 0} color="success" />
            </span>
          </Tooltip>
          <Tooltip title={t('users.profile.ratings.rating')} arrow>
            <span>
              <StatBadge icon="rating" label={problemsRating?.rating ?? 0} />
            </span>
          </Tooltip>
        </RatingHeader>

        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(4, minmax(0, 1fr))',
                md: `repeat(${Math.max(difficultyEntries.length, 1)}, minmax(0, 1fr))`,
              },
              gap: 1.5,
              textAlign: 'center',
            }}
          >
            {difficultyEntries.map((difficulty) => (
              <Box key={difficulty.key}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {t(`problems.difficulty.${difficulty.key}` as const)}
                </Typography>
                <Typography variant="h6" color={`${difficulty.color}.main`} fontWeight={800}>
                  {difficulty.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Button
            component={RouterLink}
            to={getResourceByUsername(resources.AttemptsByUser, username)}
            variant="outlined"
            color="primary"
            size="small"
            fullWidth
          >
            {t('problems.attempts.title')}
          </Button>
        </CardContent>
      </Card>

      {isContestChangesLoading ? (
        <Card variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <RatingHeader icon="contests" title={t('contests.title')}>
            <Chip
              size="small"
              variant="outlined"
              label={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <ContestsRatingChip title={contestLatestTitle} imgSize={16} />
                  <span>{contestLatestRating ?? 0}</span>
                </Stack>
              }
            />
            <Chip
              size="small"
              variant="outlined"
              label={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <ContestsRatingChip title={contestMaxTitle} imgSize={16} />
                  <span>{contestMaxRating ?? 0}</span>
                </Stack>
              }
            />
            <StatBadge label={sortedContestChanges.length} />
          </RatingHeader>

          <CardContent>
            <Skeleton variant="rectangular" height={260} />
          </CardContent>
        </Card>
      ) : (
        <ContestRatingChangesChartCard
          title={t('contests.title')}
          changes={contestRatingChanges}
          username={username}
          emptyText={t('users.profile.ratings.noHistory')}
          height={300}
          extra={
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                variant="outlined"
                label={
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <ContestsRatingChip title={contestLatestTitle} imgSize={16} />
                    <span>{contestLatestRating ?? 0}</span>
                  </Stack>
                }
              />
              <Chip
                size="small"
                variant="outlined"
                label={
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <ContestsRatingChip title={contestMaxTitle} imgSize={16} />
                    <span>{contestMaxRating ?? 0}</span>
                  </Stack>
                }
              />
              <StatBadge label={sortedContestChanges.length} />
            </Stack>
          }
        />
      )}

      {isChallengeChangesLoading ? (
        <Card variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <RatingHeader icon="challenges" title={t('challenges.title')}>
            <ChallengesRatingChip title={challengesRating?.rankTitle} />
            <ChallengesRatingChip
              title={challengesRating?.rankTitle}
              rating={challengesRating?.rating ?? 0}
            />
            <StatBadge
              label={`${challengesRating?.wins ?? 0}W ${challengesRating?.draws ?? 0}D ${
                challengesRating?.losses ?? 0
              }L`}
            />
          </RatingHeader>

          <CardContent>
            <Skeleton variant="rectangular" height={260} />
          </CardContent>
        </Card>
      ) : (
        <ChallengeRatingChangesChartCard
          title={t('challenges.title')}
          changes={challengeRatingChanges}
          emptyText={t('users.profile.ratings.noHistory')}
          height={300}
          extra={
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
              <ChallengesRatingChip title={challengesRating?.rankTitle} />
              <ChallengesRatingChip
                title={challengesRating?.rankTitle}
                rating={challengesRating?.rating ?? 0}
              />
              <StatBadge
                label={`${challengesRating?.wins ?? 0}W ${challengesRating?.draws ?? 0}D ${
                  challengesRating?.losses ?? 0
                }L`}
              />
              <StatBadge label={sortedChallengeChanges.length} />
            </Stack>
          }
        />
      )}
    </Stack>
  );
};

export default UserProfileRatingsTab;
