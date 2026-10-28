import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useKepcoinEarnPage } from 'modules/kepcoin/application/hooks/useKepcoinEarnPage';
import TaskActionDialog from 'modules/kepcoin/ui/shared/components/TaskActionDialog';
import TaskCategoriesWidget from 'modules/kepcoin/ui/shared/widgets/TaskCategoriesWidget';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';

const KepcoinEarnPage = () => {
  const {
    isTasksLoading,
    filteredCategories,
    selectedTask,
    handleTaskCompleted,
    taskFilter,
    setTaskFilter,
    handleOpenTask,
    handleCloseTask,
  } = useKepcoinEarnPage();

  const { t } = useTranslation();
  const filterTabs = useMemo(
    () => [
      { value: 'all' as const, label: t('kepcoinPage.earnPage.filters.all') },
      { value: 'completed' as const, label: t('kepcoinPage.earnPage.filters.completed') },
      { value: 'uncompleted' as const, label: t('kepcoinPage.earnPage.filters.uncompleted') },
    ],
    [t],
  );

  return (
    <>
      <FramedPage>
        <Stack direction="column" spacing={0}>
          <PageHeader
            variant="detail"
            title={t('kepcoinPage.earnPage.title')}
            subtitle={t('kepcoinPage.earnPage.subtitle')}
            backTo={resources.Kepcoin}
            actionComponent={
              <Button
                component={RouterLink}
                to={resources.Shop}
                variant="contained"
                startIcon={<IconifyIcon icon="solar:shop-2-bold-duotone" />}
              >
                {t('kepcoinPage.earnPage.openShop')}
              </Button>
            }
          />

          <Box>
            <ResponsiveTabs
              value={taskFilter}
              onChange={(value) => setTaskFilter(value)}
              items={filterTabs}
              ariaLabel="kepcoin task filters"
              tabsProps={{
                variant: 'scrollable',
                scrollButtons: false,
                sx: { px: 'var(--kep-content-inset)', borderBottom: 1, borderColor: 'divider' },
              }}
            />

            <TaskCategoriesWidget
              categories={filteredCategories}
              isLoading={isTasksLoading}
              onOpenTask={handleOpenTask}
            />
          </Box>
        </Stack>
      </FramedPage>

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
