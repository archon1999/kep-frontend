import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import { useKepcoinSummary, useTaskCategories } from '../../application/queries';
import TaskActionDialog from '../components/TaskActionDialog';
import type { OneTimeTask } from '../../domain/entities/kepcoin.entity';
import TaskCategoriesWidget from '../widgets/TaskCategoriesWidget';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { cssVarRgba } from 'shared/lib/utils';
import { resources } from 'app/routes/resources';
import { consumePendingTaskSlug } from '../../lib/pending-task-storage';

const KepcoinEarnPage = () => {
  const { t } = useTranslation();
  const { refreshCurrentUser } = useAuth();
  const [selectedTaskSlug, setSelectedTaskSlug] = useState<string | null>(null);
  const [pendingRestoreSlug, setPendingRestoreSlug] = useState<string | null>(() => consumePendingTaskSlug());
  const { mutate: reloadSummary } = useKepcoinSummary();
  const { data: taskCategoriesResponse, isLoading: isTasksLoading, mutate: reloadTasks } = useTaskCategories();

  const taskCategories = taskCategoriesResponse?.categories ?? [];
  const allTasks = useMemo(() => taskCategories.flatMap((category) => category.tasks), [taskCategories]);
  const selectedTask = useMemo(
    () => allTasks.find((task) => task.slug === selectedTaskSlug) ?? null,
    [allTasks, selectedTaskSlug],
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

          <TaskCategoriesWidget
            categories={taskCategories}
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
