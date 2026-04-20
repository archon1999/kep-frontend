import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  useAcceptChallengeCall,
  useDeleteChallengeCall,
} from 'modules/challenges/application/mutations.ts';
import { ChallengeCall, ChallengeQuestionTimeType } from 'modules/challenges/domain';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip.tsx';

dayjs.extend(relativeTime);

interface ChallengesListPageCallCardProps {
  challengeCall: ChallengeCall;
  onAccepted?: (challengeId?: number) => void;
  onRemoved?: () => void;
}

const formatDuration = (seconds: number) => {
  return `${seconds}s`;
};

const ChallengesListPageCallCard = ({
  challengeCall,
  onAccepted,
  onRemoved,
}: ChallengesListPageCallCardProps) => {
  dayjs.extend(relativeTime);
  const { t } = useTranslation();
  const { currentUser } = useAuth();
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
  const timerModeLabel =
    challengeCall.questionTimeType === ChallengeQuestionTimeType.TimeToAll
      ? t('challenges.timer.wholeChallengeShort')
      : t('challenges.timer.perQuestionShort');

  const handleAccept = async () => {
    const result = await acceptChallenge(challengeCall.id);
    onAccepted?.(result?.challengeId);
  };

  const handleDelete = async () => {
    await deleteCall(challengeCall.id);
    onRemoved?.();
  };

  return (
    <Card background={0} variant="outlined">
      <CardContent>
        <Stack spacing={1.5} direction="column">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={1} direction="row">
              <ChallengesRatingChip
                title={challengeCall.rankTitle || t('challenges.rankUnknown')}
              />

              <UserPopover username={challengeCall.username}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {challengeCall.username}
                </Typography>
              </UserPopover>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} divider={<Divider flexItem orientation="vertical" />}>
            <Stack spacing={0.5} direction="column">
              <Typography variant="subtitle2">{challengeCall.questionsCount}</Typography>
            </Stack>
            <Stack spacing={0.5} direction="column">
              <Typography variant="subtitle2">
                {formatDuration(challengeCall.timeSeconds)}
              </Typography>
            </Stack>
            <Tooltip title={timerModeTooltip} arrow>
              <Chip size="small" label={timerModeLabel} variant="outlined" />
            </Tooltip>
            {challengeCall.chapters?.length ? (
              <Stack spacing={0.5} direction="column">
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {challengeCall.chapters.map((chapter) => (
                    <Chip key={chapter.id} size="small" label={chapter.title} variant="soft" />
                  ))}
                </Stack>
              </Stack>
            ) : null}
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
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

export default ChallengesListPageCallCard;
