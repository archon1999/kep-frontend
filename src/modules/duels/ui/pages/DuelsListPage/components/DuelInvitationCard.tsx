import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Divider, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { contentInsetSx } from 'app/theme/styles/content';
import {
  DuelInvitation,
  DuelInvitationUser,
  formatDuelDuration,
} from 'modules/duels/domain/index.ts';
import DuelParticipant from 'modules/duels/ui/shared/components/DuelParticipant';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { formatCalendarDateTime, formatRelativeTime } from 'shared/lib/dateTime';

type Props = {
  invitation: DuelInvitation;
  actionLoadingKey?: string | null;
  onAccept?: () => void;
  onConfirm?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onCounter?: () => void;
  onOpen?: () => void;
};

export const DuelInvitationCardSkeleton = () => (
  <Box component="article" sx={{ ...contentInsetSx, borderBottom: '1px solid var(--kep-line)' }}>
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'flex-start' }}
        spacing={2}
      >
        <Stack spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={84} height={24} sx={{ borderRadius: 999 }} />
            <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: 999 }} />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Stack spacing={0.5}>
              <Skeleton variant="text" width={128} height={25} />
              <Skeleton variant="text" width={92} />
            </Stack>
            <Divider flexItem orientation="vertical" />
            <Skeleton variant="text" width={24} />
            <Stack spacing={0.5}>
              <Skeleton variant="text" width={128} height={25} />
              <Skeleton variant="text" width={92} />
            </Stack>
          </Stack>

          <Stack spacing={0.75}>
            <Skeleton variant="text" width="54%" height={28} />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={96} height={24} sx={{ borderRadius: 999 }} />
              <Skeleton variant="rounded" width={52} height={24} sx={{ borderRadius: 999 }} />
              <Skeleton variant="rounded" width={44} height={24} sx={{ borderRadius: 999 }} />
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <Skeleton variant="text" width={116} />
          <Skeleton variant="text" width={156} />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Skeleton variant="rounded" width={88} height={32} sx={{ borderRadius: 999 }} />
        <Skeleton variant="rounded" width={112} height={32} sx={{ borderRadius: 999 }} />
      </Stack>
    </Stack>
  </Box>
);

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  return formatCalendarDateTime(value, value);
};

const callStatusMeta = (status: DuelInvitation['status']) => {
  if (status === 1) {
    return {
      label: 'duels.callStatus.open',
      color: 'primary' as const,
      icon: 'mdi:broadcast',
    };
  }
  if (status === 2) {
    return {
      label: 'duels.callStatus.pending',
      color: 'info' as const,
      icon: 'mdi:calendar-clock-outline',
    };
  }
  if (status === 3) {
    return {
      label: 'duels.callStatus.countered',
      color: 'warning' as const,
      icon: 'mdi:calendar-refresh-outline',
    };
  }
  if (status === 4) {
    return {
      label: 'duels.callStatus.accepted',
      color: 'success' as const,
      icon: 'mdi:check-decagram-outline',
    };
  }
  if (status === 5) {
    return {
      label: 'duels.callStatus.rejected',
      color: 'error' as const,
      icon: 'mdi:close-octagon-outline',
    };
  }
  if (status === 6) {
    return {
      label: 'duels.callStatus.cancelled',
      color: 'default' as const,
      icon: 'mdi:cancel',
    };
  }

  return {
    label: 'duels.callStatus.expired',
    color: 'default' as const,
    icon: 'mdi:timer-off-outline',
  };
};

const ParticipantBadge = ({ user }: { user: DuelInvitationUser }) => (
  <DuelParticipant player={user} />
);

const ActionButton = ({
  title,
  disabled,
  loading,
  onClick,
  variant = 'outlined',
  color = 'primary',
  icon,
}: {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  icon?: string;
}) => (
  <Button
    variant={variant}
    color={color}
    size="small"
    disabled={disabled || loading}
    onClick={onClick}
    startIcon={icon ? <IconifyIcon icon={icon} width={16} height={16} /> : undefined}
    sx={{ borderRadius: 999, textTransform: 'none' }}
  >
    {title}
  </Button>
);

