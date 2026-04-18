import { useTranslation } from 'react-i18next';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon.tsx';
import ChallengeChip, { ChallengeChipTone } from 'shared/components/challenges/ChallengeChip.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { Challenge, ChallengeStatus } from '../../domain';
import ChallengeUserChip from './ChallengeUserChip.tsx';

interface ChallengeResultsCardProps {
  challenge: Challenge;
}

const mapResultTone = (value: number): ChallengeChipTone => {
  if (value === 1) return 'win';
  if (value === -1) return 'draw';
  return 'loss';
};

const getResultLabel = (value: number, isFinished: boolean) => {
  if (value !== -1) return undefined;
  return isFinished ? '-' : '...';
};

const formatDelta = (delta: number) => (delta > 0 ? `+${delta}` : String(delta));

const getDeltaColor = (delta: number) => {
  if (delta > 0) return 'success.main';
  if (delta < 0) return 'error.main';
  return 'text.secondary';
};

const RatingDelta = ({ delta }: { delta: number }) => (
  <Stack
    direction="row"
    spacing={0.5}
    alignItems="center"
    sx={{ color: getDeltaColor(delta) }}
  >
    <KepIcon name="delta" fontSize={15} color="inherit" />
    <Typography variant="caption" fontWeight={700} color="inherit">
      {formatDelta(delta)}
    </Typography>
  </Stack>
);

const ChallengeResultsCard = ({ challenge }: ChallengeResultsCardProps) => {
  const { t } = useTranslation();
  const isFinished = challenge.status === ChallengeStatus.Finished;
  const perQuestionResults = Array.from({ length: challenge.questionsCount }, (_, index) => ({
    first: challenge.playerFirst.results?.[index] ?? -1,
    second: challenge.playerSecond.results?.[index] ?? -1,
  }));
  const playerFirstView = isFinished
    ? {
        ...challenge.playerFirst,
        rankTitle: challenge.playerFirst.newRankTitle || challenge.playerFirst.rankTitle,
      }
    : challenge.playerFirst;
  const playerSecondView = isFinished
    ? {
        ...challenge.playerSecond,
        rankTitle: challenge.playerSecond.newRankTitle || challenge.playerSecond.rankTitle,
      }
    : challenge.playerSecond;

  const scoreTone = (value: number, opponent: number) => {
    if (value > opponent) return 'success.main';
    if (value < opponent) return 'error.main';
    return 'text.secondary';
  };

  const getResultTitle = (value: number) => {
    if (value === 1) return t('challenges.answerCorrect');
    if (value === 0) return t('challenges.answerWrong');
    return isFinished ? t('challenges.answerNotPlayed') : t('challenges.answerPending');
  };

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <CardContent sx={{ position: 'relative' }}>
        <Stack spacing={2} direction="column">
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Stack spacing={1} direction="column" flex={1}>
              <ChallengeUserChip
                player={playerFirstView}
                highlight={challenge.playerFirst.result > challenge.playerSecond.result}
              />
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <ChallengesRatingChip
                  title={challenge.playerFirst.rankTitle}
                  rating={challenge.playerFirst.rating}
                />
                {isFinished ? (
                  <RatingDelta delta={challenge.playerFirst.delta} />
                ) : null}
              </Stack>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', sm: 'block' } }}
            />

            <Stack
              spacing={1}
              direction="column"
              alignItems="center"
              justifyContent="center"
              px={{ xs: 1, sm: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  color={scoreTone(challenge.playerFirst.result, challenge.playerSecond.result)}
                >
                  {challenge.playerFirst.result}
                </Typography>
                <Typography variant="h6" fontWeight={800} color="text.secondary">
                  :
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  color={scoreTone(challenge.playerSecond.result, challenge.playerFirst.result)}
                >
                  {challenge.playerSecond.result}
                </Typography>
              </Stack>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', sm: 'block' } }}
            />

            <Stack
              spacing={1}
              direction="column"
              alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
              flex={1}
            >
              <ChallengeUserChip
                player={playerSecondView}
                align="right"
                highlight={challenge.playerSecond.result > challenge.playerFirst.result}
              />
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
              >
                <ChallengesRatingChip
                  title={challenge.playerSecond.rankTitle}
                  rating={challenge.playerSecond.rating}
                />

                {isFinished ? (
                  <RatingDelta delta={challenge.playerSecond.delta} />
                ) : null}
              </Stack>
            </Stack>
          </Stack>

          <Divider />

          <Stack direction="column" spacing={1.25}>
            <Stack direction="column" spacing={1} flexWrap="wrap" useFlexGap>
              {perQuestionResults.map((result, index) => (
                <Stack
                  justifyContent="space-between"
                  key={index}
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                >
                  <ChallengeChip
                    tone={mapResultTone(result.first)}
                    label={getResultLabel(result.first, isFinished)}
                    title={getResultTitle(result.first)}
                  />
                  <Typography variant="caption" fontWeight={700}>
                    #{index + 1}
                  </Typography>
                  <ChallengeChip
                    tone={mapResultTone(result.second)}
                    label={getResultLabel(result.second, isFinished)}
                    title={getResultTitle(result.second)}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengeResultsCard;
