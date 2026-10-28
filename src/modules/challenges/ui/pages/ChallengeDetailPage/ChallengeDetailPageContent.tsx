import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { workspaceToolbarStyles } from 'app/theme/styles/workspace';
import { Challenge, ChallengeStatus } from 'modules/challenges/domain';
import { Question } from 'modules/testing/domain';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ChallengeCountdown from './components/ChallengeCountdown';
import ChallengeQuestionCard, { QuestionCardHandle } from './components/ChallengeQuestionCard';
import ChallengeResultsCard from './components/ChallengeResultsCard';

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
  if (hideBackgroundContent) return null;
  const finished = challenge.status === ChallengeStatus.Finished;
  const active = challenge.status === ChallengeStatus.Already;
  const status = t(
    finished
      ? 'challenges.statusFinished'
      : active
        ? 'challenges.statusInProgress'
        : 'challenges.statusNotStarted',
  );
  const results = <ChallengeResultsCard challenge={challenge} compact />;
  const questionToolbar = (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      <Typography component="h2" variant="subtitle1" fontWeight={600}>
        {t('challenges.questionProgress', {
          current: challenge.nextQuestion?.number ?? question?.number,
          total: challenge.questionsCount,
        })}
      </Typography>
      <ChallengeCountdown
        secondsLeft={secondsLeft}
        totalSeconds={challenge.timeSeconds}
        mode={challenge.questionTimeType}
        compact
      />
    </Stack>
  );
  return (
    <>
      {active ? (
        <Box
          component="header"
          sx={[
            workspaceToolbarStyles,
            { px: 'var(--kep-content-inset)', py: 1.25, justifyContent: 'space-between' },
          ]}
        >
          <Typography component="h1" variant="h6" sx={{ fontSize: 20 }}>
            <MixedText>
              {t('challenges.ratingChangesTooltip.challenge', { id: challenge.id })}
            </MixedText>
          </Typography>
          <Chip size="small" variant="soft" color="success" label={status} />
        </Box>
      ) : (
        <PageHeader
          variant="detail"
          title={t('challenges.ratingChangesTooltip.challenge', { id: challenge.id })}
          backTo={resources.Challenges}
          actionComponent={<Chip variant="soft" color="neutral" label={status} />}
        />
      )}
      {active ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 360px' },
            alignItems: 'stretch',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box
              component="details"
              sx={{ display: { xs: 'block', lg: 'none' }, borderBottom: 1, borderColor: 'divider' }}
            >
              <Box
                component="summary"
                sx={{
                  px: 'var(--kep-content-inset)',
                  py: 1.5,
                  cursor: 'pointer',
                  color: 'text.secondary',
                  fontSize: 14,
                }}
              >
                {t('challenges.matchScore')} · {challenge.playerFirst.result} :{' '}
                {challenge.playerSecond.result}
              </Box>
              <Box sx={{ p: 'var(--kep-content-inset)' }}>{results}</Box>
            </Box>
            {showQuestion && question ? (
              <ChallengeQuestionCard
                ref={questionCardRef}
                challengeId={challenge.id}
                questionNumber={challenge.nextQuestion?.number}
                question={question}
                onSubmit={onSubmit}
                disabled={submitting}
                isSubmitting={submitting}
                toolbar={questionToolbar}
              />
            ) : (
              <Stack gap={2} sx={{ p: 'var(--kep-content-inset)' }}>
                <Typography component="h2" variant="h6">
                  {t('challenges.waitingForOpponent')}
                </Typography>
                <Typography color="text.secondary">
                  {t('challenges.waitingForOpponentDescription')}
                </Typography>
              </Stack>
            )}
          </Box>
          <Box
            component="aside"
            sx={{
              display: { xs: 'none', lg: 'block' },
              minWidth: 0,
              p: 3,
              borderLeft: 1,
              borderColor: 'divider',
            }}
          >
            {results}
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ p: 'var(--kep-content-inset)', borderBottom: 1, borderColor: 'divider' }}>
            <ChallengeResultsCard challenge={challenge} />
          </Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            gap={3}
            alignItems="center"
            sx={{ p: 'var(--kep-content-inset)' }}
          >
            <PatternArtwork
              kind={finished ? 'competitions' : 'battles'}
              sx={{ width: 140, flexShrink: 0 }}
            />
            <Stack gap={0.75}>
              <Typography component="h2" variant="h6">
                {t(finished ? 'challenges.finishDialogTitle' : 'challenges.statusNotStarted')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(finished ? 'challenges.finishedDescription' : 'challenges.waitingForStart')}
              </Typography>
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
};
export default ChallengeDetailPageContent;
