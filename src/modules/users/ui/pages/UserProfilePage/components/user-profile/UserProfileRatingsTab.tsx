import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import {
  useChallengeRatingChanges,
  useChallengeUserRating,
} from 'modules/challenges/application/queries';
import ChallengeRatingChangesChart from 'modules/challenges/ui/shared/components/ChallengeRatingChangesChart';
import { useContestRatingChanges } from 'modules/contests/application/queries';
import ContestRatingChangesChart from 'modules/contests/ui/shared/components/ContestRatingChangesChart';
import { useUserProblemsRating } from 'modules/problems/application/queries';
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import { useUserRatings } from 'modules/users/application/queries';
import KepIcon from 'shared/components/base/KepIcon';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { KepIconName } from 'shared/config/icons';
import { getDateTimeValue } from 'shared/lib/dateTime';

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
    variant="soft"
    label={
      <Stack direction="row" spacing={0.5} alignItems="center">
        {icon ? <KepIcon name={icon} fontSize={14} /> : null}
        <span>{label}</span>
      </Stack>
    }
  />
);

const ContestHeaderMetrics = ({
  currentTitle,
  currentRating,
  maxTitle,
  maxRating,
  currentLabel,
  maxLabel,
}: {
  currentTitle?: string;
  currentRating: ReactNode;
  maxTitle?: string;
  maxRating: ReactNode;
  currentLabel: string;
  maxLabel: string;
}) => {
  const currentIcon = <ContestsRatingChip title={currentTitle} imgSize={16} />;
  const maxIcon = <ContestsRatingChip title={maxTitle} imgSize={16} />;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      divider={<Divider orientation="vertical" flexItem />}
    >
      {[
        { label: currentLabel, value: currentRating, icon: currentIcon },
        { label: maxLabel, value: maxRating, icon: maxIcon },
      ].map((metric) => (
        <Tooltip key={metric.label} title={metric.label} arrow>
          <span>
            <Chip
              size="small"
              variant="soft"
              label={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {metric.icon}
                  <Typography component="span" variant="caption" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <strong>{metric.value}</strong>
                </Stack>
              }
            />
          </span>
        </Tooltip>
      ))}
    </Stack>
  );
};

const ChallengeHeaderMetrics = ({
  currentRankTitle,
  maxRankTitle,
  currentRating,
  maxRating,
  wins,
  draws,
  losses,
  currentLabel,
  maxLabel,
}: {
  currentRankTitle?: string | null;
  maxRankTitle?: string | null;
  currentRating: number;
  maxRating: number;
  wins: number;
  draws: number;
  losses: number;
  currentLabel: string;
  maxLabel: string;
}) => (
  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="center">
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography component="span" color="success.main" fontWeight={500}>
        {wins}W
      </Typography>
      <Typography component="span" color="text.secondary" fontWeight={500}>
        {draws}D
      </Typography>
      <Typography component="span" color="error.main" fontWeight={500}>
        {losses}L
      </Typography>
    </Stack>
    <Stack
      divider={<Divider orientation="vertical" flexItem />}
      direction="row"
      spacing={0.75}
      flexWrap="wrap"
      useFlexGap
      alignItems="center"
    >
      <Stack direction="row" spacing={0.5}>
        <Tooltip title={currentLabel} arrow>
          <span>
            <ChallengesRatingChip title={currentRankTitle} />
          </span>
        </Tooltip>
        <Tooltip title={currentLabel} arrow>
          <span>
            <Chip
              size="small"
              variant="soft"
              label={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography component="span" variant="caption" color="text.secondary">
                    {currentLabel}
                  </Typography>
                  <strong>{currentRating}</strong>
                </Stack>
              }
            />
          </span>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={0.5}>
        <Tooltip title={maxLabel} arrow>
          <span>
            <ChallengesRatingChip title={maxRankTitle} />
          </span>
        </Tooltip>
        <Tooltip title={maxLabel} arrow>
          <span>
            <Chip
              size="small"
              variant="soft"
              label={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography component="span" variant="caption" color="text.secondary">
                    {maxLabel}
                  </Typography>
                  <strong>{maxRating}</strong>
                </Stack>
              }
            />
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  </Stack>
);

const UserProfileRatingsTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();

  const { data: userRatings, isLoading: isRatingsLoading } = useUserRatings(username);
  const { data: problemsRating, isLoading: isProblemsLoading } = useUserProblemsRating(username);
  const { data: challengesRating, isLoading: isChallengesLoading } =
    useChallengeUserRating(username);
  const { data: contestRatingChanges } = useContestRatingChanges(username);
  const { data: challengeRatingChanges } = useChallengeRatingChanges(username);

  const contestsRating = userRatings?.contestsRating;

  const sortedContestChanges = useMemo(() => {
    const changes = contestRatingChanges ?? [];
    return [...changes].sort(
      (a, b) =>
        getDateTimeValue(a.contestStartDate ?? a.contestTitle ?? '') -
        getDateTimeValue(b.contestStartDate ?? b.contestTitle ?? ''),
    );
  }, [contestRatingChanges]);

  const sortedChallengeChanges = useMemo(() => {
    const changes = challengeRatingChanges ?? [];
    return [...changes].sort((a, b) => getDateTimeValue(a.date) - getDateTimeValue(b.date));
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

  const challengeMaxRating = useMemo(() => {
    if (!sortedChallengeChanges.length) return undefined;
    return Math.max(...sortedChallengeChanges.map((change) => change.value));
  }, [sortedChallengeChanges]);

  const contestLatestRating = contestsRating?.value ?? 0;
  const contestLatestTitle = contestsRating?.title;
  const contestMaxRating = contestMaxChange?.newRating ?? contestLatestRating;
  const contestMaxTitle = contestMaxChange?.newRatingTitle ?? contestLatestTitle;
  const challengeCurrentRating = challengesRating?.rating ?? 0;
  const challengeCurrentTitle = challengesRating?.rankTitle;
  const challengeMaxRatingValue = challengeMaxRating ?? challengeCurrentRating;

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
      <Stack direction="column" spacing={2}>
        <Paper
          background={1}
          sx={{
            p: 2,
            borderRadius: 4,
            outline: 0,
          }}
        >
          <Stack direction="row" mb={3} justifyContent="space-between">
            <Typography variant="h6">{t('problems.title')}</Typography>
            <Stack alignItems="center" direction="row" spacing={1}>
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
              <Button
                component={RouterLink}
                to={getResourceByUsername(resources.AttemptsByUser, username)}
                variant="text"
                color="primary"
                size="small"
                sx={{ flexShrink: 0 }}
              >
                {t('problems.attempts.title')}
              </Button>
            </Stack>
          </Stack>

          <Stack direction="column">
            <Stack direction="column" spacing={1.5} sx={{ minWidth: 0 }}>
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
                    <Typography variant="caption" fontWeight={500}>
                      {t(`problems.difficulty.${difficulty.key}` as const)}
                    </Typography>
                    <Typography variant="h6" color={`${difficulty.color}.main`} fontWeight={800}>
                      {difficulty.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'visible' }}>
        <CardContent
          sx={{
            overflow: 'visible',
            p: 2,
          }}
        >
          <Stack direction="column" spacing={1.25} sx={{ overflow: 'visible' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Typography variant="h6">{t('contests.title')}</Typography>
              <ContestHeaderMetrics
                currentTitle={contestLatestTitle}
                currentRating={contestLatestRating}
                maxTitle={contestMaxTitle}
                maxRating={contestMaxRating}
                currentLabel={t('users.profile.ratings.rating')}
                maxLabel={t('users.profile.ratings.maxRating')}
              />
            </Stack>
            <ContestRatingChangesChart username={username} height={300} />
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'visible' }}>
        <CardContent
          sx={{
            overflow: 'visible',
            p: 2,
          }}
        >
          <Stack direction="column" spacing={1.25} sx={{ overflow: 'visible' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Typography variant="h6">{t('challenges.title')}</Typography>
              <ChallengeHeaderMetrics
                currentRankTitle={challengeCurrentTitle}
                maxRankTitle={challengeCurrentTitle}
                currentRating={challengeCurrentRating}
                maxRating={challengeMaxRatingValue}
                wins={challengesRating?.wins ?? 0}
                draws={challengesRating?.draws ?? 0}
                losses={challengesRating?.losses ?? 0}
                currentLabel={t('users.profile.ratings.rating')}
                maxLabel={t('users.profile.ratings.maxRating')}
              />
            </Stack>
            <ChallengeRatingChangesChart username={username} height={300} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default UserProfileRatingsTab;
