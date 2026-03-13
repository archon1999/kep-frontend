import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { HackAttempt } from '../../../domain/entities/problem.entity';

interface HackAttemptsCardProps {
  attempts: HackAttempt[];
  total: number;
  pagination: { page: number; pageSize: number };
  onPaginationChange: (value: { page: number; pageSize: number }) => void;
  onRefresh: () => void;
}

export const HackAttemptsCard = ({ attempts, total, pagination, onPaginationChange, onRefresh }: HackAttemptsCardProps) => {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pagination.pageSize || 1)));

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">{t('problems.detail.hackAttempts')}</Typography>
          <Button onClick={onRefresh} startIcon={<IconifyIcon icon="mdi:refresh" />} size="small">
            {t('problems.detail.refresh')}
          </Button>
        </Stack>

        {attempts.length === 0 ? (
          <Typography color="text.secondary">{t('problems.detail.noHackAttempts')}</Typography>
        ) : (
          <Stack direction="column" spacing={1.5}>
            {attempts.map((attempt) => (
              <Card key={attempt.id} variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Stack direction="row" spacing={0.25}>
                      <Typography variant="body2" color="text.secondary">
                        #{attempt.id} {attempt.hackType}
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>
                        {attempt.problemId}. {attempt.problemTitle}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1.5} mt={1} flexWrap="wrap">
                    <Chip
                      icon={<IconifyIcon icon="mdi:sword-cross" width={16} height={16} />}
                      label={`${t('problems.detail.hacker')}: ${attempt.hackerUsername}`}
                      size="small"
                    />
                    <Chip
                      icon={<IconifyIcon icon="mdi:shield-outline" width={16} height={16} />}
                      label={`${t('problems.detail.defender')}: ${attempt.defenderUsername}`}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" mt={2}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onPaginationChange({ page: Math.max(0, pagination.page - 1), pageSize: pagination.pageSize })}
            disabled={pagination.page === 0}
          >
            {t('problems.detail.previous')}
          </Button>
          <Typography variant="body2">
            {pagination.page + 1}/{totalPages}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              onPaginationChange({
                page: Math.min(totalPages - 1, pagination.page + 1),
                pageSize: pagination.pageSize,
              })
            }
            disabled={pagination.page + 1 >= totalPages}
          >
            {t('problems.detail.next')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
