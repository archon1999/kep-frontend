import { useTranslation } from 'react-i18next';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { TFunction } from 'i18next';
import type {
  HomeUserActivityHistory,
  HomeUserActivityHistoryItem,
} from 'modules/home/domain/entities/home.entity.ts';
import KepIcon from 'shared/components/base/KepIcon';
import type { KepIconName } from 'shared/config/icons';
import { formatDateTime, formatDateTimePattern } from 'shared/lib/dateTime';
import { decodeHtmlEntities } from 'shared/lib/html';
import DashboardFeed from './DashboardFeed';

const SKELETON_ITEMS = 3;

interface HomeActivityHistoryProps {
  username?: string | null;
  history?: HomeUserActivityHistory | null;
  isLoading?: boolean;
  maxHeight?: number | 'none';
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  showTitle?: boolean;
  compact?: boolean;
  visibleItems?: number;
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

const ACTIVITY_LABEL_MAP: Record<ActivityType, string> = {
  problem_attempt_summary: 'problemAttemptSummary',
  challenge_summary: 'challengeSummary',
  project_attempt_summary: 'projectAttemptSummary',
  test_pass_summary: 'testPassSummary',
  contest_participation: 'contestParticipation',
  arena_participation: 'arenaParticipation',
  daily_activity: 'dailyActivity',
  hard_problem_solved: 'hardProblemSolved',
  achievement_unlocked: 'achievementUnlocked',
  daily_task_completed: 'dailyTaskCompleted',
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
    return decodeHtmlEntities(value);
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

const getTranslatedActivityTexts = (
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
      const title = parseString(payload.arenaTitle ?? payload.title);
      const points = parseNumber(payload.points);
      const rank = parseNumber(payload.rank);
      const finishTime = parseString(payload.finishTime)
        ? formatDateTime(payload.finishTime as string, 'activityDateTime')
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
          title: withFallback(parseString(payload.problemTitle ?? payload.title)),
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

const getActivityTexts = (
  activity: HomeUserActivityHistoryItem,
  t: TFunction<'translation'>,
): ActivityText => {
  const texts = getTranslatedActivityTexts(activity, t);
  // These are React text nodes. Decode after interpolation so i18next does not
  // expose escaped apostrophes and comparison signs in activity descriptions.
  return {
    primary: texts.primary ? decodeHtmlEntities(texts.primary) : undefined,
    secondary: texts.secondary ? decodeHtmlEntities(texts.secondary) : undefined,
  };
};

const ActivitySummary = ({
  activity,
  texts,
  t,
}: {
  activity: HomeUserActivityHistoryItem;
  texts: ActivityText;
  t: TFunction<'translation'>;
}) => {
  const payload = activity.payload ?? {};
  if (activity.activityType === 'challenge_summary') {
    return (
      <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mt: 1 }}>
        {(
          [
            { key: 'wins', label: 'W', color: 'success.main' },
            { key: 'losses', label: 'L', color: 'error.main' },
            { key: 'draws', label: 'D', color: 'warning.main' },
          ] as const
        ).map(({ key, label, color }) => {
          const value = parseNumber(payload[key]);
          return value !== undefined ? (
            <Typography
              key={key}
              component="span"
              variant="metric"
              color={color}
              aria-label={t(`homePage.activityHistory.types.challengeSummary.${key}`, { value })}
              sx={{ fontSize: 17 }}
            >
              <Box component="span" sx={{ fontFeatureSettings: 'normal' }}>
                {label}
              </Box>{' '}
              {value}
            </Typography>
          ) : null;
        })}
      </Stack>
    );
  }
  if (
    activity.activityType === 'problem_attempt_summary' ||
    activity.activityType === 'project_attempt_summary'
  ) {
    const done = parseNumber(
      activity.activityType === 'problem_attempt_summary' ? payload.accepted : payload.checked,
    );
    const total = parseNumber(payload.total);
    if (done !== undefined && total !== undefined)
      return (
        <Typography
          variant="metric"
          color="success.main"
          aria-label={texts.primary}
          sx={{ mt: 1, fontSize: 20 }}
        >
          {done}
          <Box component="span" sx={{ color: 'text.secondary', fontSize: 16 }}>
            {' '}
            / {total}
          </Box>
        </Typography>
      );
  }
  if (activity.activityType === 'hard_problem_solved') {
    const title = parseString(payload.problemTitle ?? payload.title);
    const id = parseNumber(payload.problemId);
    return (
      <Typography
        variant="body2"
        sx={{
          mt: 0.75,
          fontFamily: 'var(--kep-display-font)',
          fontWeight: 500,
          color: 'primary.main',
        }}
      >
        {id !== undefined && (
          <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
            #{id}{' '}
          </Box>
        )}
        {title}
      </Typography>
    );
  }
  if (activity.activityType === 'daily_task_completed') {
    const description = parseString(payload.description);
    return description ? (
      <Typography
        variant="body2"
        sx={{ mt: 0.75, fontFamily: 'var(--kep-display-font)', color: 'primary.main' }}
      >
        {description}
      </Typography>
    ) : null;
  }
  const daily = activity.activityType === 'daily_activity';
  return (
    <>
      {(daily ? texts.secondary : texts.primary) && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {daily ? texts.secondary : texts.primary}
        </Typography>
      )}
      {!daily && texts.secondary && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {texts.secondary}
        </Typography>
      )}
    </>
  );
};

