import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { registerForArena, unregisterFromArena } from 'modules/arena/application/mutations';
import { Arena, ArenaStatus } from 'modules/arena/domain/entities/arena.entity.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { formatDateTime } from 'shared/lib/dateTime';
import { toast } from 'sonner';

interface InfoCardProps {
  arena: Arena;
  loginHref: string;
  onChanged?: () => Promise<void>;
}

const metadataGridSx = { m: 0 } as const;

const ArenaDate = ({ value }: { value: string }) => (
  <Stack component="time" dateTime={value} alignItems="flex-end" gap={0.25}>
    <Typography component="span" variant="metric" sx={{ fontSize: 22 }}>
      {formatDateTime(value, 'time')}
    </Typography>
    <Typography component="span" variant="caption" color="text.secondary">
      {formatDateTime(value, 'compactDate')}
    </Typography>
  </Stack>
);

const InfoRow = ({
  label,
  value,
  icon,
  index,
}: {
  label: string;
  value: ReactNode;
  icon: string;
  index: number;
}) => (
  <Box
    sx={{
      minWidth: 0,
      px: 'var(--kep-content-inset)',
      py: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      borderTop: index ? '1px solid var(--kep-line)' : 0,
    }}
  >
    <Stack component="dt" direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
      <IconifyIcon icon={icon} color="primary.main" fontSize={16} />
      <Typography component="span" variant="label" color="text.secondary">
        {label}
      </Typography>
    </Stack>
    <Box
      component="dd"
      sx={{
        m: 0,
        minHeight: 34,
        maxWidth: '55%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'right',
      }}
    >
      {value}
    </Box>
  </Box>
);

const ArenaInfoCard = ({ arena, loginHref, onChanged }: InfoCardProps) => {
  const { t } = useTranslation();
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const isGuest = arena.isRegistrated === null;
  const isRegistered = Boolean(arena.isRegistrated);
  const isUpcoming = arena.status === ArenaStatus.NotStarted;
  const isOngoing = arena.status === ArenaStatus.Already;
  const isFinished = arena.status === ArenaStatus.Finished;

  const handleRegister = async () => {
    setIsLoadingAction(true);
    try {
      await registerForArena(arena.id);
      await onChanged?.();
    } catch {
      toast.error(
        t('common.error', {
          defaultValue: 'Something went wrong',
        }),
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleUnregister = async () => {
    setIsLoadingAction(true);
    try {
      await unregisterFromArena(arena.id);
      await onChanged?.();
    } catch {
      toast.error(
        t('common.error', {
          defaultValue: 'Something went wrong',
        }),
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  const renderActions = () => {
    if (isFinished) return null;

    if (isGuest) {
      return (
        <Button
          fullWidth
          color="primary"
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
            color="primary"
            variant="contained"
            onClick={() => void handleRegister()}
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
          onClick={() => void handleUnregister()}
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
          color="primary"
          variant="contained"
          onClick={() => void handleRegister()}
          disabled={isLoadingAction}
          startIcon={<IconifyIcon icon="mdi:ticket-confirmation-outline" />}
        >
          {t('arena.actions.register')}
        </Button>
      );
    }

    return null;
  };

  const action = renderActions();
  return (
    <Paper component="section" variant="section" className="kep-arena-overview">
      <SectionHeader
        title={t('arena.about')}
        action={<PatternArtwork kind="battles" sx={{ width: 64 }} />}
      />
      <Box component="dl" sx={metadataGridSx}>
        <InfoRow
          index={0}
          label={t('arena.timeline.start')}
          icon="mdi:calendar-start"
          value={<ArenaDate value={arena.startTime} />}
        />
        <InfoRow
          index={1}
          label={t('arena.timeline.finish')}
          icon="mdi:calendar-end"
          value={<ArenaDate value={arena.finishTime} />}
        />
        <InfoRow
          index={2}
          label={t('arena.duration')}
          icon="mdi:timer-outline"
          value={
            <Typography variant="metric" sx={{ fontSize: 26 }}>
              {t('arena.secondsShort', { count: arena.timeSeconds })}
            </Typography>
          }
        />
        <InfoRow
          index={3}
          label={t('arena.questions')}
          icon="mdi:help-circle-outline"
          value={
            <Typography variant="metric" sx={{ fontSize: 26 }}>
              {arena.questionsCount}
            </Typography>
          }
        />
        <InfoRow
          index={4}
          label={t('arena.questionTimeType.label')}
          icon="mdi:clock-fast"
          value={
            <Typography
              variant="body2"
              sx={{ fontFamily: 'var(--kep-display-font)', fontSize: 16 }}
            >
              {arena.questionTimeType === 2
                ? t('arena.questionTimeType.all')
                : t('arena.questionTimeType.one')}
            </Typography>
          }
        />
      </Box>
      {(action || (isRegistered && !isFinished)) && (
        <Stack
          gap={1.5}
          sx={{ p: 'var(--kep-content-inset)', borderTop: '1px solid var(--kep-line)' }}
        >
          {isRegistered && !isFinished && (
            <Chip
              color="success"
              variant="status"
              label={t('arena.registered')}
              icon={<IconifyIcon icon="mdi:check-circle-outline" fontSize={16} />}
              sx={{ alignSelf: 'flex-start' }}
            />
          )}
          {action}
        </Stack>
      )}
    </Paper>
  );
};

export default ArenaInfoCard;

export const ArenaInfoCardSkeleton = () => {
  const { t } = useTranslation();
  const fields = [
    ['arena.timeline.start', 'mdi:calendar-start'],
    ['arena.timeline.finish', 'mdi:calendar-end'],
    ['arena.duration', 'mdi:timer-outline'],
    ['arena.questions', 'mdi:help-circle-outline'],
    ['arena.questionTimeType.label', 'mdi:clock-fast'],
  ];
  return (
    <Paper component="section" variant="section" aria-busy="true">
      <SectionHeader
        title={t('arena.about')}
        action={<PatternArtwork kind="battles" sx={{ width: 64 }} />}
      />
      <Box component="dl" sx={metadataGridSx}>
        {fields.map(([label, icon], index) => (
          <InfoRow
            key={label}
            index={index}
            label={t(label)}
            icon={icon}
            value={
              index < 2 ? (
                <Stack alignItems="flex-end" gap={0.25}>
                  <Typography variant="metric" sx={{ fontSize: 22 }}>
                    <Skeleton width={72} height="1.2em" />
                  </Typography>
                  <Typography variant="caption">
                    <Skeleton width={110} height="1.5em" />
                  </Typography>
                </Stack>
              ) : (
                <Typography
                  variant={index === 4 ? 'body2' : 'metric'}
                  sx={{ fontSize: index === 4 ? 16 : 26 }}
                >
                  <Skeleton width={index === 4 ? 120 : 60} height="1.2em" />
                </Typography>
              )
            }
          />
        ))}
      </Box>
    </Paper>
  );
};
