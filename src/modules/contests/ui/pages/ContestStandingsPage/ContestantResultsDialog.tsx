import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  AvatarGroup,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useContestContestantTimeline } from 'modules/contests/application/queries';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import { formatContestPoints } from 'modules/contests/ui/shared/utils/contestType';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ReactEchart from 'shared/components/base/ReactEchart';
import { getColor } from 'shared/lib/echart-utils';
import ContestantAutocomplete from './ContestantAutocomplete';

echarts.use([GridComponent, LegendComponent, TooltipComponent, LineChart, CanvasRenderer]);

interface ContestantResultsDialogProps {
  open: boolean;
  onClose: () => void;
  contestId?: number | string;
  contestantId?: number | string;
  contestant?: ContestantEntity | null;
  showPenalties?: boolean;
}

const formatElapsedTime = (value?: number | string | null) => {
  const seconds = Math.max(Math.floor(Number(value) || 0), 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const getAxisInterval = () => 15 * 60;

const getInitial = (value?: string) => value?.trim().charAt(0).toUpperCase() || '?';

const getSeriesName = (contestant?: ContestantEntity | null, fallback = '') =>
  contestant?.team?.name || contestant?.username || fallback;

interface ContestantSummaryRowProps {
  contestant?: ContestantEntity | null;
  loading?: boolean;
  showPenalties?: boolean;
}

const renderContestantAvatar = (contestant?: ContestantEntity | null, size = 48) => {
  if (contestant?.team?.members?.length) {
    return (
      <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: size, height: size } }}>
        {contestant.team.members.map((member) => (
          <Avatar key={member.username} src={member.avatar ?? undefined} alt={member.username}>
            {getInitial(member.username)}
          </Avatar>
        ))}
      </AvatarGroup>
    );
  }

  return (
    <Avatar
      src={contestant?.avatar ?? undefined}
      alt={contestant?.username}
      sx={{ width: size, height: size }}
    >
      {getInitial(contestant?.username)}
    </Avatar>
  );
};

