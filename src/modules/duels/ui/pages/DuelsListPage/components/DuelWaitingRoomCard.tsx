import { useTranslation } from 'react-i18next';
import { Box, Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { contentInsetSx, interactiveContentSx } from 'app/theme/styles/content';
import { DuelInvitation, formatDuelDuration } from 'modules/duels/domain';
import DuelParticipant from 'modules/duels/ui/shared/components/DuelParticipant';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { formatRelativeTime } from 'shared/lib/dateTime';

type Props = {
  invitation?: DuelInvitation;
  loading?: boolean;
  actionLoadingKey?: string | null;
  onAccept?: () => void;
  onCancel?: () => void;
};
const DuelWaitingRoomCard = ({
  invitation,
  loading = false,
  actionLoadingKey,
  onAccept,
  onCancel,
}: Props) => {
  const { t } = useTranslation();
  const busy =
    loading ||
    actionLoadingKey === `accept-${invitation?.id}` ||
    actionLoadingKey === `cancel-${invitation?.id}`;
  const disabled = loading || (!invitation?.canCancel && !invitation?.canAccept);
  const created = invitation?.created ? formatRelativeTime(invitation.created, '') : '';
  return (
    <Box
      component="article"
      className="kep-duel-call"
      aria-busy={loading}
      sx={{
        ...contentInsetSx,
        ...interactiveContentSx,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
      }}
    >
      <Box sx={{ minHeight: 46, minWidth: 0 }}>
        {loading ? (
          <Skeleton width="65%" height={42} />
        ) : (
          invitation && <DuelParticipant player={invitation.challenger} />
        )}
      </Box>
      <Typography
        component="h3"
        sx={{
          fontFamily: 'var(--kep-display-font)',
          fontSize: 20,
          fontWeight: 500,
          lineHeight: 1.35,
          minHeight: 54,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <>
            <Skeleton width="90%" />
            <Skeleton width="60%" />
          </>
        ) : (
          <MixedText>{invitation?.preset?.title ?? t('duels.createDuel')}</MixedText>
        )}
      </Typography>
      <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap" sx={{ minHeight: 24 }}>
        {loading ? (
          <Skeleton width="85%" height={24} />
        ) : (
          <>
            {invitation?.preset?.duration && (
              <Stack direction="row" gap={0.5} alignItems="center">
                <IconifyIcon
                  icon="mdi:clock-outline"
                  sx={{ fontSize: 16, color: 'primary.main' }}
                />
                <Typography variant="metric" sx={{ fontSize: 14 }}>
                  {formatDuelDuration(invitation.preset.duration)}
                </Typography>
              </Stack>
            )}
            {typeof invitation?.preset?.problemsCount === 'number' && (
              <Stack direction="row" gap={0.5} alignItems="center">
                <IconifyIcon icon="mdi:code-tags" sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="metric" sx={{ fontSize: 14 }}>
                  {invitation.preset.problemsCount}
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ minHeight: 18 }}>
        {loading ? <Skeleton width="50%" /> : invitation?.duelType?.title}
      </Typography>
      <Stack
        direction="row"
        gap={1.5}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 'auto', pt: 2, borderTop: '1px solid var(--kep-line)' }}
      >
        <Typography variant="caption" color="text.secondary">
          {loading ? <Skeleton width={80} /> : created}
        </Typography>
        <Tooltip title={disabled && !loading ? invitation?.acceptDisabledReason || '' : ''}>
          <span>
            <Button
              variant={invitation?.canCancel ? 'outlined' : 'contained'}
              color={invitation?.canCancel ? 'inherit' : 'primary'}
              size="small"
              disabled={disabled || busy}
              onClick={invitation?.canCancel ? onCancel : onAccept}
              endIcon={
                <IconifyIcon icon={invitation?.canCancel ? 'mdi:close' : 'mdi:arrow-right'} />
              }
            >
              {t(invitation?.canCancel ? 'duels.deleteCall' : 'duels.accept')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
};
export const DuelWaitingRoomCardSkeleton = () => <DuelWaitingRoomCard loading />;
export default DuelWaitingRoomCard;
