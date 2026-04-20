import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import { Duel } from 'modules/duels/domain/index.ts';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';

type Props = {
  duel: Duel;
  onView?: () => void;
  onShowPreset?: () => void;
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const statusTone = (status: Duel['status']) => {
  if (status === -1) return { color: 'info' as const, label: 'duels.status.upcoming' };
  if (status === 0) return { color: 'success' as const, label: 'duels.status.running' };
  return { color: 'secondary' as const, label: 'duels.status.finished' };
};

const DuelParticipantLabel = ({
  username,
  displayName,
  contestsRating,
  isBot,
  ratingTitle,
}: {
  username: string;
  displayName?: string;
  contestsRating?: number;
  isBot?: boolean;
  ratingTitle?: string;
}) => (
  <Stack spacing={0.3}>
    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
      <Typography variant="subtitle1" fontWeight={800}>
        {displayName || username}
      </Typography>
      {isBot ? <Chip size="small" label="BOT" color="secondary" variant="outlined" /> : null}
    </Stack>
    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
      {(ratingTitle || typeof contestsRating === 'number') ? (
        <>
          <ContestsRatingChip title={ratingTitle} imgSize={20} />
          <Typography variant="caption" color="text.secondary">
            {typeof contestsRating === 'number' ? contestsRating : '--'}
          </Typography>
        </>
      ) : null}
      <Typography variant="caption" color="text.secondary">
        @{username}
      </Typography>
    </Stack>
  </Stack>
);

const DuelsListPageListCard = ({
  duel,
  onView,
  onShowPreset,
}: Props) => {
  const { t } = useTranslation();
  const tone = statusTone(duel.status);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={3} alignItems="flex-start" justifyContent="space-between" flexWrap="wrap">
          <Stack spacing={1}>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <UserPopover username={duel.playerFirst.username}>
                <DuelParticipantLabel
                  username={duel.playerFirst.username}
                  displayName={duel.playerFirst.displayName}
                  contestsRating={duel.playerFirst.contestsRating}
                  isBot={duel.playerFirst.isBot}
                  ratingTitle={duel.playerFirst.ratingTitle}
                />
              </UserPopover>
              <Typography variant="body2" color="text.secondary">
                vs
              </Typography>
              {duel.playerSecond ? (
                <UserPopover username={duel.playerSecond.username}>
                  <DuelParticipantLabel
                    username={duel.playerSecond.username}
                    displayName={duel.playerSecond.displayName}
                    contestsRating={duel.playerSecond.contestsRating}
                    isBot={duel.playerSecond.isBot}
                    ratingTitle={duel.playerSecond.ratingTitle}
                  />
                </UserPopover>
              ) : (
                <Chip label="BYE" size="small" variant="outlined" />
              )}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="caption" color="text.secondary">
                {t('duels.starts')}: {formatDate(duel.startTime)}
              </Typography>
              {duel.finishTime ? (
                <Typography variant="caption" color="text.secondary">
                  • {t('duels.ends')}: {formatDate(duel.finishTime)}
                </Typography>
              ) : null}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={t(tone.label)}
                color={tone.color}
                size="small"
                variant="filled"
                sx={{ textTransform: 'uppercase' }}
              />
              {duel.isConfirmed === false ? (
                <Chip
                  label={t('duels.awaitingConfirmation')}
                  color="warning"
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'uppercase' }}
                />
              ) : null}
              {duel.preset?.title ? (
                <Chip
                  label={duel.preset.title}
                  size="small"
                  variant="outlined"
                  onClick={onShowPreset}
                  clickable={Boolean(onShowPreset)}
                />
              ) : null}
              {duel.duelType?.title ? (
                <Chip label={duel.duelType.title} size="small" color="primary" variant="outlined" />
              ) : null}
            </Stack>
          </Stack>

          <Stack spacing={1} alignItems="flex-end">
            <Typography variant="h4" fontWeight={800} color="primary.main">
              {duel.playerFirst.balls ?? 0}
            </Typography>
            {duel.playerSecond ? (
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {duel.playerSecond.balls ?? 0}
              </Typography>
            ) : null}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" mt={2} flexWrap="wrap">
          <Button variant="outlined" size="small" onClick={onView}>
            {t('duels.openWorkspace')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelsListPageListCard;
