import { useTranslation } from 'react-i18next';
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { contentGridSx } from 'app/theme/styles/content';
import type { OneTimeTask, TaskCategory } from 'modules/kepcoin/domain/entities/kepcoin.entity';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import TaskCard from '../components/TaskCard';

interface TaskCategoriesWidgetProps {
  categories: TaskCategory[];
  isLoading: boolean;
  onOpenTask: (task: OneTimeTask) => void;
}

const TaskCategoriesWidget = ({ categories, isLoading, onOpenTask }: TaskCategoriesWidgetProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" spacing={0}>
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 6, xl: 4 }}>
              <Skeleton variant="rectangular" height={168} />
            </Grid>
          ))}
        </Grid>
      ) : categories.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('kepcoinPage.tasks.empty')}
        </Typography>
      ) : (
        categories.map((category) => (
          <Stack key={category.slug} direction="column" spacing={0}>
            <SectionHeader title={category.title} />
            <Box
              sx={{
                ...contentGridSx,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(3, minmax(0, 1fr))',
                },
              }}
            >
              {category.tasks.map((task) => (
                <Box key={task.slug}>
                  <TaskCard task={task} onOpenTask={onOpenTask} />
                </Box>
              ))}
            </Box>
          </Stack>
        ))
      )}
    </Stack>
  );
};

export default TaskCategoriesWidget;
