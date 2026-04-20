import { useTranslation } from 'react-i18next';
import {
  LoadingButton,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { TFunction } from 'i18next';
import type {
  HomeUserActivityHistory,
  HomeUserActivityHistoryItem,
} from 'modules/home/domain/entities/home.entity.ts';
import KepIcon from 'shared/components/base/KepIcon';
import type { KepIconName } from 'shared/config/icons';

const SKELETON_ITEMS = 3;

interface HomeActivityHistoryProps {
  username?: string | null;
  history?: HomeUserActivityHistory | null;
  isLoading?: boolean;
  maxHeight?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

type ActivityType = HomeUserActivityHistoryItem['activityType'];

type ActivityText = {
  primary?: string;
  secondary?: string;
};

const ACTIVITY_ICON_MAP: Record<ActivityType, KepIconName> = {
  problem_attempt_summary: 'problem',
  challenge_summary: 'challenge',
  project_attempt_summary: 'project',
  test_pass_summary: 'test',
  contest_participation: 'contest',
  arena_participation: 'arena',
  daily_activity: 'todo',
  hard_problem_solved: 'problem',
  achievement_unlocked: 'todo',
  daily_task_completed: 'todo',
};

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const parseString = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return undefined;
};

const withFallback = (value?: string): string => value ?? '—';

const formatDelta = (value?: number): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (value > 0) {
    return `+${value}`;
  }
  return value.toString();
};

const compact = (values: Array<string | undefined>): string | undefined => {
  const filtered = values.filter((value): value is string => Boolean(value));
  return filtered.length ? filtered.join(' · ') : undefined;
};

const getActivityTexts = (
  activity: HomeUserActivityHistoryItem,
  t: TFunction<'translation'>,
): ActivityText => {
  const payload = (activity.payload ?? {}) as Record<string, unknown>;

  switch (activity.activityType) {
    case 'problem_attempt_summary':
      return {
        primary: t('homePage.activityHistory.types.problemAttemptSummary.description', {
          accepted: parseNumber(payload.accepted) ?? 0,
          total: parseNumber(payload.total) ?? 0,
        }),
      };
    case 'challenge_summary': {
      const wins = parseNumber(payload.wins);
      const draws = parseNumber(payload.draws);
      const losses = parseNumber(payload.losses);
      return {
        primary: t('homePage.activityHistory.types.challengeSummary.description'),
        secondary: compact([
          wins !== undefined
            ? t('homePage.activityHistory.types.challengeSummary.wins', { value: wins })
            : undefined,
          draws !== undefined
            ? t('homePage.activityHistory.types.challengeSummary.draws', { value: draws })
            : undefined,
          losses !== undefined
            ? t('homePage.activityHistory.types.challengeSummary.losses', { value: losses })
            : undefined,
        ]),
      };
    }
    case 'project_attempt_summary':
      return {
        primary: t('homePage.activityHistory.types.projectAttemptSummary.description', {
          checked: parseNumber(payload.checked) ?? 0,
          total: parseNumber(payload.total) ?? 0,
        }),
      };
    case 'test_pass_summary':
      return {
        primary: t('homePage.activityHistory.types.testPassSummary.description', {
          completed: parseNumber(payload.completed) ?? 0,
          total: parseNumber(payload.total) ?? 0,
          solved: parseNumber(payload.solved) ?? 0,
        }),
      };
    case 'contest_participation': {
      const title = parseString(payload.contestTitle);
      const rank = parseNumber(payload.rank);
      const delta = parseNumber(payload.delta);
      const ratingBefore = parseNumber(payload.ratingBefore);
      const ratingAfter = parseNumber(payload.ratingAfter);
      const bonus = parseNumber(payload.bonus);
      return {
        primary: t('homePage.activityHistory.types.contestParticipation.description', {
          title: withFallback(title),
        }),
        secondary: compact([
          t('homePage.activityHistory.types.contestParticipation.rank', {
            rank: rank ?? t('homePage.activityHistory.types.contestParticipation.noRank'),
          }),
          delta !== undefined
            ? t('homePage.activityHistory.types.contestParticipation.ratingChange', {
                delta: formatDelta(delta),
              })
            : undefined,
          ratingBefore !== undefined && ratingAfter !== undefined
            ? t('homePage.activityHistory.types.contestParticipation.rating', {
                before: ratingBefore,
                after: ratingAfter,
              })
            : undefined,
          bonus !== undefined
            ? t('homePage.activityHistory.types.contestParticipation.bonus', { bonus })
            : undefined,
        ]),
      };
    }
    case 'arena_participation': {
      const title = parseString(payload.title);
      const points = parseNumber(payload.points);
      const rank = parseNumber(payload.rank);
      const finishTime = parseString(payload.finishTime)
        ? dayjs(payload.finishTime as string).format('MMM DD, YYYY HH:mm')
        : undefined;
      return {
        primary: t('homePage.activityHistory.types.arenaParticipation.description', {
          title: withFallback(title),
        }),
        secondary: compact([
          points !== undefined
            ? t('homePage.activityHistory.types.arenaParticipation.points', { points })
            : undefined,
          rank !== undefined
            ? t('homePage.activityHistory.types.arenaParticipation.rank', { rank })
            : undefined,
          finishTime
            ? t('homePage.activityHistory.types.arenaParticipation.finishTime', {
                time: finishTime,
              })
            : undefined,
        ]),
      };
    }
    case 'daily_activity': {
      const note = parseString(payload.note);
      return {
        primary: t('homePage.activityHistory.types.dailyActivity.description', {
          value: parseNumber(payload.value) ?? 0,
        }),
        secondary: note
          ? t('homePage.activityHistory.types.dailyActivity.note', { note })
          : undefined,
      };
    }
    case 'hard_problem_solved':
      return {
        primary: t('homePage.activityHistory.types.hardProblemSolved.description', {
          title: withFallback(parseString(payload.title)),
          difficulty: withFallback(parseString(payload.difficulty)),
        }),
        secondary:
          parseNumber(payload.problemId) !== undefined
            ? t('homePage.activityHistory.types.hardProblemSolved.problem', {
                id: parseNumber(payload.problemId),
              })
            : undefined,
      };
    case 'achievement_unlocked':
      return {
        primary: t('homePage.activityHistory.types.achievementUnlocked.description', {
          message: withFallback(parseString(payload.message)),
        }),
      };
    case 'daily_task_completed': {
      const taskDescription = parseString(payload.description);
      return {
        primary: t('homePage.activityHistory.types.dailyTaskCompleted.description', {
          type: withFallback(parseString(payload.taskType)),
        }),
        secondary: taskDescription
          ? t('homePage.activityHistory.types.dailyTaskCompleted.task', {
              description: taskDescription,
            })
          : undefined,
      };
    }
    default:
      return {};
  }
};

