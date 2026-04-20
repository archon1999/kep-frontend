import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import type { OneTimeTask, TaskCategory } from 'modules/kepcoin/domain/entities/kepcoin.entity';
import TaskCard from '../components/TaskCard';

interface TaskCategoriesWidgetProps {
  categories: TaskCategory[];
  isLoading: boolean;
  onOpenTask: (task: OneTimeTask) => void;
}

const TaskCategoriesWidget = ({ categories, isLoading, onOpenTask }: TaskCategoriesWidgetProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" spacing={15}>
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 6, xl: 4 }}>
              <Skeleton variant="rounded" height={168} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : categories.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('kepcoinPage.tasks.empty')}
        </Typography>
      ) : (
        categories.map((category) => (
          <Stack key={category.slug} direction="column" spacing={2.5}>
            <Stack direction="column" spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 4,
                  borderRadius: 999,
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.35),
                }}
              />
              <Typography variant="h4" fontWeight={700} textAlign={{ xs: 'left', md: 'center' }}>
                {category.title}
              </Typography>
            </Stack>

            <Grid container spacing={10}>
              {category.tasks.map((task) => (
                <Grid key={task.slug} size={{ xs: 12, md: 6, xl: 4 }}>
                  <TaskCard task={task} onOpenTask={onOpenTask} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        ))
      )}
    </Stack>
  );
};

export default TaskCategoriesWidget;
