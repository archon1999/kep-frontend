import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Pagination,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import {
  KepcoinEarnHistoryItem,
  KepcoinEarnType,
  KepcoinSpendHistoryItem,
  KepcoinSpendType,
} from '../../domain/entities/kepcoin.entity';
import { HistoryView } from '../types';

type HistoryItem = KepcoinEarnHistoryItem | KepcoinSpendHistoryItem;

const earnTypeKeyMap: Record<KepcoinEarnType, string> = {
  [KepcoinEarnType.WroteBlog]: 'kepcoinPage.earnTypes.wroteBlog',
  [KepcoinEarnType.WroteProblemSolution]: 'kepcoinPage.earnTypes.wroteProblemSolution',
  [KepcoinEarnType.LoyaltyBonus]: 'kepcoinPage.earnTypes.loyaltyBonus',
  [KepcoinEarnType.BonusFromAdmin]: 'kepcoinPage.earnTypes.bonusFromAdmin',
  [KepcoinEarnType.DailyActivity]: 'kepcoinPage.earnTypes.dailyActivity',
  [KepcoinEarnType.DailyTaskCompletion]: 'kepcoinPage.earnTypes.dailyTaskCompletion',
  [KepcoinEarnType.DailyProblemsRatingWin]: 'kepcoinPage.earnTypes.dailyRatingWinner',
  [KepcoinEarnType.WeeklyProblemsRatingWin]: 'kepcoinPage.earnTypes.weeklyRatingWinner',
  [KepcoinEarnType.MonthlyProblemsRatingWin]: 'kepcoinPage.earnTypes.monthlyRatingWinner',
  [KepcoinEarnType.ContestParticipated]: 'kepcoinPage.earnTypes.contestParticipant',
  [KepcoinEarnType.ArenaParticipated]: 'kepcoinPage.earnTypes.arenaParticipant',
  [KepcoinEarnType.TournamentParticipated]: 'kepcoinPage.earnTypes.tournamentParticipant',
  [KepcoinEarnType.ProjectTaskComplete]: 'kepcoinPage.earnTypes.projectTask',
  [KepcoinEarnType.NewYear2026Login]: 'kepcoinPage.earnTypes.newYear2026Login',
  [KepcoinEarnType.MerchRefund]: 'kepcoinPage.earnTypes.merchRefund',
  [KepcoinEarnType.OneTimeTaskCompletion]: 'kepcoinPage.earnTypes.oneTimeTaskCompletion',
};

const spendTypeKeyMap: Record<KepcoinSpendType, string> = {
  [KepcoinSpendType.AttemptView]: 'kepcoinPage.spendTypes.attemptView',
  [KepcoinSpendType.AttemptTestView]: 'kepcoinPage.spendTypes.attemptTestView',
  [KepcoinSpendType.ProblemSolution]: 'kepcoinPage.spendTypes.problemSolution',
  [KepcoinSpendType.DoubleRating]: 'kepcoinPage.spendTypes.doubleRating',
  [KepcoinSpendType.CoverPhotoChange]: 'kepcoinPage.spendTypes.coverPhoto',
  [KepcoinSpendType.Course]: 'kepcoinPage.spendTypes.course',
  [KepcoinSpendType.StudyPlan]: 'kepcoinPage.spendTypes.studyPlan',
  [KepcoinSpendType.CodeEditorTesting]: 'kepcoinPage.spendTypes.codeEditorTesting',
  [KepcoinSpendType.SaveRating]: 'kepcoinPage.spendTypes.saveRating',
  [KepcoinSpendType.TestPass]: 'kepcoinPage.spendTypes.testPass',
  [KepcoinSpendType.UserContestCreate]: 'kepcoinPage.spendTypes.userContestCreate',
  [KepcoinSpendType.Project]: 'kepcoinPage.spendTypes.project',
  [KepcoinSpendType.StreakFreeze]: 'kepcoinPage.spendTypes.streakFreeze',
  [KepcoinSpendType.VirtualContest]: 'kepcoinPage.spendTypes.virtualContest',
  [KepcoinSpendType.UnratedContest]: 'kepcoinPage.spendTypes.unratedContest',
  [KepcoinSpendType.AnswerForInput]: 'kepcoinPage.spendTypes.answerForInput',
  [KepcoinSpendType.CheckSamples]: 'kepcoinPage.spendTypes.checkSamples',
  [KepcoinSpendType.Merch]: 'kepcoinPage.spendTypes.merch',
};

