import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import { DuelInvitation } from '../../domain/index.ts';

type Props = {
  invitation: DuelInvitation;
  actionLoadingKey?: string | null;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: () => void;
  onOpen?: () => void;
};

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const invitationStatusLabel = (status: DuelInvitation['status']) => {
  if (status === 1) return 'duels.invitationStatus.pending';
  if (status === 2) return 'duels.invitationStatus.countered';
  if (status === 3) return 'duels.invitationStatus.accepted';
  if (status === 4) return 'duels.invitationStatus.rejected';
  return 'duels.invitationStatus.expired';
};

const DuelInvitationCard = ({
  invitation,
  actionLoadingKey,
  onAccept,
  onReject,
  onCounter,
  onOpen,
}: Props) => {
  const { t } = useTranslation();
  const problemsLabel = invitation.problems?.map((problem) => `${problem.symbol} (${problem.ball ?? 0})`).join(', ');
  const waitingFor =
    invitation.requiresResponse === false && invitation.actionRequiredBy?.username
      ? invitation.actionRequiredBy.username
      : null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" spacing={2} flexWrap="wrap">
            <Stack spacing={1}>
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                <UserPopover username={invitation.challenger.username}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {invitation.challenger.username}
                  </Typography>
                </UserPopover>
                <Typography variant="body2" color="text.secondary">
                  vs
                </Typography>
                <UserPopover username={invitation.invitee.username}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {invitation.invitee.username}
                  </Typography>
                </UserPopover>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                {t('duels.startTime')}: {formatDate(invitation.proposedStartTime)}
              </Typography>

              {invitation.preset?.title ? (
                <Typography variant="body2" color="text.secondary">
                  {invitation.preset.title}
                </Typography>
              ) : null}

              {problemsLabel ? (
                <Typography variant="caption" color="text.secondary">
                  {problemsLabel}
                </Typography>
              ) : null}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="flex-start" flexWrap="wrap">
              <Chip
                label={t(invitationStatusLabel(invitation.status))}
                color={invitation.status === 3 ? 'success' : invitation.status === 4 ? 'error' : 'primary'}
                variant={invitation.status === 1 || invitation.status === 2 ? 'outlined' : 'filled'}
                size="small"
              />
              {waitingFor ? (
                <Chip
                  label={t('duels.waitingForUser', { username: waitingFor })}
                  size="small"
                  variant="outlined"
                />
              ) : null}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
            {invitation.canReject ? (
              <Button
                variant="text"
                color="inherit"
                size="small"
                disabled={actionLoadingKey === `reject-${invitation.id}`}
                onClick={onReject}
              >
                {t('duels.reject')}
              </Button>
            ) : null}
            {invitation.canCounter ? (
              <Button
                variant="outlined"
                size="small"
                disabled={actionLoadingKey === `counter-${invitation.id}`}
                onClick={onCounter}
              >
                {t('duels.suggestNewTime')}
              </Button>
            ) : null}
            {invitation.canAccept ? (
              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={actionLoadingKey === `accept-${invitation.id}`}
                onClick={onAccept}
              >
                {t('duels.accept')}
              </Button>
            ) : null}
            {invitation.duelId ? (
              <Button variant="outlined" size="small" onClick={onOpen}>
                {t('duels.openWorkspace')}
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelInvitationCard;
