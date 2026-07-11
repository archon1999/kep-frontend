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
import { DuelInvitation, formatDuelDuration } from 'modules/duels/domain/index.ts';
import UserPopover from 'modules/users/ui/shared/components/UserPopover.tsx';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import { formatRelativeTime } from 'shared/lib/dateTime';

type Props = {
  invitation: DuelInvitation;
  actionLoadingKey?: string | null;
  onAccept?: () => void;
  onCancel?: () => void;
};

const DuelWaitingRoomCard = ({ invitation, actionLoadingKey, onAccept, onCancel }: Props) => {
  const { t } = useTranslation();
  const creator = invitation.challenger;
  const createdRelative = formatRelativeTime(invitation.created, '');
  const isLoading =
    actionLoadingKey === `accept-${invitation.id}` ||
    actionLoadingKey === `cancel-${invitation.id}`;
  const actionTitle = invitation.canCancel ? t('duels.cancelCall') : t('duels.accept');
  const actionDisabled = invitation.canCancel ? false : !invitation.canAccept;
  const actionReason = invitation.canCancel ? '' : invitation.acceptDisabledReason || '';

  const action = invitation.canCancel ? onCancel : onAccept;

  return (
    <Card background={0} sx={{ width: 1, height: 1, display: 'flex' }}>
      <CardContent sx={{ display: 'flex', flex: 1 }}>
        <Stack spacing={2} sx={{ width: 1, flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="flex-start">
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                <ContestsRatingChip title={creator.contestsRatingTitle} imgSize={22} />
                <UserPopover username={creator.username} avatar={creator.avatar ?? undefined}>
                  <Typography variant="subtitle2" fontWeight={800} noWrap>
                    {creator.username}
                  </Typography>
                </UserPopover>
                {invitation.isBot ? (
                  <Chip label="BOT" size="small" color="secondary" variant="outlined" />
                ) : null}
              </Stack>
            </Stack>
          </Stack>

          <Typography
            variant="subtitle1"
            fontWeight={800}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {invitation.preset?.title ?? t('duels.createDuel')}
          </Typography>

          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            divider={<Divider flexItem orientation="vertical" />}
          >
            {invitation.duelType?.title ? (
              <Chip
                size="small"
                label={invitation.duelType.title}
                variant="outlined"
                color="primary"
              />
            ) : null}
            {invitation.preset?.duration ? (
              <Chip
                size="small"
                label={formatDuelDuration(invitation.preset.duration)}
                variant="outlined"
              />
            ) : null}
            {typeof invitation.preset?.problemsCount === 'number' ? (
              <Chip
                size="small"
                label={t('duels.presetProblemsCountShort', {
                  count: invitation.preset.problemsCount,
                })}
                variant="outlined"
              />
            ) : null}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{ mt: 'auto' }}
          >
            {createdRelative ? (
              <Typography variant="caption" color="text.secondary" noWrap>
                {createdRelative}
              </Typography>
            ) : null}

            <Tooltip title={actionDisabled ? actionReason : ''}>
              <span>
                <Button
                  variant={invitation.canCancel ? 'outlined' : 'contained'}
                  color={invitation.canCancel ? 'inherit' : 'primary'}
                  size="small"
                  fullWidth
                  disabled={actionDisabled || isLoading}
                  onClick={action}
                >
                  {actionTitle}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelWaitingRoomCard;
