import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import { useKepcoinSummary, useTaskCategories } from 'modules/kepcoin/application/queries';
import TaskActionDialog from 'modules/kepcoin/ui/shared/components/TaskActionDialog';
import type { OneTimeTask } from 'modules/kepcoin/domain/entities/kepcoin.entity';
import TaskCategoriesWidget from 'modules/kepcoin/ui/shared/widgets/TaskCategoriesWidget';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import { resources } from 'app/routes/resources';
import { consumePendingTaskSlug } from 'modules/kepcoin/lib/pending-task-storage';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';

type TaskFilter = 'all' | 'completed' | 'uncompleted';

const KepcoinEarnPage = () => {
  const { t } = useTranslation();
  const { refreshCurrentUser } = useAuth();
  const [selectedTaskSlug, setSelectedTaskSlug] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [pendingRestoreSlug, setPendingRestoreSlug] = useState<string | null>(() => consumePendingTaskSlug());
  const { mutate: reloadSummary } = useKepcoinSummary();
  const { data: taskCategoriesResponse, isLoading: isTasksLoading, mutate: reloadTasks } = useTaskCategories();

  const taskCategories = taskCategoriesResponse?.categories ?? [];
  const allTasks = useMemo(() => taskCategories.flatMap((category) => category.tasks), [taskCategories]);
  const filteredCategories = useMemo(() => {
    if (taskFilter === 'all') {
      return taskCategories;
    }

    return taskCategories
      .map((category) => ({
        ...category,
        tasks: category.tasks.filter((task) =>
          taskFilter === 'completed' ? task.status === 'completed' : task.status !== 'completed',
        ),
      }))
      .filter((category) => category.tasks.length > 0);
  }, [taskCategories, taskFilter]);
  const selectedTask = useMemo(
    () => allTasks.find((task) => task.slug === selectedTaskSlug) ?? null,
    [allTasks, selectedTaskSlug],
  );
  const filterTabs = useMemo(
    () => [
      { value: 'all' as const, label: t('kepcoinPage.earnPage.filters.all') },
      { value: 'completed' as const, label: t('kepcoinPage.earnPage.filters.completed') },
      { value: 'uncompleted' as const, label: t('kepcoinPage.earnPage.filters.uncompleted') },
    ],
    [t],
  );

  useEffect(() => {
    if (isTasksLoading || !pendingRestoreSlug) {
      return;
    }

    if (allTasks.some((task) => task.slug === pendingRestoreSlug)) {
      setSelectedTaskSlug(pendingRestoreSlug);
    }

    setPendingRestoreSlug(null);
  }, [allTasks, isTasksLoading, pendingRestoreSlug]);

  useEffect(() => {
    if (selectedTaskSlug && taskCategories.length > 0 && !selectedTask) {
      setSelectedTaskSlug(null);
    }
  }, [selectedTask, selectedTaskSlug, taskCategories.length]);

  const handleOpenTask = (task: OneTimeTask) => {
    setSelectedTaskSlug(task.slug);
  };

  const handleCloseTask = () => {
    setSelectedTaskSlug(null);
  };

  const handleTaskCompleted = async () => {
    await Promise.all([reloadSummary(), reloadTasks(), refreshCurrentUser()]);
  };

  return (
    <>
      <Box sx={responsivePagePaddingSx}>
        <Stack direction="column" spacing={4}>
          <Card
            sx={(theme) => ({
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 3,
              bgcolor: 'background.paper',
              background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.warning.lightChannel, 0.12)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06)})`,
            })}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack direction="column" spacing={2.5}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  spacing={2}
                >
                  <Stack direction="column" spacing={1}>
                    <Typography variant="h4" fontWeight={800}>
                      {t('kepcoinPage.earnPage.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                      {t('kepcoinPage.earnPage.subtitle')}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.25}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Button
                      component={RouterLink}
                      to={resources.Kepcoin}
                      variant="outlined"
                      color="primary"
                      startIcon={<IconifyIcon icon="solar:alt-arrow-left-linear" />}
                    >
                      {t('kepcoinPage.earnPage.backToKepcoin')}
                    </Button>
                    <Button
                      component={RouterLink}
                      to={resources.Shop}
                      variant="contained"
                      color="primary"
                      startIcon={<IconifyIcon icon="solar:shop-2-bold-duotone" />}
                    >
                      {t('kepcoinPage.earnPage.openShop')}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>

            <Box
              sx={{
                position: 'absolute',
                right: { xs: -20, md: 24 },
                bottom: { xs: -28, md: -8 },
                opacity: 0.08,
                pointerEvents: 'none',
              }}
            >
              <Logo sx={{ width: { xs: 180, md: 240 }, height: { xs: 180, md: 240 } }} />
            </Box>
          </Card>

          <ResponsiveTabs
            value={taskFilter}
            onChange={(value) => setTaskFilter(value)}
            items={filterTabs}
            ariaLabel="kepcoin task filters"
            tabsProps={{
              variant: 'scrollable',
              scrollButtons: false,
            }}
          />

          <TaskCategoriesWidget
            categories={filteredCategories}
            isLoading={isTasksLoading}
            onOpenTask={handleOpenTask}
          />
        </Stack>
      </Box>

      <TaskActionDialog
        open={Boolean(selectedTask)}
        task={selectedTask}
        onClose={handleCloseTask}
        onCompleted={handleTaskCompleted}
      />
    </>
  );
};

export default KepcoinEarnPage;
