import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, Chip, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import { DuelInvitation } from 'modules/duels/domain/index.ts';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';

type Props = {
  invitation: DuelInvitation;
  actionLoadingKey?: string | null;
  onAccept?: () => void;
  onCancel?: () => void;
};

const DuelsListPageWaitingRoomCard = ({ invitation, actionLoadingKey, onAccept, onCancel }: Props) => {
  const { t } = useTranslation();
  const creator = invitation.challenger;
  const createdRelative = invitation.created ? dayjs(invitation.created).fromNow() : null;
  const isLoading =
    actionLoadingKey === `accept-${invitation.id}` ||
    actionLoadingKey === `cancel-${invitation.id}`;
  const actionTitle = invitation.canCancel ? t('duels.cancelCall') : t('duels.accept');
  const actionDisabled = invitation.canCancel ? false : !invitation.canAccept;
  const actionReason = invitation.canCancel ? '' : invitation.acceptDisabledReason || '';

  const action = invitation.canCancel ? onCancel : onAccept;

  return (
    <Card background={0}>
      <CardContent>
        <Stack spacing={2} sx={{ height: '100%' }}>
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

          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {invitation.duelType?.title ? (
              <Chip
                size="small"
                label={invitation.duelType.title}
                variant="outlined"
                color="primary"
              />
            ) : null}
            {invitation.preset?.duration ? (
              <Chip size="small" label={invitation.preset.duration} variant="outlined" />
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

          <Stack direction="row" alignItems="center" justifyContent="space-between">
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
            {actionDisabled && actionReason ? (
              <Typography variant="caption" color="text.secondary">
                {actionReason}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelsListPageWaitingRoomCard;
