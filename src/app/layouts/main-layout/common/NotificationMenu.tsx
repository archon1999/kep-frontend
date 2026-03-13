import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Popover,
  Skeleton,
  Stack,
  Typography,
  badgeClasses,
  paperClasses,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, getResourceByUsername, resources } from 'app/routes/resources';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { apiClient } from 'shared/api/http/apiClient';
import {
  Notification as ApiNotification,
  NotificationType as ApiNotificationType,
  NotificationBody,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepIcon from 'shared/components/base/KepIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import KepcoinValue from 'shared/components/common/KepcoinValue.tsx';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';
import { KepIconName } from 'shared/config/icons';
import { wsService } from 'shared/services/websocket';

const NOTIFICATIONS_PAGE_SIZE = 5;

interface NotificationContent {
  contestId?: number;
  contestTitle?: string;
  delta?: number;
  earnType?: number;
  kepcoin?: number;
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

dayjs.extend(relativeTime);

const typeIconMap: Partial<Record<ApiNotificationType, KepIconName>> = {
  [ApiNotificationType.NUMBER_1]: 'info',
  [ApiNotificationType.NUMBER_2]: 'rating-changes',
  [ApiNotificationType.NUMBER_3]: 'rating',
  [ApiNotificationType.NUMBER_4]: 'challenge',
  [ApiNotificationType.NUMBER_5]: 'challenge',
  [ApiNotificationType.NUMBER_6]: 'arena',
  [ApiNotificationType.NUMBER_7]: 'duel',
  [ApiNotificationType.NUMBER_8]: 'star',
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
  notification.createdNaturaltime ||
  (notification.created ? dayjs(notification.created).fromNow() : 'Just now');

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
  const [showAll, setShowAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser } = useAuth();
  const [isSystemDialogOpen, setIsSystemDialogOpen] = useState(false);
  const [systemNotificationMessage, setSystemNotificationMessage] = useState('');
  const showAllRef = useRef(showAll);
  const { t } = useTranslation();

  const open = Boolean(anchorEl);

  const hasUnread = useMemo(() => !showAll && total > 0, [showAll, total]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);

    if (!currentUser) {
      setNotifications([]);
      setTotal(0);
      setPagesCount(0);
      setIsLoading(false);
      return;
    }

    try {
      const params = { page: pageNumber, pageSize: NOTIFICATIONS_PAGE_SIZE };
      const response = showAll
        ? await apiClient.apiNotificationsAllList(params)
        : await apiClient.apiNotificationsList(params);

      setNotifications(response.data ?? []);
      setTotal(response.total ?? 0);
      setPagesCount(response.pagesCount ?? 0);
      setPageNumber(response.page ?? 1);
    } catch {
      setNotifications([]);
      setPagesCount(0);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, pageNumber, showAll]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    showAllRef.current = showAll;
  }, [showAll]);

  const showSystemNotification = useCallback(
    (message?: string) => {
      const fallbackMessage = t('notifications.systemNotificationFallback');
      setSystemNotificationMessage(message?.trim() ? message : fallbackMessage);
      setIsSystemDialogOpen(true);
    },
    [t],
  );

  useEffect(() => {
    const username = currentUser?.username;

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

        if (notification.type === ApiNotificationType.NUMBER_1) {
          showSystemNotification(notification.message ?? '');
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
  }, [currentUser?.username, showSystemNotification]);

  const getKepcoinReason = useCallback(
    (earnType?: number) => {
      const normalizedEarnType = earnType;

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
      const chips: ReactNode[] = [];
      const icon = typeIconMap[notification.type] ?? 'info';

      let title =
        notification.message ||
        (typeof parsedContent.text === 'string' && parsedContent.text.trim()) ||
        t('notifications.systemNotificationFallback');
      let description: string | undefined;
      let action: NotificationView['action'];

      switch (notification.type) {
        case ApiNotificationType.NUMBER_2: {
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
        case ApiNotificationType.NUMBER_3: {
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
            typeof amount === 'number' ? t('notifications.earnedKepcoin', { amount }) : reason;
          break;
        }
        case ApiNotificationType.NUMBER_4: {
          title = t('notifications.challengeCallAccepted');
          description = t('notifications.challengeCallAccepted');

          if (parsedContent.challengeId) {
            action = {
              label: t('notifications.goToChallenge'),
              to: getResourceById(resources.Challenge, parsedContent.challengeId),
            };
          }
          break;
        }
        case ApiNotificationType.NUMBER_5: {
          title = t('notifications.challengeFinished');
          description = t('notifications.challengeFinished');

          if (parsedContent.challengeId) {
            action = {
              label: t('notifications.goToChallenge'),
              to: getResourceById(resources.Challenge, parsedContent.challengeId),
            };
          }
          break;
        }
        case ApiNotificationType.NUMBER_6: {
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
        case ApiNotificationType.NUMBER_7: {
          title = parsedContent.duel?.title || t('notifications.duelStarts');
          description = t('notifications.duelStarts');

          if (parsedContent.duel?.id) {
            action = {
              label: t('notifications.openDuel'),
              to: getResourceById(resources.Duel, parsedContent.duel.id),
            };
          }
          break;
        }
        case ApiNotificationType.NUMBER_8: {
          title = parsedContent.achievementTitle || t('notifications.newAchievement');

          if (currentUser?.username) {
            action = {
              label: t('notifications.viewAchievements'),
              to: getResourceByUsername(resources.UserProfileAchievements, currentUser.username),
            };
          }
          break;
        }
        default: {
          if (notification.message) {
            title = notification.message;
          } else if (typeof notification.content === 'string' && notification.content.trim()) {
            title = notification.content;
          }
        }
      }

      return { title, description, action, chips, icon };
    },
    [currentUser?.username, getKepcoinReason, t],
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
    if (showAll || !total) return;

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

  const handleToggleView = () => {
    setShowAll((prev) => !prev);
    setPageNumber(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const renderList = () => {
    if (isLoading) {
      return (
        <List disablePadding sx={{ px: 2 }}>
          {[...Array(5)].map((_, index) => (
            <Box key={`notification-skeleton-${index}`} component="li">
              <ListItem alignItems="flex-start" sx={{ py: 1.25, px: 0 }}>
                <ListItemAvatar>
                  <Skeleton variant="rounded" width={44} height={44} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" />}
                  secondary={<Skeleton variant="text" width="60%" />}
                />
              </ListItem>
              <Divider component="div" />
            </Box>
          ))}
        </List>
      );
    }

    if (!notifications.length) {
      return (
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
          sx={{ py: 6, height: '100%' }}
        >
          <Avatar
            sx={{ bgcolor: 'background.level1', color: 'text.neutral', width: 56, height: 56 }}
          >
            <IconifyIcon icon="material-symbols:notifications-off-outline" sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {t('notifications.empty')}
          </Typography>
        </Stack>
      );
    }

    return (
      <SimpleBar disableHorizontal>
        <List disablePadding>
          {notifications.map((notification, index) => {
            const itemKey =
              notification.id || notification.created || `${notification.type}-${index}`;
            const view = buildNotificationView(notification);
            const meta = getNotificationMeta(notification);

            return (
              <Box key={itemKey} component="li">
                <ListItem alignItems="flex-start" sx={{ py: 1.5, px: 2 }}>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                        width: 44,
                        height: 44,
                      }}
                    >
                      <KepIcon name={view.icon} fontSize={22} color="primary.main" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack spacing={0.75} alignItems="flex-start">
                        <Typography variant="subtitle2" color="text.primary">
                          {view.title}
                        </Typography>
                        {view.description && (
                          <Typography variant="body2" color="text.secondary">
                            {view.description}
                          </Typography>
                        )}
                        {!!view.chips?.length && (
                          <Stack direction="row" spacing={0.75} flexWrap="wrap">
                            {view.chips.map((chip, chipIndex) => (
                              <Box key={`${itemKey}-chip-${chipIndex}`} sx={{ mb: 0.5, mr: 0.5 }}>
                                {chip}
                              </Box>
                            ))}
                          </Stack>
                        )}
                        {(view.action || (!showAll && notification.id)) && (
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            {view.action && (
                              <Button
                                component={RouterLink}
                                to={view.action.to}
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => handleActionClick(notification.id)}
                              >
                                {view.action.label}
                              </Button>
                            )}
                            {!showAll && notification.id && (
                              <Button
                                size="small"
                                variant="text"
                                color="primary"
                                onClick={() => handleMarkRead(notification.id)}
                                startIcon={<KepIcon name="check" fontSize={16} />}
                              >
                                {t('notifications.markAsRead')}
                              </Button>
                            )}
                          </Stack>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {meta}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                <Divider component="div" />
              </Box>
            );
          })}
        </List>
      </SimpleBar>
    );
  };

  return (
    <>
      <Button
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
            width: 420,
            height: 640,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, pt: 2, pb: 1 }}
        >
          <Box>
            <Typography variant="h6">{t('notifications.title')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {showAll ? t('notifications.subtitleAll') : t('notifications.subtitleUnread')}
            </Typography>
          </Box>
          <Chip
            color="primary"
            size="small"
            label={t(showAll ? 'notifications.countTotal' : 'notifications.countUnread', {
              count: total,
            })}
            sx={{ borderRadius: 1 }}
          />
        </Stack>

        {!showAll && total > 0 && (
          <Box sx={{ px: 2, pb: 1 }}>
            <Button size="small" color="primary" variant="text" onClick={handleReadAll}>
              {t('notifications.markAllAsRead')}
            </Button>
          </Box>
        )}

        <Divider />

        <Box sx={{ pt: 1, flex: 1, overflow: 'hidden' }}>{renderList()}</Box>

        {pagesCount > 1 && (
          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 1 }}>
            <Pagination
              count={pagesCount}
              page={pageNumber}
              onChange={handlePageChange}
              size="medium"
            />
          </Stack>
        )}

        <Divider />

        <Stack direction="row" spacing={1} sx={{ px: 2, py: 1 }}>
          <Button fullWidth variant="contained" color="primary" onClick={handleToggleView}>
            {showAll ? t('notifications.showUnread') : t('notifications.showAll')}
          </Button>
        </Stack>
      </Popover>
      <Dialog
        open={isSystemDialogOpen}
        onClose={() => setIsSystemDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('notifications.systemNotificationTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{systemNotificationMessage}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" fullWidth onClick={() => setIsSystemDialogOpen(false)}>
            {t('notifications.systemNotificationOk')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationMenu;
