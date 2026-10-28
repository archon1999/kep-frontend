import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { HistoryView } from 'modules/kepcoin/domain/entities/history.types';
import {
  KepcoinEarnHistoryItem,
  KepcoinEarnType,
  KepcoinSpendHistoryItem,
  KepcoinSpendType,
} from 'modules/kepcoin/domain/entities/kepcoin.entity';
import EmptyState from 'shared/components/common/EmptyState';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { formatDateTime } from 'shared/lib/dateTime';
import { createSafeHtml } from 'shared/lib/safeHtml';

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
  [KepcoinEarnType.Giveaway]: 'giveaways.pageTitle',
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

    if (possible.blog && typeof possible.blog.title === 'string') {
      return possible.blog.title;
    }

    if (possible.test && typeof possible.test.title === 'string') {
      return possible.test.title;
    }

    if (typeof possible.problem_title === 'string') {
      return possible.problem_title;
    }

    if (typeof possible.order_title === 'string') {
      return possible.order_title;
    }

    if (typeof possible.title === 'string') {
      return possible.title;
    }
  }

  return null;
};

const getHistoryMarkup = (
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
    return `${base} <span style="opacity:0.55">&middot;</span> ${detail}`;
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
    <Box component="section">
      <Box>
        <SectionHeader title={t('kepcoinPage.history.title')} />
        <ResponsiveTabs
          value={view}
          tabsProps={{
            sx: { px: 'var(--kep-content-inset)', borderBottom: 1, borderColor: 'divider' },
          }}
          onChange={(value) => onViewChange(null, value)}
          ariaLabel={t('kepcoinPage.history.title')}
          items={(['earns', 'spends'] as const).map((value) => ({
            value,
            label: t('kepcoinPage.history.tabs.' + value),
          }))}
        />
        {isLoading ? (
          <Stack direction="column" gap={1}>
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} variant="rectangular" height={88} />
            ))}
          </Stack>
        ) : error ? (
          <Alert
            severity="error"
            action={<Button onClick={onRetry}>{t('kepcoinPage.history.retry')}</Button>}
          >
            {t('kepcoinPage.history.error')}
          </Alert>
        ) : !historyItems.length ? (
          <EmptyState
            compact
            title={t('kepcoinPage.history.emptyTitle')}
            description={t('kepcoinPage.history.emptySubtitle')}
          />
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {historyItems.map((item) => (
              <Stack
                component="li"
                key={item.id}
                direction="row"
                gap={2}
                sx={{
                  py: 2,
                  px: 'var(--kep-content-inset)',
                  borderBottom: 1,
                  borderColor: 'divider',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Stack gap={0.75} sx={{ minWidth: 0 }}>
                  <Typography
                    component="div"
                    variant="body2"
                    fontWeight={600}
                    sx={{ overflowWrap: 'anywhere' }}
                    dangerouslySetInnerHTML={createSafeHtml(getHistoryMarkup(view, item, t))}
                  />
                  {item.note && (
                    <Typography
                      component="div"
                      variant="body2"
                      color="text.secondary"
                      dangerouslySetInnerHTML={createSafeHtml(
                        t('kepcoinPage.history.notePrefix') + ': ' + item.note,
                      )}
                    />
                  )}
                  {item.happenedAt && (
                    <Typography component="time" variant="caption" color="text.secondary">
                      {formatDateTime(item.happenedAt, 'compactDateTimeNoComma')}
                    </Typography>
                  )}
                </Stack>
                <Box sx={{ flexShrink: 0 }}>
                  <KepcoinValue
                    label={(view === 'earns' ? '+' : '-') + item.amount}
                    iconSize={22}
                    textVariant="metric"
                    sx={{ whiteSpace: 'nowrap' }}
                    color={view === 'earns' ? 'success.main' : 'warning.main'}
                  />
                </Box>
              </Stack>
            ))}
          </Box>
        )}
        <ListPagination
          count={pagesCount}
          page={page}
          onChange={(next) => onPageChange(null, next)}
        />
      </Box>
    </Box>
  );
};

export default KepcoinActivityWidget;
