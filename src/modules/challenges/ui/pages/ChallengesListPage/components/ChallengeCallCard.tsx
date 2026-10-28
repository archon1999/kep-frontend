import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { contentEntranceStyles } from 'app/theme/styles/transitions';
import {
  useAcceptChallengeCall,
  useDeleteChallengeCall,
} from 'modules/challenges/application/mutations.ts';
import { ChallengeCall, ChallengeQuestionTimeType } from 'modules/challenges/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import KepIcon from 'shared/components/base/KepIcon';
import { ChapterLogos } from 'shared/components/common/ChapterLogo';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';
import { useLoginRedirect } from 'shared/lib/authRedirect';

interface CallCardProps {
  challengeCall: ChallengeCall;
  onAccepted?: (challengeId?: number) => void;
  onRemoved?: () => void;
}

const ChallengeCallCard = ({ challengeCall, onAccepted, onRemoved }: CallCardProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const { trigger: acceptChallenge, isMutating: isAccepting } = useAcceptChallengeCall();
  const { trigger: deleteCall, isMutating: isDeleting } = useDeleteChallengeCall();

  const isOwner = useMemo(
    () => currentUser?.username === challengeCall.username,
    [challengeCall.username, currentUser?.username],
  );
  const timerModeTooltip =
    challengeCall.questionTimeType === ChallengeQuestionTimeType.TimeToAll
      ? t('challenges.timer.wholeChallenge')
      : t('challenges.timer.perQuestion');

  const handleAccept = async () => {
    if (!currentUser) {
      redirectToLogin();
      return;
    }

    const result = await acceptChallenge(challengeCall.id);
    onAccepted?.(result?.challengeId);
  };

  const handleDelete = async () => {
    await deleteCall(challengeCall.id);
    onRemoved?.();
  };

  return (
    <Card variant="outlined" sx={{ ...contentEntranceStyles, height: '100%' }}>
      <CardContent sx={{ height: '100%', p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack spacing={1.5} direction="column" sx={{ height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={1} direction="row" alignItems="center" sx={{ minWidth: 0 }}>
              <ChallengesRatingChip
                title={challengeCall.rankTitle || t('challenges.rankUnknown')}
              />

              <UserPopover username={challengeCall.username}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {challengeCall.username}
                </Typography>
              </UserPopover>
            </Stack>
          </Stack>

          <Stack direction="row" gap={4} sx={{ py: 0.5 }}>
            <Stack gap={0.25}>
              <Typography variant="caption" color="text.secondary">
                {t('challenges.questions')}
              </Typography>
              <Typography variant="metric" sx={{ fontSize: 26 }}>
                {challengeCall.questionsCount}
              </Typography>
            </Stack>
            <Stack gap={0.25}>
              <Typography variant="caption" color="text.secondary">
                {timerModeTooltip}
              </Typography>
              <Typography variant="metric" sx={{ fontSize: 26 }}>
                {t('challenges.secondsShort', { seconds: challengeCall.timeSeconds })}
              </Typography>
            </Stack>
          </Stack>
          {challengeCall.chapters?.length ? (
            <ChapterLogos chapters={challengeCall.chapters} label={t('challenges.chapters')} />
          ) : null}

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 'auto !important', pt: 2, flexWrap: 'wrap', rowGap: 1 }}
          >
            <Typography variant="caption" color="text.secondary">
              {challengeCall.created}
            </Typography>

            {isOwner ? (
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {t('challenges.deleteCall')}
              </Button>
            ) : null}
            {!isOwner ? (
              <Button
                variant="contained"
                size="small"
                onClick={handleAccept}
                endIcon={<KepIcon name="challenge" fontSize={16} />}
                disabled={isAccepting}
              >
                {t('challenges.acceptCall')}
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChallengeCallCard;