const ContestantSummaryRow = ({
  contestant,
  loading = false,
  showPenalties = false,
}: ContestantSummaryRowProps) => (
  <Box
    sx={{
      borderRadius: 1,
      px: 1.5,
      py: 1.25,
      bgcolor: 'background.elevation1',
    }}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', sm: 'center' }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0} flex={1}>
        {loading && !contestant ? (
          <Skeleton variant="circular" width={48} height={48} />
        ) : (
          renderContestantAvatar(contestant, 48)
        )}

        <Typography
          variant="body2"
          fontWeight={800}
          color="text.secondary"
          sx={{ width: 44, flexShrink: 0 }}
        >
          {contestant?.rank ? `#${contestant.rank}` : '-'}
        </Typography>

        <Box minWidth={0} flex={1}>
          {contestant ? (
            <ContestantView
              contestant={contestant}
              imgSize={28}
              isVirtual={contestant.isVirtual}
              isUnrated={contestant.isUnrated}
              isOfficial={contestant.isOfficial}
              showCountry
            />
          ) : (
            <Skeleton width={220} />
          )}
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
        sx={{ minWidth: 96 }}
      >
        {loading && contestant ? <CircularProgress color="inherit" size={16} /> : null}
        <Typography variant="body2" fontWeight={800} color="primary.main">
          {contestant?.points === undefined || contestant?.points === null
            ? '-'
            : formatContestPoints(contestant.points)}
        </Typography>
        {showPenalties ? (
          <Typography variant="caption" color="error.main">
            ({contestant?.penalties ?? 0})
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  </Box>
);

const ContestantResultsDialog = ({
  open,
  onClose,
  contestId,
  contestantId,
  contestant: fallbackContestant,
  showPenalties = false,
}: ContestantResultsDialogProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [comparisonContestant, setComparisonContestant] = useState<ContestantEntity | null>(null);
  const { data: timeline, isLoading } = useContestContestantTimeline(contestId, contestantId, open);
  const { data: comparisonTimeline, isLoading: isComparisonLoading } = useContestContestantTimeline(
    contestId,
    comparisonContestant?.id,
    open && Boolean(comparisonContestant?.id),
  );

  useEffect(() => {
    setComparisonContestant(null);
  }, [contestantId, open]);

  const contestant = timeline?.contestant ?? fallbackContestant ?? null;
  const points = timeline?.points ?? [];
  const comparisonContestantData = comparisonTimeline?.contestant ?? comparisonContestant;
  const comparisonPoints = comparisonTimeline?.points ?? [];
  const chartPoints = useMemo(
    () => points.map((point) => [point.contestTimeSeconds, point.solvedCount]),
    [points],
  );
  const comparisonChartPoints = useMemo(
    () => comparisonPoints.map((point) => [point.contestTimeSeconds, point.solvedCount]),
    [comparisonPoints],
  );
  const maxSolved = Math.max(
    ...points.map((point) => point.solvedCount),
    ...comparisonPoints.map((point) => point.solvedCount),
    contestant?.solvedCount ?? 0,
    comparisonContestantData?.solvedCount ?? 0,
    1,
  );
  const durationSeconds = Math.max(
    timeline?.durationSeconds ?? 0,
    comparisonTimeline?.durationSeconds ?? 0,
    1,
  );
  const primarySeriesName = getSeriesName(contestant, t('contests.standings.primaryContestant'));
  const comparisonSeriesName = getSeriesName(
    comparisonContestantData,
    t('contests.standings.comparisonContestant'),
  );

  const chartOption = useMemo<EChartsCoreOption>(
    () => ({
      grid: {
        top: comparisonContestant ? 42 : 24,
        right: 18,
        bottom: 42,
        left: 42,
      },
      legend: comparisonContestant
        ? {
            top: 0,
            left: 0,
            data: [primarySeriesName, comparisonSeriesName],
          }
        : undefined,
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const items = Array.isArray(params) ? params : [params];
          const first = items[0];
          const seconds = Number(first?.value?.[0] ?? 0);
          const rows = items
            .map(
              (item: any) =>
                `${item.marker}${item.seriesName}: ${item?.value?.[1] ?? 0} ${t(
                  'contests.standings.solved',
                )}`,
            )
            .join('<br/>');

          return `${formatElapsedTime(seconds)}<br/>${rows}`;
        },
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: durationSeconds,
        interval: getAxisInterval(),
        axisLabel: {
          formatter: (value: number) => formatElapsedTime(value),
        },
        splitLine: {
          lineStyle: {
            color: getColor(theme.vars.palette.divider),
          },
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: maxSolved,
        minInterval: 1,
        axisLabel: {
          formatter: (value: number) => Math.round(value).toString(),
        },
        splitLine: {
          lineStyle: {
            color: getColor(theme.vars.palette.divider),
          },
        },
      },
      series: [
        {
          name: primarySeriesName,
          type: 'line',
          data: chartPoints,
          step: 'end',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: getColor(theme.vars.palette.primary.main),
          },
          itemStyle: {
            color: getColor(theme.vars.palette.primary.main),
          },
          areaStyle: {
            color: getColor(theme.vars.palette.primary.lighter),
            opacity: 0.22,
          },
        },
        ...(comparisonContestant
          ? [
              {
                name: comparisonSeriesName,
                type: 'line',
                data: comparisonChartPoints,
                step: 'end',
                symbolSize: 8,
                lineStyle: {
                  width: 3,
                  color: getColor(theme.vars.palette.warning.main),
                },
                itemStyle: {
                  color: getColor(theme.vars.palette.warning.main),
                },
              },
            ]
          : []),
      ],
    }),
    [
      chartPoints,
      comparisonChartPoints,
      comparisonContestant,
      comparisonSeriesName,
      durationSeconds,
      maxSolved,
      primarySeriesName,
      t,
      theme,
    ],
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="h6" fontWeight={800}>
            {t('contests.standings.contestantResults', { defaultValue: 'Contestant results' })}
          </Typography>
          <IconButton aria-label={t('common.close')} onClick={onClose}>
            <IconifyIcon icon="mdi:close" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
            <Box flex={1} minWidth={0}>
              <ContestantSummaryRow
                contestant={contestant}
                loading={isLoading}
                showPenalties={showPenalties}
              />
            </Box>

            <Stack spacing={1} flex={1} minWidth={0}>
              <ContestantAutocomplete
                contestId={contestId}
                value={comparisonContestant}
                onChange={setComparisonContestant}
                excludeContestantId={contestantId}
                disabled={isLoading}
              />
            </Stack>
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              {t('contests.standings.progressChart')}
            </Typography>
            {isLoading || isComparisonLoading ? (
              <Skeleton variant="rounded" height={320} />
            ) : (
              <ReactEchart echarts={echarts} option={chartOption} style={{ height: 320 }} />
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ContestantResultsDialog;
