import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Palette } from '@mui/material/styles';
import { resources } from 'app/routes/resources';
import { useProblemsRatingHistoryPage } from 'modules/problems/application/hooks/useProblemsRatingHistoryPage';
import {
  ProblemsRatingHistoryEntry,
  ProblemsRatingHistoryType,
} from 'modules/problems/domain/entities/problem.entity';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import KepIcon from 'shared/components/base/KepIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import { formatDateTime, formatMachineDateTime } from 'shared/lib/dateTime';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';

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

const ProblemsRatingHistoryPage = () => {
  const {
    currentUser,
    state,
    dailyHistory,
    weeklyHistory,
    monthlyHistory,
    dailyBest,
    weeklyBest,
    monthlyBest,
    isLoading,
    handlePageChange,
  } = useProblemsRatingHistoryPage();

  const { t } = useTranslation();

  const cards = [
    {
      config: ratingHistoryConfigs[0],
      history: dailyHistory,
      best: dailyBest,
      page: state.dailyPage,
    },
    {
      config: ratingHistoryConfigs[1],
      history: weeklyHistory,
      best: weeklyBest,
      page: state.weeklyPage,
    },
    {
      config: ratingHistoryConfigs[2],
      history: monthlyHistory,
      best: monthlyBest,
      page: state.monthlyPage,
    },
  ];

  return (
    <FramedPage>
      <PageHeader title={t('problems.ratingHistory.title')} backTo={resources.ProblemsRating} />

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
    </FramedPage>
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
  const highlightColor = cssVarRgba(theme.vars.palette[color].mainChannel, 0.08);

  return (
    <Card
      variant="section"
      sx={{
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
                backgroundColor: cssVarRgba(theme.vars.palette[color].mainChannel, 0.12),
              }}
            >
              <KepIcon name="ranking" fontSize={18} color={`${color}.main`} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              {periodLabel}
            </Typography>
          </Stack>

          <Typography variant="caption" fontWeight={700} color={`${color}.main`}>
            {t('problems.ratingHistory.bestResult')}
          </Typography>
        </Stack>

        <BestResultCard
          color={color}
          result={bestResult}
          isLoading={Boolean(isBestLoading)}
          highlightColor={highlightColor}
        />

        <Divider />

        <HistoryTable
          color={color}
          rows={rows}
          isLoading={Boolean(isHistoryLoading)}
          currentUsername={currentUsername}
          highlightColor={highlightColor}
        />

        {pagesCount > 1 ? (
          <ListPagination
            page={page}
            count={pagesCount}
            onChange={(value) => onPageChange(value)}
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
        borderRadius: 0,
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
        {formatDateTime(result.date, 'monthDayYear')}
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
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table
        size="small"
        sx={{
          tableLayout: 'fixed',
          width: '100%',
          '& td': { px: 0.75, py: 1.25 },
          '& td:first-of-type': { width: 92, pl: 0 },
          '& td:last-of-type': { width: 44, pr: 0 },
        }}
      >
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
                      <Typography
                        variant="caption"
                        sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
                      >
                        {formatMachineDateTime(row.date, 'slashDate')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                        {row.contestsRatingTitle ? (
                          <ContestsRatingChip title={row.contestsRatingTitle} imgSize={22} />
                        ) : null}
                        <UserPopover username={row.username} sx={{ flex: 1, overflow: 'hidden' }}>
                          <Typography variant="body2" fontWeight={600} noWrap title={row.username}>
                            {row.username}
                          </Typography>
                        </UserPopover>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="metric"
                        color={`${color}.main`}
                        sx={{ fontSize: '1rem' }}
                      >
                        {row.result ?? t('problems.rating.emptyValue')}
                      </Typography>
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
