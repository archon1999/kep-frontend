import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  List,
  Popover,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import { apiClient } from 'shared/api/http/apiClient';
import {
  Notification as ApiNotification,
  NotificationBody,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import DialogHeader from 'shared/components/common/DialogHeader';
import EmptyState from 'shared/components/common/EmptyState';
import KepcoinValue from 'shared/components/common/KepcoinValue.tsx';
import { ListPagination } from 'shared/components/sections/common/FramedListPage';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { KepIconName } from 'shared/config/icons';
import { formatRelativeTime } from 'shared/lib/dateTime';
import { wsService } from 'shared/services/websocket';
import ActivityMenuHeader from './ActivityMenuHeader';

const NOTIFICATIONS_PAGE_SIZE = 5;
type NotificationsResponse =
  | Awaited<ReturnType<typeof apiClient.apiNotificationsList>>
  | Awaited<ReturnType<typeof apiClient.apiNotificationsAllList>>;

const notificationsRequestCache = new Map<string, Promise<NotificationsResponse>>();

const getNotificationsRequestKey = (pageNumber: number, showAll: boolean) =>
  `${showAll ? 'all' : 'unread'}:${pageNumber}:${NOTIFICATIONS_PAGE_SIZE}`;

const loadNotifications = (pageNumber: number, showAll: boolean) => {
  const requestKey = getNotificationsRequestKey(pageNumber, showAll);
  const cachedRequest = notificationsRequestCache.get(requestKey);

  if (cachedRequest) {
    return cachedRequest;
  }

  const params = { page: pageNumber, pageSize: NOTIFICATIONS_PAGE_SIZE };
  const request = (
    showAll ? apiClient.apiNotificationsAllList(params) : apiClient.apiNotificationsList(params)
  ).finally(() => {
    notificationsRequestCache.delete(requestKey);
  });

  notificationsRequestCache.set(requestKey, request);

  return request;
};

interface NotificationContent {
  contestId?: number;
  contestTitle?: string;
  delta?: number;
  earnType?: number;
  kepcoin?: number;
  detail?: {
    blog?: {
      id?: number;
      title?: string;
    };
  };
  blogId?: number;
  blogTitle?: string;
  blog?: {
    id?: number;
    title?: string;
  };
  challengeId?: number;
  text?: string;
  arena?: {
    id?: number;
    title?: string;
  };
  duel?: {
    id?: number;
    title?: string;
  };
  achievementTitle?: string;

  [key: string]: unknown;
}

interface NotificationApiAction {
  kind?: string;
  path?: string;
}

type ApiNotificationWithAction = ApiNotification & {
  action?: NotificationApiAction | null;
};

const notificationActionLabelKeys: Record<string, string> = {
  contest_results: 'notifications.viewContestStandings',
  blog: 'notifications.openBlog',
  challenge: 'notifications.goToChallenge',
  arena_results: 'notifications.viewArenaResults',
  duel: 'notifications.openDuel',
  duels: 'notifications.openDuels',
  achievements: 'notifications.viewAchievements',
};

const typeIconMap: Partial<Record<number, KepIconName>> = {
  1: 'info',
  2: 'rating-changes',
  3: 'rating',
  4: 'challenge',
  5: 'challenge',
  6: 'arena',
  7: 'duel',
  8: 'star',
  9: 'duel',
  10: 'duel',
  11: 'duel',
  12: 'duel',
  13: 'duel',
};

const parseContent = (content?: string): NotificationContent => {
  if (!content) return {};

  if (typeof content === 'string') {
    try {
      return JSON.parse(content) as NotificationContent;
    } catch {
      return { text: content } as NotificationContent;
    }
  }

  return content as NotificationContent;
};

const getNotificationMeta = (notification: ApiNotification): string =>
  notification.createdNaturaltime || formatRelativeTime(notification.created, 'Just now');

interface NotificationView {
  title: string;
  description?: string;
  action?: { label: string; to: string };
  chips?: ReactNode[];
  icon: KepIconName;
}

interface NotificationMenuProps {
  type?: 'default' | 'slim';
}

const NotificationMenu = ({ type = 'default' }: NotificationMenuProps) => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser } = useAuth();
  const [isSystemDialogOpen, setIsSystemDialogOpen] = useState(false);
  const [systemNotificationMessage, setSystemNotificationMessage] = useState('');
  const [systemNotificationAction, setSystemNotificationAction] = useState<
    (NonNullable<NotificationView['action']> & { notificationId?: number }) | null
  >(null);
  const showAllRef = useRef(showAll);
  const { t } = useTranslation();
  const currentUsername = currentUser?.username;

  const open = Boolean(anchorEl);

  const hasUnread = useMemo(() => !showAll && total > 0, [showAll, total]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!currentUsername) {
      setNotifications([]);
      setTotal(0);
      setPagesCount(0);
      setIsLoading(false);
      return undefined;
    }

    let isActive = true;

    const fetchNotifications = async () => {
      setIsLoading(true);
      setLoadFailed(false);

      try {
        const response = await loadNotifications(pageNumber, showAll);

        if (!isActive) {
          return;
        }

        setNotifications(response.data ?? []);
        setTotal(response.total ?? 0);
        setPagesCount(response.pagesCount ?? 0);
        setPageNumber(response.page ?? 1);
      } catch {
        if (!isActive) {
          return;
        }

        setLoadFailed(true);
        setNotifications([]);
        setPagesCount(0);
        setTotal(0);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchNotifications();

    return () => {
      isActive = false;
    };
  }, [currentUsername, pageNumber, showAll, retryCount]);

  useEffect(() => {
    showAllRef.current = showAll;
  }, [showAll]);

  const showSystemNotification = useCallback(
    (notification: ApiNotification) => {
      const fallbackMessage = t('notifications.systemNotificationFallback');
      const message = notification.message ?? '';
      const apiAction = (notification as ApiNotificationWithAction).action;
      const labelKey = apiAction?.kind ? notificationActionLabelKeys[apiAction.kind] : undefined;

      setSystemNotificationMessage(message.trim() ? message : fallbackMessage);
      setSystemNotificationAction(
        apiAction?.path?.startsWith('/')
          ? {
              label: t(labelKey ?? 'notifications.openDuels'),
              to: apiAction.path,
              notificationId: notification.id,
            }
          : null,
      );
      setIsSystemDialogOpen(true);
    },
    [t],
  );

  useEffect(() => {
    const username = currentUsername;

    if (!username) return undefined;

    wsService.send('notification-add', username);

    const unsubscribe = wsService.on<ApiNotification>(
      `notification-${username}`,
      (notification) => {
        if (!notification) return;

        setNotifications((prevNotifications) => {
          if (prevNotifications.some((item) => item.id === notification.id)) {
            return prevNotifications;
          }

          return [notification, ...prevNotifications];
        });

        if (Number(notification.type) === 1) {
          showSystemNotification(notification);
        }

        if (!showAllRef.current) {
          setTotal((prevTotal) => prevTotal + 1);
        }
      },
    );

    return () => {
      wsService.send('notification-delete', username);
      unsubscribe();
    };
  }, [currentUsername, showSystemNotification]);

  const getKepcoinReason = useCallback(
    (earnType?: number) => {
      const normalizedEarnType = earnType;

      if (normalizedEarnType === 1) return t('notifications.kepcoinReasonBlogPublished');
      if (normalizedEarnType === 4) return t('notifications.kepcoinReasonBonusFromAdmin');
      if (normalizedEarnType === 7) return t('notifications.kepcoinReasonDaily');
      if (normalizedEarnType === 8) return t('notifications.kepcoinReasonWeekly');
      if (normalizedEarnType === 9) return t('notifications.kepcoinReasonMonthly');
      return undefined;
    },
    [t],
  );

  const buildNotificationView = useCallback(
    (notification: ApiNotification): NotificationView => {
      const parsedContent = parseContent(notification.content);
      const apiAction = (notification as ApiNotificationWithAction).action;
      const chips: ReactNode[] = [];
      const notificationType = Number(notification.type ?? 0);
      const icon = typeIconMap[notificationType] ?? 'info';

      let title =
        notification.message ||
        (typeof parsedContent.text === 'string' && parsedContent.text.trim()) ||
        t('notifications.systemNotificationFallback');
      let description: string | undefined;
      let action: NotificationView['action'];

      switch (notificationType) {
        case 2: {
          const deltaRaw =
            typeof parsedContent.delta === 'number'
              ? parsedContent.delta
              : Number(parsedContent.delta);
          const delta = Number.isFinite(deltaRaw) ? (deltaRaw as number) : undefined;

          if (typeof delta === 'number') {
            chips.push(
              <Chip
                key="delta"
                size="small"
                label={`${delta > 0 ? '+' : ''}${delta}`}
                color={delta > 0 ? 'success' : delta < 0 ? 'error' : 'default'}
                variant={delta === 0 ? 'outlined' : 'filled'}
              />,
            );
          }

          title = parsedContent.contestTitle || t('notifications.contestFinished');
          description = t('notifications.contestFinished');

          if (parsedContent.contestId) {
            action = {
              label: t('notifications.viewContestStandings'),
              to: getResourceById(resources.ContestStandings, parsedContent.contestId),
            };
          }
          break;
        }
        case 3: {
          const amountRaw =
            typeof parsedContent.kepcoin === 'number'
              ? parsedContent.kepcoin
              : Number(parsedContent.kepcoin);
          const amount = Number.isFinite(amountRaw) ? (amountRaw as number) : undefined;
          const reason = getKepcoinReason(parsedContent.earnType);

          if (typeof amount === 'number') {
            chips.push(<KepcoinValue value={amount} />);
          }

          title =
            reason ||
            (typeof amount === 'number'
              ? t('notifications.earnedKepcoin', { amount })
              : t('notifications.systemNotificationFallback'));
          description =
            parsedContent.detail?.blog?.title ||
            parsedContent.blog?.title ||
            parsedContent.blogTitle ||
            (typeof amount === 'number' ? t('notifications.earnedKepcoin', { amount }) : reason);

          const blogId =
            parsedContent.detail?.blog?.id ?? parsedContent.blog?.id ?? parsedContent.blogId;

          if (blogId) {
            action = {
              label: t('notifications.openBlog'),
              to: getResourceById(resources.BlogPost, blogId),
            };
          }
          break;
        }
        case 4: {
          title = t('notifications.challengeCallAccepted');
          description = t('notifications.challengeCallAcceptedDescription');

          if (parsedContent.challengeId) {
            action = {
              label: t('notifications.goToChallenge'),
              to: getResourceById(resources.Challenge, parsedContent.challengeId),
            };
          }
          break;
        }
        case 5: {
          title = t('notifications.challengeFinished');
          description = t('notifications.challengeFinishedDescription');

          if (parsedContent.challengeId) {
            action = {
              label: t('notifications.goToChallenge'),
              to: getResourceById(resources.Challenge, parsedContent.challengeId),
            };
          }
          break;
        }
        case 6: {
          title = parsedContent.arena?.title || t('notifications.arenaFinished');
          description = t('notifications.arenaFinished');

          if (parsedContent.arena?.id) {
            action = {
              label: t('notifications.viewArenaResults'),
              to: getResourceById(resources.ArenaTournament, parsedContent.arena.id),
            };
          }
          break;
        }
        case 7:
        case 11:
        case 13: {
          title =
            notificationType === 13
              ? t('notifications.duelReminder')
              : notificationType === 11
                ? t('notifications.duelAccepted')
                : t('notifications.duelStarts');
          description = notification.message ?? undefined;

          if (parsedContent.duel?.id) {
            action = {
              label: t('notifications.openDuel'),
              to: getResourceById(resources.Duel, parsedContent.duel.id),
            };
          }
          break;
        }
        case 9:
        case 10:
        case 12: {
          title = t('notifications.duelInvitationUpdate');
          description = notification.message ?? undefined;
          action = {
            label: t('notifications.openDuels'),
            to: resources.Duels,
          };
          break;
        }
        case 8: {
          title = parsedContent.achievementTitle || t('notifications.newAchievement');

          if (currentUsername) {
            action = {
              label: t('notifications.viewAchievements'),
              to: getResourceByUsername(resources.UserProfileAchievements, currentUsername),
            };
          }
          break;
        }
        default: {
          // Free-form messages belong in the body, not in a multi-line bold heading.
          description = title;
          title = t('notifications.systemNotificationFallback');
        }
      }

      if (apiAction?.path?.startsWith('/')) {
        const labelKey = apiAction.kind ? notificationActionLabelKeys[apiAction.kind] : undefined;
        action = {
          label: t(labelKey ?? 'notifications.openDuels'),
          to: apiAction.path,
        };
      }

      return { title, description, action, chips, icon };
    },
    [currentUsername, getKepcoinReason, t],
  );

  const handleMarkRead = async (notificationId?: number) => {
    if (!notificationId || showAll) return;

    setNotifications((prev) => {
      const updated = prev.filter((item) => item.id !== notificationId);

      if (prev.length === 1 && pageNumber > 1) {
        setPageNumber((value) => Math.max(value - 1, 1));
      }

      return updated;
    });

    setTotal((prev) => Math.max(prev - 1, 0));

    try {
      await apiClient.apiNotificationsRead(String(notificationId), {} as NotificationBody);
    } catch {
      // silently ignore errors for UX consistency
    }
  };

  const handleActionClick = (notificationId?: number) => {
    handleMarkRead(notificationId);
    handleClose();
  };

  const handleReadAll = async () => {
    if (showAll || !total || isLoading || loadFailed) return;

    setNotifications([]);
    setTotal(0);
    setPagesCount(0);
    setPageNumber(1);

    try {
      await apiClient.apiNotificationsReadAll({} as NotificationBody);
    } catch {
      // ignore errors to keep UI responsive
    }
  };

  const handleToggleView = (all: boolean) => {
    setShowAll(all);
    setPageNumber(1);
  };

  const handlePageChange = (value: number) => {
    setPageNumber(value);
  };

  const renderList = () => {
    if (isLoading) {
      return (
        <Stack direction="column" spacing={2.5} sx={{ p: 2.5 }}>
          {Array.from({ length: NOTIFICATIONS_PAGE_SIZE }, (_, index) => (
            <Stack key={index} direction="row" spacing={1.5}>
              <Skeleton variant="rectangular" width={32} height={32} />
              <Box sx={{ flex: 1 }}>
                <Skeleton width="85%" />
                <Skeleton width="60%" />
              </Box>
            </Stack>
          ))}
        </Stack>
      );
    }

    if (loadFailed) {
      return (
        <EmptyState
          compact
          kind="error"
          title={t('common.loadFailed')}
          action={
            <Button
              size="small"
              variant="outlined"
              onClick={() => setRetryCount((value) => value + 1)}
            >
              {t('common.retry')}
            </Button>
          }
        />
      );
    }

    if (!notifications.length) {
      return <EmptyState compact kind="notifications" title={t('notifications.empty')} />;
    }

    return (
      <List disablePadding sx={{ px: 2.5 }}>
        {notifications.map((notification, index) => {
          const itemKey =
            notification.id || notification.created || `${notification.type}-${index}`;
          const view = buildNotificationView(notification);
          const description = view.description?.trim();

          return (
            <Box
              component="li"
              key={itemKey}
              sx={{
                py: 2,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    border: 1,
                    borderColor: 'divider',
                    color: 'primary.main',
                  }}
                >
                  <KepIcon name={view.icon} fontSize={19} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, lineHeight: 1.55, overflowWrap: 'anywhere' }}
                  >
                    {view.title}
                  </Typography>
                  {description && description !== view.title.trim() && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5, lineHeight: 1.6, overflowWrap: 'anywhere' }}
                    >
                      {description}
                    </Typography>
                  )}
                  {!!view.chips?.length && (
                    <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
                      {view.chips.map((chip, chipIndex) => (
                        <Box key={`${itemKey}-chip-${chipIndex}`}>{chip}</Box>
                      ))}
                    </Stack>
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.75, fontSize: 11 }}
                  >
                    {getNotificationMeta(notification)}
                  </Typography>
                  {view.action && (
                    <Button
                      component={RouterLink}
                      to={view.action.to}
                      size="small"
                      variant="text"
                      onClick={() => handleActionClick(notification.id)}
                      endIcon={
                        <IconifyIcon
                          icon="material-symbols:arrow-forward-rounded"
                          sx={{ fontSize: 15 }}
                        />
                      }
                      sx={{
                        mt: 0.5,
                        px: 0,
                        minHeight: 28,
                        fontSize: 12,
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      {view.action.label}
                    </Button>
                  )}
                </Box>
                {!showAll && notification.id && (
                  <Tooltip title={t('notifications.markAsRead')}>
                    <IconButton
                      size="small"
                      aria-label={`${t('notifications.markAsRead')}: ${view.title}`}
                      onClick={() => handleMarkRead(notification.id)}
                      sx={{ color: 'text.secondary', p: 0.75, mr: -0.75 }}
                    >
                      <KepIcon name="check" fontSize={18} />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          );
        })}
      </List>
    );
  };

  return (
    <>
      <Button
        aria-label={t('notifications.title')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? 'notification-menu' : undefined}
        title={t('notifications.title')}
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleClick}
      >
        <OutlinedBadge
          variant="dot"
          color="error"
          invisible={!hasUnread}
          sx={{
            [`& .${badgeClasses.badge}`]: {
              height: 10,
              width: 10,
              top: -2,
              right: -2,
              borderRadius: '50%',
            },
          }}
        >
          <IconifyIcon
            icon={
              type === 'slim'
                ? 'material-symbols:notifications-outline-rounded'
                : 'material-symbols-light:notifications-outline-rounded'
            }
            sx={{ fontSize: type === 'slim' ? 18 : 22 }}
          />
        </OutlinedBadge>
      </Button>
      <Popover
        anchorEl={anchorEl}
        id="notification-menu"
        slotProps={{ paper: { role: 'dialog', 'aria-label': t('notifications.title') } }}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: {
            width: 'min(420px, calc(100vw - 32px))',
            height:
              !isLoading && !notifications.length ? 'auto' : 'min(660px, calc(100dvh - 96px))',
            maxHeight: 'calc(100dvh - 96px)',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <ActivityMenuHeader
          title={t('notifications.title')}
          subtitle={
            isLoading
              ? t('common.loading')
              : t(showAll ? 'notifications.countTotal' : 'notifications.countUnread', {
                  count: total,
                })
          }
          illustration="notifications"
          onClose={handleClose}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2.5,
            gap: 1,
            flexWrap: 'wrap',
            borderTop: 1,
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <Tabs
            value={showAll ? 'all' : 'unread'}
            onChange={(_, value) => handleToggleView(value === 'all')}
            aria-label={t('notifications.title')}
            sx={{
              minHeight: 44,
              '& .MuiTab-root': { minHeight: 44, minWidth: 0, px: 1.25, fontSize: 12 },
            }}
          >
            <Tab value="unread" label={t('notifications.unread')} />
            <Tab value="all" label={t('notifications.all')} />
          </Tabs>
          {!showAll && total > 0 && !isLoading && !loadFailed && (
            <Tooltip title={t('notifications.markAllAsRead')}>
              <IconButton
                size="small"
                aria-label={t('notifications.markAllAsRead')}
                onClick={handleReadAll}
                sx={{ color: 'primary.main' }}
              >
                <IconifyIcon icon="material-symbols:done-all-rounded" sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        <Box
          key={`${showAll}-${pageNumber}`}
          aria-busy={isLoading}
          sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}
        >
          {renderList()}
        </Box>
        {pagesCount > 1 && (
          <Box
            sx={{
              flexShrink: 0,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.level1',
              '& > .MuiStack-root': { py: 1.5 },
            }}
          >
            <ListPagination
              count={pagesCount}
              page={pageNumber}
              onChange={handlePageChange}
              disabled={isLoading}
            />
          </Box>
        )}
      </Popover>
      <Dialog
        aria-labelledby="system-notification-title"
        open={isSystemDialogOpen}
        onClose={() => setIsSystemDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogHeader
          id="system-notification-title"
          title={t('notifications.systemNotificationTitle')}
          onClose={() => setIsSystemDialogOpen(false)}
        />
        <DialogContent>
          <DialogContentText>{systemNotificationMessage}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {systemNotificationAction ? (
            <Button
              component={RouterLink}
              to={systemNotificationAction.to}
              variant="contained"
              fullWidth
              onClick={() => {
                handleMarkRead(systemNotificationAction.notificationId);
                setIsSystemDialogOpen(false);
              }}
            >
              {systemNotificationAction.label}
            </Button>
          ) : null}
          <Button
            variant={systemNotificationAction ? 'text' : 'contained'}
            fullWidth
            onClick={() => setIsSystemDialogOpen(false)}
          >
            {t('notifications.systemNotificationOk')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationMenu;
