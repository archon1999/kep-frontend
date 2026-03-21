import { Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { Arena } from '../../domain/entities/arena.entity.ts';
import { ArenaStatistics } from '../../domain/entities/arena-statistics.entity.ts';
import { useArenaInsights } from '../../application/hooks/useArenaInsights.ts';

interface ArenaStatisticsCardProps {
  arena?: Arena;
  stats?: ArenaStatistics;
  titleKey?: string;
}

const OverviewStat = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <Stack spacing={0.5} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <IconifyIcon icon={icon} color="warning.main" fontSize={20} />
      <Typography variant="body1" fontWeight={500}>
        {label}
      </Typography>
    </Stack>
    <Typography variant="h5" fontWeight={800}>
      {value}
    </Typography>
  </Stack>
);

const ArenaStatisticsCard = ({ arena, stats, titleKey = 'arena.statistics' }: ArenaStatisticsCardProps) => {
  const { t } = useTranslation();
  const { summaryItems, leaders, showLeaders } = useArenaInsights(arena, stats, t);

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={2.5}>
          <Typography variant="h6" fontWeight={800}>
            {t(titleKey)}
          </Typography>

          <Grid container spacing={1.5}>
            {summaryItems.map((item) => (
              <Grid key={item.key} size={{ xs: 12, sm: 6, md: 12 }}>
                <OverviewStat label={item.label} value={item.value} icon={item.icon} />
              </Grid>
            ))}
          </Grid>

          {showLeaders ? (
            <>
              <Divider />
              <Stack direction="column" spacing={1.5}>
                {leaders.map((leader) => (
                  <Stack
                    key={leader.key}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.default' }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                      <IconifyIcon icon={leader.icon} color="warning.main" fontSize={20} />
                      <Typography variant="body1">
                        {leader.label}
                      </Typography>
                    </Stack>

                    {leader.value?.username ? (
                      <Stack direction="column" alignItems="flex-end" spacing={0.25} minWidth={0}>
                        <UserPopover username={leader.value.username}>
                          <Typography fontWeight={800} noWrap>
                            {leader.value.username}
                          </Typography>
                        </UserPopover>
                        <Typography variant="body2" fontFamily="monospace" color="warning.dark">
                          {leader.value.value}
                          {leader.key === 'highestWinRate' ? '%' : ''}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('arena.insights.noLeader')}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </Stack>
            </>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ArenaStatisticsCard;