const DuelInvitationCard = ({
  invitation,
  actionLoadingKey,
  onAccept,
  onConfirm,
  onReject,
  onCancel,
  onCounter,
  onOpen,
}: Props) => {
  const { t } = useTranslation();
  const statusMeta = callStatusMeta(invitation.status);
  const problemsLabel = invitation.problems
    ?.map((problem) => `${problem.symbol}${problem.ball ? ` ${problem.ball}` : ''}`)
    .join(' · ');
  const waitingFor =
    invitation.actionRequiredBy?.displayName || invitation.actionRequiredBy?.username;
  const createdRelative = formatRelativeTime(invitation.created, '');
  const creator = invitation.challenger;
  const claimant = invitation.invitee ?? null;
  const shouldShowAccept = invitation.status === 1 && invitation.viewerRole !== 'challenger';
  const isNegotiating = invitation.status === 2 || invitation.status === 3;
  const shouldShowConfirm =
    isNegotiating &&
    Boolean(
      invitation.requiresResponse || invitation.canConfirm || invitation.confirmDisabledReason,
    );
  const acceptReason = invitation.acceptDisabledReason || '';
  const confirmReason = invitation.confirmDisabledReason || '';

  return (
    <Box
      component="article"
      className="kep-duel-invitation"
      sx={{
        ...contentInsetSx,
        borderBottom: '1px solid var(--kep-line)',
        borderInlineStart: invitation.requiresResponse
          ? '3px solid var(--mui-palette-warning-main)'
          : 0,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-start' }}
          spacing={2}
        >
          <Stack spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip
                icon={<IconifyIcon icon={statusMeta.icon} width={16} height={16} />}
                label={t(statusMeta.label)}
                color={statusMeta.color}
                variant="soft"
                size="small"
              />
              {invitation.isBot ? (
                <Chip
                  label={t('duels.botCall')}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ) : null}
              {waitingFor ? (
                <Chip
                  label={t('duels.waitingForUser', { username: waitingFor })}
                  size="small"
                  variant="soft"
                  color={invitation.requiresResponse ? 'warning' : 'default'}
                />
              ) : null}
            </Stack>

            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', lg: 'center' }}
            >
              <ParticipantBadge user={creator} />
              {claimant ? (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.25}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    vs
                  </Typography>
                  <ParticipantBadge user={claimant} />
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('duels.openForClaim')}
                </Typography>
              )}
            </Stack>

            <Stack spacing={0.75}>
              <Typography variant="subtitle1" fontWeight={600}>
                {invitation.preset?.title ?? t('duels.createDuel')}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {invitation.duelType?.title ? (
                  <Typography variant="body2" color="text.secondary">
                    {invitation.duelType.title}
                  </Typography>
                ) : null}
                {invitation.preset?.duration ? (
                  <Typography variant="metric" sx={{ fontSize: 15 }}>
                    {formatDuelDuration(invitation.preset.duration)}
                  </Typography>
                ) : null}
                {typeof invitation.preset?.problemsCount === 'number' ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('duels.presetProblemsCount', {
                      count: invitation.preset.problemsCount,
                    })}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            {createdRelative ? (
              <Typography variant="caption" color="text.secondary">
                {t('duels.createdRelative', { time: createdRelative })}
              </Typography>
            ) : null}
            {invitation.proposedStartTime ? (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <IconifyIcon icon="mdi:calendar-clock-outline" width={17} height={17} />
                <Typography variant="body2" fontWeight={700}>
                  {formatDate(invitation.proposedStartTime)}
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        </Stack>

        {invitation.preset?.description || problemsLabel ? (
          <Box sx={{ pt: 1.5, borderTop: '1px solid var(--kep-line)' }}>
            <Stack spacing={0.75}>
              {invitation.preset?.description ? (
                <Typography variant="body2" color="text.secondary">
                  {invitation.preset.description}
                </Typography>
              ) : null}
              {problemsLabel ? (
                <Typography variant="caption" color="text.secondary">
                  {t('duels.lockedProblems')}: {problemsLabel}
                </Typography>
              ) : null}
            </Stack>
          </Box>
        ) : null}

        <Stack spacing={1}>
          <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
            {invitation.canCancel ? (
              <ActionButton
                title={t('duels.cancelCall')}
                color="inherit"
                loading={actionLoadingKey === `cancel-${invitation.id}`}
                onClick={onCancel}
                icon="mdi:close-circle-outline"
              />
            ) : null}

            {invitation.canReject ? (
              <ActionButton
                title={t('duels.reject')}
                color="inherit"
                loading={actionLoadingKey === `reject-${invitation.id}`}
                onClick={onReject}
                icon="mdi:close-thick"
              />
            ) : null}

            {invitation.canCounter ? (
              <ActionButton
                title={t('duels.suggestNewTime')}
                loading={actionLoadingKey === `counter-${invitation.id}`}
                onClick={onCounter}
                icon="mdi:calendar-refresh-outline"
              />
            ) : null}

            {shouldShowConfirm ? (
              <Tooltip title={!invitation.canConfirm ? confirmReason : ''}>
                <span>
                  <ActionButton
                    title={t('duels.confirm')}
                    color="success"
                    variant="contained"
                    disabled={!invitation.canConfirm}
                    loading={actionLoadingKey === `confirm-${invitation.id}`}
                    onClick={onConfirm}
                    icon="mdi:check-bold"
                  />
                </span>
              </Tooltip>
            ) : null}

            {shouldShowAccept ? (
              <Tooltip title={!invitation.canAccept ? acceptReason : ''}>
                <span>
                  <ActionButton
                    title={t('duels.accept')}
                    color="primary"
                    variant="contained"
                    disabled={!invitation.canAccept}
                    loading={actionLoadingKey === `accept-${invitation.id}`}
                    onClick={onAccept}
                    icon="mdi:calendar-check-outline"
                  />
                </span>
              </Tooltip>
            ) : null}

            {invitation.duelId ? (
              <ActionButton
                title={t('duels.openWorkspace')}
                loading={actionLoadingKey === `open-${invitation.id}`}
                onClick={onOpen}
                icon="mdi:open-in-new"
              />
            ) : null}
          </Stack>

          {!invitation.canConfirm && shouldShowConfirm && confirmReason ? (
            <Typography variant="caption" color="text.secondary" textAlign="right">
              {confirmReason}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
};

export default DuelInvitationCard;
