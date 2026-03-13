import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { useTranslation } from 'react-i18next';
import { ArenaStatistics } from '../../domain/entities/arena-statistics.entity.ts';

interface ArenaStatisticsCardProps {
  stats?: ArenaStatistics;
}

const StatRow = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <Stack direction="row" alignItems="center" spacing={1.5}>
    <IconifyIcon icon={icon} color="warning.main" fontSize={24} />
    <Stack direction="column" spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={800}>{value}</Typography>
    </Stack>
  </Stack>
);

const ArenaStatisticsCard = ({ stats }: ArenaStatisticsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={800}>
            {t('arena.statistics')}
          </Typography>
          <StatRow label={t('arena.averageRating')} value={stats?.averageRating ?? 0} icon="mdi:chart-line" />
          <Divider />
          <StatRow label={t('arena.totalChallenges')} value={stats?.challenges ?? 0} icon="mdi:swords" />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaStatisticsCard;