const HomeActivityHistory = ({
  username: _username,
  history,
  isLoading,
  maxHeight = 350,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: HomeActivityHistoryProps) => {
  const { t } = useTranslation();
  const activities = history?.data ?? [];
  const showEmpty = !isLoading && activities.length === 0;

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6" fontWeight={600}>
        {t('homePage.activityHistory.title')}
      </Typography>

      <Box
        sx={{
          maxHeight: maxHeight,
          overflowY: 'auto',
        }}
      >
        {isLoading ? (
          <Timeline
            position="right"
            sx={{
              p: 0,
              m: 0,
            }}
          >
            {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent sx={{ m: 0, minWidth: 90, textAlign: 'right' }}>
                  <Skeleton variant="text" width={56} />
                  <Skeleton variant="text" width={48} />
                </TimelineOppositeContent>

                <TimelineSeparator>
                  {index !== 0 && (
                    <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.3 }} />
                  )}
                  <TimelineDot
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderWidth: 2,
                      backgroundColor: 'background.default',
                    }}
                  />
                  {index !== SKELETON_ITEMS - 1 && (
                    <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.3 }} />
                  )}
                </TimelineSeparator>

                <TimelineContent sx={{ py: 1, pl: 3 }}>
                  <Skeleton variant="rounded" height={80} />
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : showEmpty ? (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.activityHistory.empty')}
          </Typography>
        ) : (
          <Timeline
            position="alternate"
            sx={{
              p: 0,
              m: 0,
            }}
          >
            {activities.map((activity, index) => {
              const texts = getActivityTexts(activity, t);
              const icon = ACTIVITY_ICON_MAP[activity.activityType];
              const recordedAt = dayjs(activity.recordedFor);
              const label =
                activity.activityTypeDisplay ||
                activity.user?.username ||
                t('homePage.activityHistory.defaultLabel');

              const isFirst = index === 0;
              const isLast = index === activities.length - 1;

              return (
                <TimelineItem
                  key={activity.id ?? `${activity.activityType}-${activity.recordedFor}`}
                >
                  <TimelineOppositeContent>
                    <Typography variant="h6" fontWeight={600}>
                      {recordedAt.format('HH:mm')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {recordedAt.format('dddd')}
                    </Typography>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    {!isFirst && (
                      <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.4 }} />
                    )}
                    <TimelineDot
                      variant="outlined"
                      color="primary"
                      sx={{
                        borderWidth: 2,
                        backgroundColor: 'background.default',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <KepIcon name={icon} fontSize={18} color="primary.main" />
                    </TimelineDot>
                    {!isLast && (
                      <TimelineConnector sx={{ bgcolor: 'primary.main', opacity: 0.4 }} />
                    )}
                  </TimelineSeparator>

                  <TimelineContent>
                    <Paper
                      sx={{
                        p: 2,
                      }}
                    >
                      <Stack direction="column" spacing={0.75}>
                        <Typography variant="caption" color="text.secondary">
                          {recordedAt.format('MMM DD, YYYY')}
                        </Typography>

                        <Typography variant="subtitle2" fontWeight={600}>
                          {label}
                        </Typography>

                        {texts.primary ? (
                          <Typography variant="body2">{texts.primary}</Typography>
                        ) : null}

                        {texts.secondary ? (
                          <Typography variant="body2" color="text.secondary">
                            {texts.secondary}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        )}
      </Box>

      {!isLoading && activities.length > 0 && hasMore ? (
        <Box display="flex" justifyContent="center">
          <LoadingButton variant="outlined" size="small" loading={isLoadingMore} onClick={onLoadMore}>
            {t('homePage.activityHistory.loadMore')}
          </LoadingButton>
        </Box>
      ) : null}
    </Stack>
  );
};

export default HomeActivityHistory;
