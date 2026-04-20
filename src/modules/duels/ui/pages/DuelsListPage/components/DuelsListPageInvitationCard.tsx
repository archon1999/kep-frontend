import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import UserPopover from 'modules/users/ui/components/UserPopover.tsx';
import { DuelInvitation, DuelInvitationUser } from 'modules/duels/domain/index.ts';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip.tsx';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

dayjs.extend(relativeTime);

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

const formatDate = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
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

const ParticipantBadge = ({ user }: { user: DuelInvitationUser }) => {
  const content = (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="subtitle2" fontWeight={800} noWrap>
          {user.displayName || user.username}
        </Typography>
        {user.isBot ? (
          <Chip size="small" color="secondary" variant="outlined" label="BOT" />
        ) : null}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        {typeof user.contestsRating === 'number' || user.contestsRatingTitle ? (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <ContestsRatingChip title={user.contestsRatingTitle} imgSize={22} />
            <Typography variant="caption" color="text.secondary">
              {typeof user.contestsRating === 'number' ? user.contestsRating : '--'}
            </Typography>
          </Stack>
        ) : null}
        <Typography variant="caption" color="text.secondary" noWrap>
          @{user.username}
        </Typography>
      </Stack>
    </Stack>
  );

  if (user.isBot) {
    return content;
  }

  return (
    <UserPopover username={user.username} avatar={user.avatar ?? undefined}>
      {content}
    </UserPopover>
  );
};

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

const DuelsListPageInvitationCard = ({
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
  const waitingFor = invitation.actionRequiredBy?.displayName || invitation.actionRequiredBy?.username;
  const createdRelative = invitation.created ? dayjs(invitation.created).fromNow() : null;
  const creator = invitation.challenger;
  const claimant = invitation.invitee ?? null;
  const shouldShowAccept = invitation.status === 1 && invitation.viewerRole !== 'challenger';
  const shouldShowConfirm = Boolean(invitation.requiresResponse || invitation.canConfirm || invitation.confirmDisabledReason);
  const acceptReason = invitation.acceptDisabledReason || '';
  const confirmReason = invitation.confirmDisabledReason || '';

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 3,
        borderColor:
          invitation.requiresResponse
            ? alpha(theme.palette.warning.main, 0.35)
            : alpha(theme.palette.primary.main, 0.12),
      })}
    >
      <CardContent sx={{ p: 2.25 }}>
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
                  variant={invitation.status <= 3 ? 'outlined' : 'filled'}
                  size="small"
                />
                {invitation.isBot ? (
                  <Chip label={t('duels.botCall')} size="small" variant="outlined" color="secondary" />
                ) : null}
                {waitingFor ? (
                  <Chip
                    label={t('duels.waitingForUser', { username: waitingFor })}
                    size="small"
                    variant={invitation.requiresResponse ? 'filled' : 'outlined'}
                    color={invitation.requiresResponse ? 'warning' : 'default'}
                  />
                ) : null}
              </Stack>

              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', lg: 'center' }}
                divider={<Divider flexItem orientation="vertical" />}
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
                <Typography variant="subtitle1" fontWeight={800}>
                  {invitation.preset?.title ?? t('duels.createDuel')}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
                      label={t('duels.presetProblemsCountShort', { count: invitation.preset.problemsCount })}
                      variant="outlined"
                    />
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
            <Box
              sx={(theme) => ({
                borderRadius: 2.5,
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              })}
            >
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

            {!invitation.canAccept && shouldShowAccept && acceptReason ? (
              <Typography variant="caption" color="text.secondary" textAlign="right">
                {acceptReason}
              </Typography>
            ) : null}

            {!invitation.canConfirm && shouldShowConfirm && confirmReason ? (
              <Typography variant="caption" color="text.secondary" textAlign="right">
                {confirmReason}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DuelsListPageInvitationCard;
