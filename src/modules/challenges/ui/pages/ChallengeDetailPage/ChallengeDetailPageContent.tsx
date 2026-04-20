import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Question } from 'modules/testing/domain';
import { Challenge, ChallengeStatus } from 'modules/challenges/domain';
import KepIcon from 'shared/components/base/KepIcon.tsx';
import ChallengeCountdown from './components/ChallengeCountdown.tsx';
import ChallengeQuestionCard, {
  QuestionCardHandle,
} from './components/ChallengeQuestionCard.tsx';
import ChallengeResultsCard from './components/ChallengeResultsCard.tsx';

type ChallengeDetailPageContentProps = {
  challenge: Challenge;
  hideBackgroundContent: boolean;
  showQuestion: boolean;
  question?: Question;
  questionCardRef: RefObject<QuestionCardHandle | null>;
  onSubmit: (payload: {
    answer: unknown;
    isFinish?: boolean;
    forceFail?: boolean;
  }) => Promise<void>;
  submitting: boolean;
  secondsLeft: number;
};

const ChallengeDetailPageContent = ({
  challenge,
  hideBackgroundContent,
  showQuestion,
  question,
  questionCardRef,
  onSubmit,
  submitting,
  secondsLeft,
}: ChallengeDetailPageContentProps) => {
  const { t } = useTranslation();

  if (hideBackgroundContent) {
    return null;
  }

  return (
    <Stack spacing={3} direction="column">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <ChallengeResultsCard challenge={challenge} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {showQuestion && question ? (
            <ChallengeQuestionCard
              ref={questionCardRef}
              challengeId={challenge.id}
              questionNumber={challenge.nextQuestion?.number}
              question={question}
              onSubmit={onSubmit}
              disabled={submitting}
              isSubmitting={submitting}
            />
          ) : (
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <KepIcon name="challenge-time" fontSize={20} color="primary.main" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {challenge.status === ChallengeStatus.Finished
                        ? t('challenges.statusFinished')
                        : t('challenges.statusNotStarted')}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {challenge.status === ChallengeStatus.Finished
                      ? t('challenges.finishedDescription')
                      : t('challenges.waitingForStart')}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Stack direction="column" spacing={2} height="100%">
            <ChallengeCountdown
              secondsLeft={secondsLeft}
              totalSeconds={challenge.timeSeconds}
              mode={challenge.questionTimeType}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ChallengeDetailPageContent;
