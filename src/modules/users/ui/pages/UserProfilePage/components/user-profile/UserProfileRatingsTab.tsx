import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { contentGridSx, contentInsetSx } from 'app/theme/styles/content';
import {
  useChallengeRatingChanges,
  useChallengeUserRating,
} from 'modules/challenges/application/queries';
import ChallengeRatingChangesChart from 'modules/challenges/ui/shared/components/ChallengeRatingChangesChart';
import { useContestRatingChanges } from 'modules/contests/application/queries';
import ContestRatingChangesChart from 'modules/contests/ui/shared/components/ContestRatingChangesChart';
import { useUserProblemsRating } from 'modules/problems/application/queries';
import { difficultyColorByKey, difficultyOptions } from 'modules/problems/config/difficulty';
import ProjectsUserRatingSection from 'modules/projects/ui/shared/components/ProjectsUserRatingSection';
import { useUserRatings } from 'modules/users/application/queries';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import SectionHeader from 'shared/components/sections/common/SectionHeader';

const RatingMetric = ({ label, value }: { label: string; value: string | number }) => (
  <Box component="dl" sx={{ m: 0, minWidth: 0 }}>
    <Typography component="dt" variant="label" color="text.secondary">
      {label}
    </Typography>
    <Typography component="dd" variant="metric" sx={{ m: 0, mt: 1, fontSize: 28 }}>
      {value}
    </Typography>
  </Box>
);

const UserProfileRatingsTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const ratingsQuery = useUserRatings(username);
  const problemsQuery = useUserProblemsRating(username);
  const challengesQuery = useChallengeUserRating(username);
  const { data: contestChanges } = useContestRatingChanges(username);
  const { data: challengeChanges } = useChallengeRatingChanges(username);
  const contest = ratingsQuery.data?.contestsRating;
  const problems = problemsQuery.data;
  const challenges = challengesQuery.data;
  const contestMax = Math.max(
    Number(contest?.value ?? 0),
    ...(contestChanges ?? []).map((item) => Number(item.newRating ?? 0)),
  );
  const challengeMax = Math.max(
    challenges?.rating ?? 0,
    ...(challengeChanges ?? []).map((item) => item.value),
  );
  const queries = [ratingsQuery, problemsQuery, challengesQuery];
  if (queries.some((query) => query.isLoading))
    return (
      <Box sx={contentInsetSx}>
        <Skeleton height={140} />
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  if (queries.some((query) => query.error))
    return (
      <Box sx={contentInsetSx}>
        <Alert
          severity="error"
          action={
            <Button onClick={() => queries.forEach((query) => void query.mutate())}>
              {t('common.retry')}
            </Button>
          }
        >
          {t('common.loadFailed')}
        </Alert>
      </Box>
    );

  return (
    <Box>
      <SectionHeader
        title={t('problems.title')}
        action={
          <Button
            component={RouterLink}
            to={getResourceByUsername(resources.AttemptsByUser, username)}
            variant="outlined"
          >
            {t('problems.attempts.title')}
          </Button>
        }
      />
      <Box
        sx={{
          ...contentInsetSx,
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 3, md: 6 },
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <RatingMetric label={t('users.profile.ratings.solved')} value={problems?.solved ?? 0} />
        <RatingMetric label={t('users.profile.ratings.rating')} value={problems?.rating ?? 0} />
        <Box
          sx={{
            flex: '1 1 320px',
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(3, minmax(0, 1fr))',
              sm: `repeat(${difficultyOptions.length}, minmax(0, 1fr))`,
            },
            gap: 2,
          }}
        >
          {difficultyOptions.map((option) => (
            <Box key={option.key}>
              <Typography variant="caption" color="text.secondary">
                {t(`problems.difficulty.${option.key}`)}
              </Typography>
              <Typography
                variant="metric"
                component="div"
                sx={{ fontSize: 22, mt: 1 }}
                color={`${difficultyColorByKey[option.key]}.main`}
              >
                {problems?.difficulties?.[option.key] ?? 0}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          ...contentGridSx,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <Box>
          <SectionHeader
            title={t('contests.title')}
            action={<ContestsRatingChip title={contest?.title} imgSize={28} />}
          />
          <Box sx={contentInsetSx}>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ mb: 3 }}>
              <RatingMetric label={t('users.profile.ratings.rating')} value={contest?.value ?? 0} />
              <RatingMetric label={t('users.profile.ratings.maxRating')} value={contestMax} />
            </Stack>
            <ContestRatingChangesChart username={username} height={300} />
          </Box>
        </Box>
        <Box>
          <SectionHeader
            title={t('challenges.title')}
            action={
              <ChallengesRatingChip
                title={ratingsQuery.data?.challengesRating?.title}
                size="medium"
              />
            }
          />
          <Box sx={contentInsetSx}>
            <Stack direction="row" gap={4} flexWrap="wrap" sx={{ mb: 3 }}>
              <RatingMetric
                label={t('users.profile.ratings.rating')}
                value={challenges?.rating ?? 0}
              />
              <RatingMetric label={t('users.profile.ratings.maxRating')} value={challengeMax} />
            </Stack>
            <ChallengeRatingChangesChart username={username} height={300} />
            <Stack direction="row" gap={2} flexWrap="wrap" sx={{ mt: 2 }}>
              {[
                ['wins', 'success.main'],
                ['draws', 'text.secondary'],
                ['losses', 'error.main'],
              ].map(([key, color]) => (
                <Typography key={key} variant="body2" color={color}>
                  {t(`users.profile.ratings.${key}`)}:{' '}
                  {challenges?.[key as 'wins' | 'draws' | 'losses'] ?? 0}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
      <ProjectsUserRatingSection username={username} />
    </Box>
  );
};

export default UserProfileRatingsTab;
