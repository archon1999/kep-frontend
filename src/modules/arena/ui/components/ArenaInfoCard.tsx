import { ReactNode } from 'react';
import { Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

interface ArenaInfoCardProps {
  arena: Arena;
  loginHref: string;
  onRegister?: () => Promise<void>;
  onUnregister?: () => Promise<void>;
  isLoadingAction?: boolean;
}

const InfoRow = ({ label, value, icon }: { label: string; value: ReactNode; icon: string }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <IconifyIcon icon={icon} color="warning.main" fontSize={20} />
    <Stack direction="column" spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={700}>{value}</Typography>
    </Stack>
  </Stack>
);

const ArenaInfoCard = ({
  arena,
  loginHref,
  onRegister,
  onUnregister,
  isLoadingAction,
}: ArenaInfoCardProps) => {
  const { t } = useTranslation();
  const isGuest = arena.isRegistrated === null;
  const isRegistered = Boolean(arena.isRegistrated);
  const isUpcoming = arena.status === ArenaStatus.NotStarted;
  const isOngoing = arena.status === ArenaStatus.Already;
  const isFinished = arena.status === ArenaStatus.Finished;

  const renderActions = () => {
    if (isFinished) return null;

    if (isGuest) {
      return (
        <Button
          fullWidth
          color="warning"
          variant="contained"
          component={RouterLink}
          to={loginHref}
          startIcon={<IconifyIcon icon="mdi:login-variant" />}
        >
          {t('arena.actions.login')}
        </Button>
      );
    }

    if (isUpcoming) {
      if (!isRegistered) {
        return (
          <Button
            fullWidth
            color="warning"
            variant="contained"
            onClick={onRegister}
            disabled={isLoadingAction}
            startIcon={<IconifyIcon icon="mdi:ticket-confirmation-outline" />}
          >
            {t('arena.actions.register')}
          </Button>
        );
      }

      return (
        <Button
          fullWidth
          color="error"
          variant="soft"
          onClick={onUnregister}
          disabled={isLoadingAction}
          startIcon={<IconifyIcon icon="mdi:close-circle-outline" />}
        >
          {t('arena.actions.unregister')}
        </Button>
      );
    }

    if (isOngoing && isRegistered) {
      return null;
    }

    if (!isRegistered) {
      return (
        <Button
          fullWidth
          color="warning"
          variant="contained"
          onClick={onRegister}
          disabled={isLoadingAction}
          startIcon={<IconifyIcon icon="mdi:ticket-confirmation-outline" />}
        >
          {t('arena.actions.register')}
        </Button>
      );
    }

    return null;
  };

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="column" spacing={0.75}>
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {t('arena.about')}
              </Typography>
            </Stack>
            {isRegistered && !isFinished ? (
              <Chip
                color="success"
                variant="soft"
                label={t('arena.registered')}
                icon={<IconifyIcon icon="mdi:check-circle-outline" fontSize={18} />}
              />
            ) : null}
          </Stack>

          <Divider />

          <Stack direction="column" spacing={2}>
            <InfoRow
              label={t('arena.timeline.start')}
              value={dayjs(arena.startTime).format('DD MMM YYYY, HH:mm')}
              icon="mdi:calendar-start"
            />
            <InfoRow
              label={t('arena.timeline.finish')}
              value={dayjs(arena.finishTime).format('DD MMM YYYY, HH:mm')}
              icon="mdi:calendar-end"
            />
            <InfoRow label={t('arena.duration')} value={`${arena.timeSeconds}s`} icon="mdi:timer-outline" />
            <InfoRow label={t('arena.questions')} value={arena.questionsCount} icon="mdi:help-circle-outline" />
            <InfoRow
              label={t('arena.questionTimeType.label')}
              value={
                arena.questionTimeType === 2
                  ? t('arena.questionTimeType.all')
                  : t('arena.questionTimeType.one')
              }
              icon="mdi:clock-fast"
            />
          </Stack>

          {renderActions()}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaInfoCard;
