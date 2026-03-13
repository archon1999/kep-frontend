import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { PieChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEchart from 'shared/components/base/ReactEchart';
import { getColor } from 'shared/lib/echart-utils';
import { useProblemStatistics } from 'modules/problems/application/queries.ts';
import { ProblemDetail, ProblemTopAttempt } from '../../../domain/entities/problem.entity';

echarts.use([GridComponent, TooltipComponent, LegendComponent, PieChart, LineChart, CanvasRenderer]);

const integerAxisLabelFormatter = (value: number) => Math.round(value).toString();

interface ProblemStatisticsTabProps {
  problemId: number;
  problem?: ProblemDetail | null;
}

const usePaletteMap = () => {
  const theme = useTheme();
  return useMemo(
    () => ({
      primary: getColor(theme.vars.palette.primary.main),
      secondary: getColor(theme.vars.palette.secondary.main),
      success: getColor(theme.vars.palette.success.main),
      info: getColor(theme.vars.palette.info.main),
      warning: getColor(theme.vars.palette.warning.main),
      danger: getColor(theme.vars.palette.error.main),
      error: getColor(theme.vars.palette.error.main),
      dark: getColor(theme.vars.palette.text.primary),
      black: '#111',
      yellow: '#b8c00c',
      blue: '#4360ec',
      brown: '#ba782b',
    }),
    [theme.vars.palette],
  );
};

const TopAttemptsTable = ({
  attempts,
  ordering,
  onOrderingChange,
}: {
  attempts: ProblemTopAttempt[];
  ordering: 'time' | 'memory' | 'sourceCodeSize';
  onOrderingChange: (value: 'time' | 'memory' | 'sourceCodeSize') => void;
}) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardHeader
        title={t('problems.detail.topAttempts')}
        action={
          <ToggleButtonGroup
            exclusive
            size="small"
            color="primary"
            value={ordering}
            onChange={(_, value) => value && onOrderingChange(value)}
          >
            <ToggleButton value="time">{t('problems.detail.time')}</ToggleButton>
            <ToggleButton value="memory">{t('problems.detail.memory')}</ToggleButton>
            <ToggleButton value="sourceCodeSize">{t('problems.detail.codeSize')}</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('problems.detail.user')}</TableCell>
              <TableCell align="right">{t('problems.detail.result')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attempts.map((attempt, index) => (
              <TableRow key={`${attempt.username}-${index}`}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={600}>{attempt.username}</Typography>
                    {attempt.ratingTitle ? (
                      <Chip label={attempt.ratingTitle} size="small" variant="outlined" />
                    ) : null}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  {ordering === 'time' && (
                    <Chip color="info" size="small" label={`${attempt.time ?? '-'} ms`} />
                  )}
                  {ordering === 'memory' && (
                    <Chip color="primary" size="small" label={`${attempt.memory ?? '-'} KB`} />
                  )}
                  {ordering === 'sourceCodeSize' && (
                    <Chip color="default" size="small" label={`${attempt.sourceCodeSize ?? '-'} B`} />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!attempts.length ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {t('problems.detail.noTopAttempts')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const ProblemStatisticsTab = ({ problemId, problem }: ProblemStatisticsTabProps) => {
  const { t } = useTranslation();
  const paletteMap = usePaletteMap();
  const [topOrdering, setTopOrdering] = useState<'time' | 'memory' | 'sourceCodeSize'>('time');
  const { data: stats, isLoading } = useProblemStatistics(problemId);

  const attemptChart: EChartsCoreOption | null = useMemo(() => {
    if (!stats?.attemptStatistics?.length) return null;

    const data = stats.attemptStatistics.map((item) => ({
      name: item.verdictTitle || String(item.verdict),
      value: item.value,
      itemStyle: {
        color: paletteMap[(item.color as keyof ReturnType<typeof usePaletteMap>) ?? 'primary'] ?? paletteMap.primary,
      },
    }));

    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll' },
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          data,
          label: { formatter: '{b}\n{c}' },
        },
      ],
    };
  }, [paletteMap, stats?.attemptStatistics]);

  const langChart: EChartsCoreOption | null = useMemo(() => {
    if (!stats?.languageStatistics?.length) return null;

    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll' },
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          data: stats.languageStatistics.map((item) => ({
            name: item.langFull,
            value: item.value,
          })),
          label: { formatter: '{b}\n{c}' },
        },
      ],
    };
  }, [stats?.languageStatistics]);

  const attemptsForSolveChart: EChartsCoreOption | null = useMemo(() => {
    if (!stats?.attemptsForSolveStatistics?.length) return null;

    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: stats.attemptsForSolveStatistics.map((item) => item.attempts),
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        max: 100,
        minInterval: 1,
        axisLabel: { formatter: integerAxisLabelFormatter },
      },
      series: [
        {
          type: 'line',
          data: stats.attemptsForSolveStatistics.map((item) => item.value),
          smooth: true,
          areaStyle: {},
          name: t('problems.detail.solved'),
        },
      ],
    };
  }, [stats?.attemptsForSolveStatistics, t]);

  const topAttempts: ProblemTopAttempt[] = useMemo(
    () => (stats?.topAttempts?.[topOrdering] ?? []) as ProblemTopAttempt[],
    [stats?.topAttempts, topOrdering],
  );

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">{t('problems.detail.statisticsTitle')}</Typography>
            <LinearProgress />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          <Typography color="text.secondary">{t('problems.detail.noStatistics')}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
            <Typography variant="h6">{t('problems.detail.statisticsTitle')}</Typography>
            <Divider flexItem orientation="vertical" />
            <Chip
              color="success"
              label={`${t('problems.detail.usersSolved')}: ${problem?.solved ?? '-'}`}
              size="small"
              variant="outlined"
            />
            <Chip
              color="error"
              label={`${t('problems.detail.usersUnsolved')}: ${problem?.notSolved ?? '-'}`}
              size="small"
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={12}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader title={t('problems.detail.attemptStatistics')} />
            <CardContent>
              {attemptChart ? (
                <ReactEchart echarts={echarts} option={attemptChart} style={{ height: 320 }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('problems.detail.noStatistics')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader title={t('problems.detail.languageStatistics')} />
            <CardContent>
              {langChart ? (
                <ReactEchart echarts={echarts} option={langChart} style={{ height: 320 }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('problems.detail.noStatistics')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={12}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader title={t('problems.detail.numberAttemptsSolve')} />
            <CardContent>
              {attemptsForSolveChart ? (
                <ReactEchart echarts={echarts} option={attemptsForSolveChart} style={{ height: 280 }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('problems.detail.noStatistics')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <TopAttemptsTable
            attempts={topAttempts}
            ordering={topOrdering}
            onOrderingChange={(value) => setTopOrdering(value)}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
