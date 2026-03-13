import { MouseEvent, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Popover,
  Skeleton,
  Stack,
  Typography,
  paperClasses,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useAuth } from 'app/providers/AuthProvider';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import useSWR from 'swr';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import Streak from 'shared/components/rating/Streak';

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
  type?: 'default' | 'slim';
}

const taskIconMap: Record<DailyTaskType, string> = {
  [DailyTaskType.Problem]: 'material-symbols:code',
  [DailyTaskType.Test]: 'material-symbols:quiz-outline-rounded',
  [DailyTaskType.Challenge]: 'material-symbols:flag-rounded',
};

const DailyTasksMenu = ({ type = 'default' }: DailyTasksMenuProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { currentUser } = useAuth();

  const { data, isLoading, mutate } = useSWR<DailyTasksResponse>(
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
  const progress = dailyTasks.length
    ? Math.round((completedTasks / dailyTasks.length) * 100)
    : 0;
  const open = Boolean(anchorEl);

  const renderTasks = () => {
    if (isLoading) {
      return (
        <Stack direction="column" component="ul" spacing={1} sx={{ px: 1.5, py: 1.5, m: 0 }}>
          {[...Array(3)].map((_, index) => (
            <Stack
              component="li"
              key={index}
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
              sx={{ p: 1.25, borderRadius: 2, bgcolor: 'background.level1' }}
            >
              <Skeleton variant="circular" width={44} height={44} />

              <Stack direction="column" spacing={1} flex={1} minWidth={0}>
                <Stack direction="row" spacing={0.75}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width={80} />
                </Stack>

                <Skeleton variant="rounded" width={80} height={24} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      );
    }

    if (!dailyTasks.length) {
      return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.25} sx={{ py: 4 }}>
          <Avatar sx={{ bgcolor: 'background.level1', color: 'text.secondary', width: 48, height: 48 }}>
            <IconifyIcon icon="material-symbols:checklist-rounded" />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {t('common.dailyTasks.empty')}
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack direction="column" component="ul" spacing={1} sx={{ px: 1.5, py: 1.5, m: 0 }}>
        {dailyTasks.map((task, index) => (
          <Stack
            component="li"
            key={`${task.type}-${task.description}-${index}`}
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ p: 1.25, borderRadius: 2, bgcolor: 'background.level1' }}
          >
            <Avatar
              variant="circular"
              sx={{ bgcolor: 'primary.lighter', color: 'primary.main', width: 44, height: 44 }}
            >
              <IconifyIcon icon={taskIconMap[task.type]} sx={{ fontSize: 22 }} />
            </Avatar>

            <Stack direction="column" spacing={1}>
              <Stack direction="row" spacing={0.75} flex={1} minWidth={0}>
                <Typography variant="subtitle2" noWrap title={task.description}>
                  {task.description}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <KepcoinValue
                    value={task.kepcoin}
                    iconSize={16}
                    spacing={0.5}
                    textVariant="caption"
                    fontWeight={700}
                    color="text.primary"
                  />
                </Stack>
              </Stack>

              <Box>
                {task.completed ? (
                  <Chip
                    size="small"
                    color="success"
                    variant="soft"
                    label={t('common.dailyTasks.completed')}
                    icon={<IconifyIcon icon="material-symbols:check-circle-rounded" sx={{ fontSize: 16 }} />}
                  />
                ) : (
                  <Chip
                    size="small"
                    color="primary"
                    variant="soft"
                    label={`${task.progress}/${task.total}`}
                  />
                )}
              </Box>
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleOpen}
        sx={{ px: 1.5 }}
      >
        <Streak streak={streakValue} maxStreak={maxStreak} iconSize={type === 'slim' ? 18 : 22} spacing={0.75} />
      </Button>

      <Popover
        anchorEl={anchorEl}
        id="daily-tasks-menu"
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
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            p: 0,
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box>
            <Typography variant="h6">{t('common.dailyTasks.title')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('common.dailyTasks.subtitle')}
            </Typography>
          </Box>
          <Chip
            color="secondary"
            size="small"
            label={t('common.dailyTasks.tasksCount', { count: dailyTasks.length })}
            sx={{ borderRadius: 1 }}
          />
        </Stack>

        <Divider />

        <Box sx={{ flex: 1, overflow: 'hidden' }}>{renderTasks()}</Box>

        <Divider />

        <Stack direction="row" spacing={1} sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('common.dailyTasks.completed')}
            </Typography>
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {dailyTasks.length ? `${completedTasks}/${dailyTasks.length}` : '--'}
            </Typography>
          </Stack>
        </Stack>
        { progress > 0 && <LinearProgress variant="determinate" value={progress} sx={{ height: 20, borderRadius: 999, mx: 2, mb: 2 }} /> }
      </Popover>
    </>
  );
};

export default DailyTasksMenu;