const HomeActivityHistory = ({
  username: _username,
  history,
  isLoading,
  maxHeight = 350,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  showTitle = true,
  compact = false,
  visibleItems,
}: HomeActivityHistoryProps) => {
  const { t } = useTranslation();
  const activities = history?.data ?? [];
  const showEmpty = !isLoading && activities.length === 0;
  const days = new Map<string, HomeUserActivityHistoryItem[]>();
  if (compact) {
    for (const activity of activities) {
      const day = formatDateTime(activity.recordedFor, 'profileDate');
      const entries = days.get(day) ?? [];
      entries.push(activity);
      days.set(day, entries);
    }
  }

  return (
    <Stack className="kep-home-history" direction="column" spacing={2}>
      {showTitle ? (
        <Typography variant="h6" fontWeight={600}>
          {t('homePage.activityHistory.title')}
        </Typography>
      ) : null}

      <Box
        component={compact && visibleItems ? DashboardFeed : 'div'}
        {...(compact && visibleItems
          ? { label: t('homePage.activityHistory.title'), visibleItems }
          : {})}
        sx={{
          maxHeight: maxHeight,
          overflowY: 'auto',
        }}
      >
        {compact ? (
          <Stack component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
            {isLoading ? (
              Array.from({ length: visibleItems ?? SKELETON_ITEMS }, (_, index) => (
                <Box
                  component="li"
                  data-feed-item
                  key={index}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '48px minmax(0, 1fr)',
                    gap: 2,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:first-of-type': { pt: 0 },
                  }}
                >
                  <Stack gap={0.5}>
                    <Typography variant="metric" sx={{ fontSize: 26 }}>
                      <Skeleton width={34} height="1.2em" />
                    </Typography>
                    <Typography variant="caption">
                      <Skeleton width={24} height="1.5em" />
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="flex-start"
                    sx={{ pl: 2, borderLeft: 1, borderColor: 'divider' }}
                  >
                    <Skeleton variant="rectangular" width={16} height={16} sx={{ mt: 0.25 }} />
                    <Box flex={1}>
                      <Skeleton width="85%" height={21} />
                    </Box>
                    <Skeleton width={26} height={22} />
                  </Stack>
                </Box>
              ))
            ) : showEmpty ? (
              <Typography component="li" variant="body2" color="text.secondary">
                {t('homePage.activityHistory.empty')}
              </Typography>
            ) : (
              [...days.entries()].map(([day, entries]) => (
                <Box
                  component="li"
                  key={day}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '48px minmax(0, 1fr)',
                    gap: 2,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:first-of-type': { pt: 0 },
                    '&:last-of-type': { borderBottom: 0 },
                  }}
                >
                  <Box
                    component="time"
                    dateTime={entries[0].recordedFor}
                    aria-label={day}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                  >
                    <Typography component="span" variant="metric" sx={{ fontSize: 26 }}>
                      {formatDateTimePattern(entries[0].recordedFor, 'DD')}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', letterSpacing: '.06em' }}
                    >
                      {formatDateTimePattern(entries[0].recordedFor, 'MMM')}
                    </Typography>
                  </Box>
                  <Stack
                    component="ul"
                    sx={{
                      p: 0,
                      pl: 2,
                      m: 0,
                      minWidth: 0,
                      listStyle: 'none',
                      borderLeft: 1,
                      borderColor: 'divider',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -3,
                        top: 7,
                        width: 5,
                        height: 5,
                        bgcolor: 'primary.main',
                      },
                    }}
                  >
                    {entries.map((activity, index) => {
                      const texts = getActivityTexts(activity, t);
                      const daily = activity.activityType === 'daily_activity';
                      const dailyValue = daily ? parseNumber(activity.payload?.value) : undefined;
                      return (
                        <Box
                          component="li"
                          data-feed-item
                          key={activity.id ?? `${activity.activityType}-${activity.recordedFor}`}
                          sx={{
                            minWidth: 0,
                            overflowWrap: 'anywhere',
                            ...(index
                              ? { mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }
                              : {}),
                          }}
                        >
                          <Stack direction="row" alignItems="center" gap={1}>
                            <KepIcon
                              name={ACTIVITY_ICON_MAP[activity.activityType]}
                              fontSize={16}
                              color="primary.main"
                            />
                            <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                              {t(
                                `homePage.activityHistory.types.${ACTIVITY_LABEL_MAP[activity.activityType]}.title`,
                              )}
                            </Typography>
                            {dailyValue !== undefined && (
                              <Typography
                                variant="metric"
                                color="primary.main"
                                sx={{ fontSize: 18 }}
                              >
                                {formatDelta(dailyValue)}
                              </Typography>
                            )}
                          </Stack>
                          <ActivitySummary activity={activity} texts={texts} t={t} />
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        ) : isLoading ? (
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
              const recordedAt = activity.recordedFor;
              const label = decodeHtmlEntities(
                activity.activityTypeDisplay ||
                  activity.user?.username ||
                  t('homePage.activityHistory.defaultLabel'),
              );

              const isFirst = index === 0;
              const isLast = index === activities.length - 1;

              return (
                <TimelineItem
                  key={activity.id ?? `${activity.activityType}-${activity.recordedFor}`}
                >
                  <TimelineOppositeContent>
                    <Typography variant="h6" fontWeight={600}>
                      {formatDateTime(recordedAt, 'time')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(recordedAt, 'weekday')}
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
                          {formatDateTime(recordedAt, 'profileDate')}
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
          <Button variant="outlined" size="small" loading={isLoadingMore} onClick={onLoadMore}>
            {t('homePage.activityHistory.loadMore')}
          </Button>
        </Box>
      ) : null}
    </Stack>
  );
};

export default HomeActivityHistory;
