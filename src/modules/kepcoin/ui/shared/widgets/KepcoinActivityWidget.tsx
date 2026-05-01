import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Pagination,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import dayjs from 'dayjs';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import {
  KepcoinEarnHistoryItem,
  KepcoinEarnType,
  KepcoinSpendHistoryItem,
  KepcoinSpendType,
} from 'modules/kepcoin/domain/entities/kepcoin.entity';
import { HistoryView } from 'modules/kepcoin/ui/types';

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
    <Card
      sx={{
        borderRadius: 5,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        boxShadow: '0 24px 50px rgba(18, 28, 45, 0.08)',
      }}
    >
      <CardContent sx={responsivePagePaddingSx}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
            <Typography variant="h4" fontWeight={800}>
              {t('kepcoinPage.history.title')}
            </Typography>

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={onViewChange}
              size="small"
              sx={{
                alignSelf: { xs: 'flex-start', sm: 'center' },
                '& .MuiToggleButton-root': {
                  px: 1.75,
                  borderRadius: 999,
                  border: 0,
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 700,
                },
                '& .Mui-selected': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                },
              }}
            >
              <ToggleButton value="earns">{t('kepcoinPage.history.tabs.earns')}</ToggleButton>
              <ToggleButton value="spends">{t('kepcoinPage.history.tabs.spends')}</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {isLoading ? (
            <Stack spacing={2}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Stack key={index} direction="row" spacing={2} alignItems="stretch">
                  <Stack alignItems="center" sx={{ minWidth: 18 }}>
                    <Skeleton variant="circular" width={12} height={12} />
                    <Skeleton variant="rounded" width={2} height={92} />
                  </Stack>
                  <Skeleton variant="rounded" width="100%" height={112} sx={{ borderRadius: 4 }} />
                </Stack>
              ))}
            </Stack>
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
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                textAlign: 'center',
                borderRadius: 4,
                border: (theme) => `1px dashed ${alpha(theme.palette.primary.main, 0.16)}`,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                {t('kepcoinPage.history.emptyTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {t('kepcoinPage.history.emptySubtitle')}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {historyItems.map((item, index) => {
                const isEarn = view === 'earns';
                const happenedAt = item.happenedAt
                  ? dayjs(item.happenedAt).format('DD MMM YYYY, HH:mm')
                  : null;

                return (
                  <Stack key={item.id} direction="row" spacing={2} alignItems="stretch">
                    <Stack alignItems="center" sx={{ minWidth: 18 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          mt: 2.25,
                          bgcolor: isEarn ? 'success.main' : 'warning.main',
                          boxShadow: (theme) =>
                            `0 0 0 6px ${alpha(
                              isEarn ? theme.palette.success.main : theme.palette.warning.main,
                              0.14,
                            )}`,
                        }}
                      />
                      {index < historyItems.length - 1 && (
                        <Box
                          sx={{
                            mt: 1,
                            width: 2,
                            flex: 1,
                            borderRadius: 99,
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          }}
                        />
                      )}
                    </Stack>

                    <Box
                      sx={{
                        flex: 1,
                        p: 2.5,
                        borderRadius: 4,
                        border: (theme) =>
                          `1px solid ${alpha(
                            isEarn ? theme.palette.success.main : theme.palette.warning.main,
                            0.16,
                          )}`,
                        bgcolor: (theme) =>
                          alpha(
                            isEarn ? theme.palette.success.main : theme.palette.warning.main,
                            0.05,
                          ),
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        gap={2}
                      >
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <KepcoinValue
                              label={`${isEarn ? '+' : '-'}${item.amount}`}
                              iconSize={24}
                              textVariant="h6"
                              fontWeight={800}
                              color={isEarn ? 'success.main' : 'warning.dark'}
                            />
                            {happenedAt ? (
                              <Chip
                                size="small"
                                label={happenedAt}
                                sx={{
                                  borderRadius: 999,
                                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.04),
                                  color: 'text.secondary',
                                }}
                              />
                            ) : null}
                          </Stack>

                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            component="div"
                            dangerouslySetInnerHTML={{
                              __html: getHistoryMarkup(view, item, t),
                            }}
                          />

                          {item.note ? (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="div"
                              dangerouslySetInnerHTML={{
                                __html: `${t('kepcoinPage.history.notePrefix')}: ${item.note}`,
                              }}
                            />
                          ) : null}
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            alignSelf: { xs: 'flex-start', sm: 'center' },
                            px: 1.25,
                            py: 0.75,
                            borderRadius: 999,
                            bgcolor: (theme) =>
                              alpha(
                                isEarn ? theme.palette.success.main : theme.palette.warning.main,
                                0.12,
                              ),
                          }}
                        >
                          <IconifyIcon
                            icon={
                              isEarn
                                ? 'solar:arrow-down-line-duotone'
                                : 'solar:arrow-up-line-duotone'
                            }
                            fontSize={18}
                            color={isEarn ? '#1f8f5f' : '#b45309'}
                          />
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            color={isEarn ? 'success.main' : 'warning.dark'}
                          >
                            {isEarn
                              ? t('kepcoinPage.history.tabs.earns')
                              : t('kepcoinPage.history.tabs.spends')}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          )}

          {pagesCount > 1 && (
            <Box display="flex" justifyContent="center">
              <Pagination count={pagesCount} page={page} onChange={onPageChange} color="primary" />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default KepcoinActivityWidget;
