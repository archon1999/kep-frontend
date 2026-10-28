import { useTranslation } from 'react-i18next';
import { Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useArenaInsights } from 'modules/arena/application/hooks/useArenaInsights.ts';
import { ArenaHighlight } from 'modules/arena/domain/entities/arena-highlight.entity.ts';
import { ArenaStatistics } from 'modules/arena/domain/entities/arena-statistics.entity.ts';
import { Arena } from 'modules/arena/domain/entities/arena.entity.ts';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import StatisticsMetric from 'shared/components/statistics/StatisticsMetric';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import ArenaHighlightBanner from './ArenaHighlightBanner.tsx';

interface StatisticsCardProps {
  arena?: Arena;
  stats?: ArenaStatistics;
  titleKey?: string;
  highlight?: ArenaHighlight;
  loading?: boolean;
}

const OverviewStat = ({
  label,
  value,
  icon,
  loading,
}: {
  label: string;
  value: string | number;
  icon: string;
  loading?: boolean;
}) => (
  <StatisticsMetric
    embedded
    layout="inline"
    label={label}
    value={loading ? <Skeleton width={70} height="1.2em" /> : value}
    icon={<IconifyIcon icon={icon} fontSize={20} />}
  />
);

const ArenaStatisticsCard = ({
  arena,
  stats,
  highlight,
  loading,
  titleKey = 'arena.statistics',
}: StatisticsCardProps) => {
  const { t } = useTranslation();
  const { summaryItems, leaders, showLeaders } = useArenaInsights(arena, stats, t);

  return (
    <StatisticsSection
      className="kep-arena-insights"
      title={t(titleKey)}
      action={<PatternArtwork kind="activity" sx={{ width: 64 }} />}
      sx={{ outline: 0, height: 'auto' }}
    >
      <Stack direction="column" spacing={2.5}>
        <ArenaHighlightBanner highlight={highlight} />

        <Grid container spacing={0}>
          {summaryItems.map((item) => (
            <Grid
              key={item.key}
              size={12}
              sx={{ py: 1.5, borderBottom: '1px solid var(--kep-line)' }}
            >
              <OverviewStat
                label={item.label}
                value={item.value}
                icon={item.icon}
                loading={loading}
              />
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
                  sx={{
                    p: 1.5,
                    minHeight: 72,
                    borderRadius: 0,
                    bgcolor: 'transparent',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                    <IconifyIcon icon={leader.icon} color="primary.main" fontSize={20} />
                    <Typography variant="body2">{leader.label}</Typography>
                  </Stack>

                  {loading ? (
                    <Stack alignItems="flex-end">
                      <Skeleton width={80} />
                      <Skeleton width={40} />
                    </Stack>
                  ) : leader.value?.username ? (
                    <Stack direction="column" alignItems="flex-end" spacing={0.25} minWidth={0}>
                      <UserPopover username={leader.value.username}>
                        <Typography fontWeight={600} noWrap>
                          {leader.value.username}
                        </Typography>
                      </UserPopover>
                      <Typography variant="metric" color="primary.main" sx={{ fontSize: 16 }}>
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
    </StatisticsSection>
  );
};

export default ArenaStatisticsCard;
