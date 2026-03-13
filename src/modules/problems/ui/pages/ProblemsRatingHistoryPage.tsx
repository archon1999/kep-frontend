import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Pagination,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Palette } from '@mui/material/styles';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router-dom';
import UserPopover from 'modules/users/ui/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useProblemsRatingHistory } from '../../application/queries';
import {
  ProblemsRatingHistoryEntry,
  ProblemsRatingHistoryType,
} from '../../domain/entities/problem.entity';

type RatingHistoryColor = keyof Pick<Palette, 'success' | 'info' | 'primary'>;

const ratingHistoryConfigs: Array<{
  type: ProblemsRatingHistoryType;
  periodKey: 'daily' | 'weekly' | 'monthly';
  color: RatingHistoryColor;
}> = [
  { type: 1, periodKey: 'daily', color: 'success' },
  { type: 2, periodKey: 'weekly', color: 'info' },
  { type: 3, periodKey: 'monthly', color: 'primary' },
];

const historyPageSize = 10;

const ProblemsRatingHistoryPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [pagesByType, setPagesByType] = useState<Record<ProblemsRatingHistoryType, number>>({
    1: 1,
    2: 1,
    3: 1,
  });

  const dailyPage = pagesByType[1];
  const weeklyPage = pagesByType[2];
  const monthlyPage = pagesByType[3];

  const dailyParams = useMemo(
    () => ({ type: 1, page: dailyPage, pageSize: historyPageSize }),
    [dailyPage],
  );
  const weeklyParams = useMemo(
    () => ({ type: 2, page: weeklyPage, pageSize: historyPageSize }),
    [weeklyPage],
  );
  const monthlyParams = useMemo(
    () => ({ type: 3, page: monthlyPage, pageSize: historyPageSize }),
    [monthlyPage],
  );

  const dailyHistory = useProblemsRatingHistory(dailyParams);
  const weeklyHistory = useProblemsRatingHistory(weeklyParams);
  const monthlyHistory = useProblemsRatingHistory(monthlyParams);

  const dailyBestParams = useMemo(
    () => ({ type: 1, ordering: '-result', page: 1, pageSize: 1 }),
    [],
  );
  const weeklyBestParams = useMemo(
    () => ({ type: 2, ordering: '-result', page: 1, pageSize: 1 }),
    [],
  );
  const monthlyBestParams = useMemo(
    () => ({ type: 3, ordering: '-result', page: 1, pageSize: 1 }),
    [],
  );

  const dailyBest = useProblemsRatingHistory(dailyBestParams);
  const weeklyBest = useProblemsRatingHistory(weeklyBestParams);
  const monthlyBest = useProblemsRatingHistory(monthlyBestParams);

  const isLoading =
    dailyHistory.isLoading ||
    weeklyHistory.isLoading ||
    monthlyHistory.isLoading ||
    dailyHistory.isValidating ||
    weeklyHistory.isValidating ||
    monthlyHistory.isValidating ||
    dailyBest.isLoading ||
    weeklyBest.isLoading ||
    monthlyBest.isLoading ||
    dailyBest.isValidating ||
    weeklyBest.isValidating ||
    monthlyBest.isValidating;

  const cards = [
    {
      config: ratingHistoryConfigs[0],
      history: dailyHistory,
      best: dailyBest,
      page: pagesByType[1],
    },
    {
      config: ratingHistoryConfigs[1],
      history: weeklyHistory,
      best: weeklyBest,
      page: pagesByType[2],
    },
    {
      config: ratingHistoryConfigs[2],
      history: monthlyHistory,
      best: monthlyBest,
      page: pagesByType[3],
    },
  ];

  const handlePageChange = (type: ProblemsRatingHistoryType, page: number) => {
    setPagesByType((prev) => ({ ...prev, [type]: page }));
  };

  return (
    <Stack direction="column" spacing={0}>
      <PageHeader
        title={t('problems.ratingHistory.title')}
        breadcrumb={[
          { label: t('problems.title'), url: resources.Problems },
          { label: t('problems.rating.title'), url: resources.ProblemsRating },
          { label: t('problems.ratingHistory.breadcrumb'), active: true },
        ]}
        actionComponent={
          <Button
            component={RouterLink}
            to={resources.ProblemsRating}
            variant="text"
            startIcon={<IconifyIcon icon="mdi:arrow-left" width={18} height={18} />}
          >
            {t('problems.ratingHistory.backToRating')}
          </Button>
        }
      />

      {isLoading ? <LinearProgress /> : null}

      <Stack direction="column" spacing={2} sx={responsivePagePaddingSx}>
        <Grid container spacing={2}>
          {cards.map(({ config, history, best, page }) => (
            <Grid key={config.type} size={{ xs: 12, lg: 4 }}>
              <RatingHistoryCard
                periodLabel={t(`problems.ratingHistory.period.${config.periodKey}`)}
                color={config.color}
                bestResult={best.data?.data?.[0]}
                isBestLoading={best.isLoading || best.isValidating}
                rows={history.data?.data ?? []}
                pagesCount={history.data?.pagesCount ?? 0}
                page={page}
                onPageChange={(value) => handlePageChange(config.type, value)}
                currentUsername={currentUser?.username}
                isHistoryLoading={history.isLoading || history.isValidating}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

interface RatingHistoryCardProps {
  periodLabel: string;
  color: RatingHistoryColor;
  bestResult?: ProblemsRatingHistoryEntry;
  isBestLoading?: boolean;
  rows: ProblemsRatingHistoryEntry[];
  pagesCount: number;
  page: number;
  onPageChange: (page: number) => void;
  currentUsername?: string;
  isHistoryLoading?: boolean;
}

const RatingHistoryCard = ({
  periodLabel,
  color,
  bestResult,
  isBestLoading,
  rows,
  pagesCount,
  page,
  onPageChange,
  currentUsername,
  isHistoryLoading,
}: RatingHistoryCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const highlightColor = alpha(theme.palette[color].main, isDark ? 0.2 : 0.08);
  const borderColor = alpha(theme.palette[color].main, isDark ? 0.5 : 1);
  const cardBackground = `linear-gradient(135deg, ${alpha(
    theme.palette[color].main,
    isDark ? 0.15 : 0.08,
  )}, ${alpha(theme.palette.background.paper, isDark ? 0.45 : 0.15)})`;
  const headerBackground = alpha(theme.palette[color].main, isDark ? 0.14 : 0.02);

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor,
        background: cardBackground,
        height: '100%',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                backgroundColor: alpha(theme.palette[color].main, isDark ? 0.28 : 0.15),
              }}
            >
              <KepIcon name="ranking" fontSize={18} color={`var(--mui-palette-${color}-main)`} />
            </Box>
            <Typography variant="h6" fontWeight={800}>
              {periodLabel}
            </Typography>
          </Stack>

          <Typography variant="caption" fontWeight={700} color={`var(--mui-palette-${color}-main)`}>
            {t('problems.ratingHistory.bestResult')}
          </Typography>
        </Stack>

        <BestResultCard
          color={color}
          result={bestResult}
          isLoading={Boolean(isBestLoading)}
          highlightColor={highlightColor}
        />

        <Divider sx={{ borderColor: alpha(theme.palette[color].main, 0.2) }} />

        <HistoryTable
          color={color}
          rows={rows}
          isLoading={Boolean(isHistoryLoading)}
          currentUsername={currentUsername}
          highlightColor={highlightColor}
          headerBackground={headerBackground}
        />

        {pagesCount > 1 ? (
          <Pagination
            page={page}
            count={pagesCount}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            shape="rounded"
            size="small"
            sx={{
              alignSelf: 'center',
              mt: 0.5,
              '& .MuiPaginationItem-root': {
                color: `var(--mui-palette-${color}-main)`,
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: alpha(theme.palette[color].main, 0.16),
                borderColor: alpha(theme.palette[color].main, 0.35),
              },
            }}
          />
        ) : null}
      </CardContent>
    </Card>
  );
};

const BestResultCard = ({
  color,
  result,
  isLoading,
  highlightColor,
}: {
  color: RatingHistoryColor;
  result?: ProblemsRatingHistoryEntry;
  isLoading: boolean;
  highlightColor: string;
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Stack direction="column" spacing={1}>
        <Skeleton variant="rounded" height={18} width="60%" />
        <Skeleton variant="rounded" height={18} width="40%" />
      </Stack>
    );
  }

  if (!result) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('problems.ratingHistory.empty')}
      </Typography>
    );
  }

  return (
    <Stack
      direction="column"
      spacing={0.75}
      sx={{
        p: 1.25,
        borderRadius: 1.5,
        backgroundColor: highlightColor,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        {result.contestsRatingTitle ? (
          <ContestsRatingChip title={result.contestsRatingTitle} imgSize={26} />
        ) : null}
        <UserPopover username={result.username}>
          <Typography variant="subtitle2" fontWeight={700} color="text.primary" noWrap>
            {result.username}
          </Typography>
        </UserPopover>
        <Chip
          size="small"
          color={color}
          label={t('problems.rating.periodSolved', { value: result.result ?? 0 })}
        />
      </Stack>

      <Typography variant="caption" color="text.secondary">
        {dayjs(result.date).format('MMM D, YYYY')}
      </Typography>
    </Stack>
  );
};

const HistoryTable = ({
  color,
  rows,
  isLoading,
  currentUsername,
  highlightColor,
}: {
  color: RatingHistoryColor;
  rows: ProblemsRatingHistoryEntry[];
  isLoading: boolean;
  currentUsername?: string;
  highlightColor: string;
  headerBackground: string;
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 320 }}>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton variant="rounded" height={18} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rounded" height={18} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="rounded" height={18} width={40} sx={{ ml: 'auto' }} />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {!isLoading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {t('problems.ratingHistory.empty')}
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading
            ? rows.map((row) => {
                const isCurrentUser = currentUsername && row.username === currentUsername;
                return (
                  <TableRow
                    key={`${row.username}-${row.date}-${row.type}`}
                    sx={{
                      backgroundColor: isCurrentUser ? highlightColor : 'transparent',
                      '&:last-of-type td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell align="center">
                      <Chip
                        size="small"
                        variant="outlined"
                        color={color}
                        label={dayjs(row.date).format('DD/MM/YYYY')}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {row.contestsRatingTitle ? (
                          <ContestsRatingChip title={row.contestsRatingTitle} imgSize={22} />
                        ) : null}
                        <UserPopover username={row.username}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {row.username}
                          </Typography>
                        </UserPopover>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        color={color}
                        label={row.result ?? t('problems.rating.emptyValue')}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ProblemsRatingHistoryPage;
