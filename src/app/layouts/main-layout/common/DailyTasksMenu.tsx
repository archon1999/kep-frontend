import { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Popover,
  Skeleton,
  Stack,
  Typography,
  paperClasses,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import Streak from 'shared/components/rating/Streak';
import { cssVarRgba } from 'shared/lib/utils';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import useSWR from 'swr';
import ActivityMenuHeader from './ActivityMenuHeader';

enum DailyTaskType {
  Problem = 1,
  Test = 2,
  Challenge = 3,
}

type DailyTask = {
  type: DailyTaskType;
  kepcoin: number;
  progress: number;
  total: number;
  completed: boolean;
  description: string;
};

type DailyTasksResponse = {
  streak: number;
  maxStreak: number;
  dailyTasks: DailyTask[];
};

interface DailyTasksMenuProps {
  type?: 'default' | 'slim' | 'action';
  label?: string;
}

const taskIconMap: Record<DailyTaskType, string> = {
  [DailyTaskType.Problem]: 'material-symbols:code',
  [DailyTaskType.Test]: 'material-symbols:quiz-outline-rounded',
  [DailyTaskType.Challenge]: 'material-symbols:flag-rounded',
};

const DailyTasksMenu = ({ type = 'default', label }: DailyTasksMenuProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { currentUser } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<DailyTasksResponse>(
    currentUser ? ['/api/daily-tasks', { method: 'get' }] : null,
    axiosFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const dailyTasks = data?.dailyTasks ?? [];
  const completedTasks = useMemo(
    () => dailyTasks.filter((task) => task.completed).length,
    [dailyTasks],
  );

  const handleClose = () => setAnchorEl(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    mutate();
  };

  if (!currentUser) {
    return null;
  }

  const streakValue = data?.streak ?? 0;
  const maxStreak = data?.maxStreak ?? 0;
  const progress = dailyTasks.length ? Math.round((completedTasks / dailyTasks.length) * 100) : 0;
  const open = Boolean(anchorEl);

  const renderTasks = () => {
    if (isLoading) {
      return (
        <Stack direction="column" spacing={2.5} sx={{ p: 2.5 }}>
          {Array.from({ length: 3 }, (_, index) => (
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

    if (error) {
      return (
        <EmptyState
          compact
          kind="error"
          title={t('common.loadFailed')}
          action={
            <Button onClick={() => void mutate()} size="small" variant="outlined">
              {t('common.retry')}
            </Button>
          }
        />
      );
    }

    if (!dailyTasks.length) {
      return <EmptyState compact kind="daily-tasks" title={t('common.dailyTasks.empty')} />;
    }

    return (
      <Stack direction="column" component="ul" sx={{ px: 2.5, py: 0, m: 0, listStyle: 'none' }}>
        {dailyTasks.map((task, index) => (
          <Stack
            component="li"
            key={`${task.type}-${task.description}-${index}`}
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{
              py: 2.25,
              borderBottom: 1,
              borderColor: 'divider',
              '&:last-child': { borderBottom: 0 },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                border: 1,
                borderColor: 'divider',
                color: task.completed ? 'success.main' : 'primary.main',
              }}
            >
              <IconifyIcon
                icon={task.completed ? 'material-symbols:check-rounded' : taskIconMap[task.type]}
                sx={{ fontSize: 19 }}
              />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, fontWeight: 500, lineHeight: 1.55, overflowWrap: 'anywhere' }}
                >
                  {task.description}
                </Typography>
                <KepcoinValue
                  value={task.kepcoin}
                  iconSize={17}
                  textVariant="pixel"
                  sx={{ flexShrink: 0, pt: 0.25, '& .MuiTypography-root': { fontSize: 17 } }}
                />
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1.5 }}>
                <LinearProgress
                  aria-label={task.description}
                  variant="determinate"
                  value={
                    task.completed
                      ? 100
                      : task.total > 0
                        ? Math.min(100, Math.max(0, (task.progress / task.total) * 100))
                        : 0
                  }
                  color={task.completed ? 'success' : 'primary'}
                  sx={{ flex: 1, height: 3, borderRadius: 0, bgcolor: 'divider' }}
                />
                <Typography
                  variant={task.completed ? 'caption' : 'pixel'}
                  color={task.completed ? 'success.main' : 'text.secondary'}
                  sx={{ flexShrink: 0, fontSize: task.completed ? 12 : 15, lineHeight: 1 }}
                >
                  {task.completed
                    ? t('common.dailyTasks.completed')
                    : `${task.progress} / ${task.total}`}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <>
      <Button
        className="daily-tasks-menu-trigger"
        aria-label={t('common.dailyTasks.title')}
        aria-expanded={open}
        aria-controls={open ? 'daily-tasks-menu' : undefined}
        aria-haspopup="dialog"
        title={t('common.dailyTasks.title')}
        color={type === 'action' ? 'primary' : 'neutral'}
        variant={type === 'default' ? 'soft' : type === 'action' ? 'outlined' : 'text'}
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleOpen}
        sx={
          type === 'action'
            ? {
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                borderColor: (theme) => cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24),
                bgcolor: (theme) => cssVarRgba(theme.vars.palette.primary.mainChannel, 0.04),
              }
            : { px: 1.5 }
        }
      >
        {type === 'action' ? (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <IconifyIcon icon="material-symbols:checklist-rounded" />
            <Typography variant="button" color="inherit" sx={{ textTransform: 'none' }}>
              {label ?? t('common.dailyTasks.title')}
            </Typography>
          </Stack>
        ) : (
          <Streak
            streak={streakValue}
            animateValue
            color="inherit"
            maxStreak={maxStreak}
            iconSize={type === 'slim' ? 18 : 22}
            spacing={0.75}
          />
        )}
      </Button>

      <Popover
        anchorEl={anchorEl}
        id="daily-tasks-menu"
        slotProps={{ paper: { role: 'dialog', 'aria-label': t('common.dailyTasks.title') } }}
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
            maxHeight: 'calc(100dvh - 96px)',
            display: 'flex',
            flexDirection: 'column',
            p: 0,
          },
        }}
      >
        <ActivityMenuHeader
          title={t('common.dailyTasks.title')}
          subtitle={t('common.dailyTasks.subtitle')}
          illustration="daily-tasks"
          onClose={handleClose}
        />
        <Divider />
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
          {renderTasks()}
        </Box>
        {!isLoading && !error && dailyTasks.length > 0 && (
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderTop: 1,
              borderColor: 'divider',
              flexShrink: 0,
              bgcolor: 'background.level1',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.25 }}
            >
              <Typography variant="caption" color="text.secondary">
                {t('common.dailyTasks.completed')}
              </Typography>
              <Typography variant="pixel" sx={{ fontSize: 19 }}>
                {completedTasks} / {dailyTasks.length}
              </Typography>
            </Stack>
            <LinearProgress
              aria-label={t('common.dailyTasks.completed')}
              variant="determinate"
              value={progress}
              sx={{ height: 3, borderRadius: 0, bgcolor: 'divider' }}
            />
          </Box>
        )}
      </Popover>
    </>
  );
};

export default DailyTasksMenu;
