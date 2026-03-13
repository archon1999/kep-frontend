import { ReactNode } from 'react';
import { Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { Arena, ArenaStatus } from '../../domain/entities/arena.entity.ts';

interface ArenaInfoCardProps {
  arena: Arena;
  onRegister?: () => Promise<void>;
  onNextChallenge?: () => Promise<void>;
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

const ArenaInfoCard = ({ arena, onRegister, onNextChallenge, isLoadingAction }: ArenaInfoCardProps) => {
  const { t } = useTranslation();

  const renderAction = () => {
    if (arena.status === ArenaStatus.Finished) return null;

    if (!arena.isRegistrated) {
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

    if (arena.status === ArenaStatus.Already) {
      return (
        <Button
          fullWidth
          color="success"
          variant="contained"
          onClick={onNextChallenge}
          disabled={isLoadingAction}
          startIcon={<IconifyIcon icon="mdi:lightning-bolt-outline" />}
        >
          {t('arena.actions.nextChallenge')}
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
            <Stack direction="column" spacing={0.5}>
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {t('arena.about')}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip
                  label={t('arena.statusLabel', { status: t(`arena.status.${arena.status === ArenaStatus.Already ? 'live' : arena.status === ArenaStatus.Finished ? 'finished' : 'upcoming'}`) })}
                  color={arena.status === ArenaStatus.Already ? 'success' : arena.status === ArenaStatus.Finished ? 'default' : 'warning'}
                  variant={arena.status === ArenaStatus.Already ? 'filled' : 'outlined'}
                  size="small"
                />
                {arena.chapters?.map((chapter) => (
                  <Chip key={chapter.id} label={chapter.title} size="small" variant="soft" color="primary" />
                ))}
              </Stack>
            </Stack>
            {arena.isRegistrated && (
              <Chip
                color="success"
                variant="soft"
                label={t('arena.registered')}
                icon={<IconifyIcon icon="mdi:check-circle-outline" fontSize={18} />}
              />
            )}
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
          </Stack>

          {renderAction()}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaInfoCard;