const getDetailText = (detail?: unknown): string | null => {
  if (!detail) {
    return null;
  }

  if (typeof detail === 'string') {
    return detail;
  }

  if (typeof detail === 'number') {
    return detail.toString();
  }

  if (typeof detail === 'object') {
    const possible = detail as Record<string, any>;

    if (typeof possible.description === 'string') {
      return possible.description;
    }

    if (typeof possible.date === 'string') {
      return possible.date;
    }

    if (possible.contest && typeof possible.contest.title === 'string') {
      return possible.contest.title;
    }

    if (possible.arena && typeof possible.arena.title === 'string') {
      return possible.arena.title;
    }

    if (possible.tournament && typeof possible.tournament.title === 'string') {
      return possible.tournament.title;
    }

    if (typeof possible.title === 'string') {
      return possible.title;
    }
  }

  return null;
};

const getHistoryDescription = (
  type: HistoryView,
  item: HistoryItem,
  translate: (key: string, params?: Record<string, unknown>) => string,
) => {
  const key =
    type === 'earns'
      ? earnTypeKeyMap[(item as KepcoinEarnHistoryItem).earnType]
      : spendTypeKeyMap[(item as KepcoinSpendHistoryItem).spendType];
  const base = key ? translate(key) : translate('kepcoinPage.history.defaultLabel');
  const detail = getDetailText(item.detail);

  if (detail) {
    return translate('kepcoinPage.history.detail', { base, detail });
  }

  return base;
};

interface KepcoinActivityWidgetProps {
  view: HistoryView;
  onViewChange: (_: unknown, next: HistoryView | null) => void;
  isLoading: boolean;
  error?: unknown;
  historyItems: HistoryItem[];
  pagesCount: number;
  page: number;
  onPageChange: (_: unknown, nextPage: number) => void;
  onRetry: () => void;
}

const KepcoinActivityWidget = ({
  view,
  onViewChange,
  isLoading,
  error,
  historyItems,
  pagesCount,
  page,
  onPageChange,
  onRetry,
}: KepcoinActivityWidgetProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent sx={responsivePagePaddingSx}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <Typography variant="h5" fontWeight={700}>
            {t('kepcoinPage.history.title')}
          </Typography>
          <ToggleButtonGroup value={view} exclusive onChange={onViewChange} size="small">
            <ToggleButton value="earns">{t('kepcoinPage.history.tabs.earns')}</ToggleButton>
            <ToggleButton value="spends">{t('kepcoinPage.history.tabs.spends')}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {isLoading ? (
          <Timeline sx={{ '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 } }}>
            {Array.from({ length: 6 }).map((_, index, arr) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color="primary" variant="outlined" />
                  {index < arr.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="40%" />
                  </Stack>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={onRetry}>
                {t('kepcoinPage.history.retry')}
              </Button>
            }
          >
            {t('kepcoinPage.history.error')}
          </Alert>
        ) : historyItems.length === 0 ? (
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              {t('kepcoinPage.history.emptyTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('kepcoinPage.history.emptySubtitle')}
            </Typography>
          </Stack>
        ) : (
          <Timeline sx={{ '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 } }}>
            {historyItems.map((item, index) => {
              const isEarn = view === 'earns';
              const happenedAt = item.happenedAt ? dayjs(item.happenedAt).format('DD MMM YYYY, HH:mm') : null;

              return (
                <TimelineItem key={item.id}>
                  <TimelineSeparator>
                    <TimelineDot color={isEarn ? 'success' : 'error'} variant="outlined">
                      <IconifyIcon icon="solar:coins-stacks-linear" fontSize={16} />
                    </TimelineDot>
                    {index < historyItems.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Stack direction="row" spacing={0.75}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Typography
                          variant="h6"
                          color={isEarn ? 'success.main' : 'error.main'}
                          fontWeight={700}
                        >
                          {`${isEarn ? '+' : '-'}${item.amount}`}
                        </Typography>
                        {happenedAt && (
                          <Typography variant="caption" color="text.secondary">
                            {happenedAt}
                          </Typography>
                        )}
                      </Stack>
                      <Typography variant="body1" fontWeight={600}>
                        {getHistoryDescription(view, item, t)}
                      </Typography>
                      {item.note && (
                        <Typography variant="body2" color="text.secondary">
                          {t('kepcoinPage.history.note', { value: item.note })}
                        </Typography>
                      )}
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        )}

        {pagesCount > 1 && (
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination count={pagesCount} page={page} onChange={onPageChange} color="primary" />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default KepcoinActivityWidget;
