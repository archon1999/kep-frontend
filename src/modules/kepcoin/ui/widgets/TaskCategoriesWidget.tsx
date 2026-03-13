import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import type { OneTimeTask, TaskCategory } from '../../domain/entities/kepcoin.entity';

interface TaskCategoriesWidgetProps {
  categories: TaskCategory[];
  isLoading: boolean;
  onOpenTask: (task: OneTimeTask) => void;
}

const TaskCategoriesWidget = ({ categories, isLoading, onOpenTask }: TaskCategoriesWidgetProps) => {
  const { t } = useTranslation();

  const getActionLabel = (task: OneTimeTask) => {
    if (task.status === 'completed') {
      return t('kepcoinPage.tasks.completed');
    }

    return t('kepcoinPage.tasks.goToTask');
  };

  return (
    <Stack direction="column" spacing={10}>
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
                  <Card
                    sx={(theme) => ({
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.08),
                      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 16px 32px rgba(15, 23, 42, 0.08)',
                        borderColor: alpha(theme.palette.warning.main, 0.18),
                      },
                    })}
                  >
                    <Stack direction="row" sx={{ minHeight: 168, height: '100%' }}>
                      <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={1.25}
                        sx={{
                          width: { xs: 98, sm: 108 },
                          px: 1.75,
                          py: 2.25,
                          bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                          borderRight: '1px solid',
                          borderColor: 'divider',
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '50%',
                            bgcolor: 'background.paper',
                            boxShadow: '0 10px 20px rgba(245, 158, 11, 0.16)',
                          }}
                        >
                          <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 42, height: 42 }} />
                        </Box>
                        <Typography variant="h5" fontWeight={800} color="warning.main">
                          +{task.reward}
                        </Typography>
                      </Stack>

                      <Stack justifyContent="space-between" spacing={2} sx={{ p: 2.25, flex: 1, minWidth: 0 }}>
                        <Stack direction="column" spacing={1.25}>
                          <Stack direction="row" justifyContent="space-between" gap={1} alignItems="flex-start">
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.35 }}>
                              {task.title}
                            </Typography>
                            {task.status === 'completed' ? (
                              <Chip
                                size="small"
                                color="success"
                                variant="outlined"
                                label={t('kepcoinPage.tasks.completed')}
                              />
                            ) : task.status === 'blocked' ? (
                              <Chip
                                size="small"
                                color="warning"
                                variant="outlined"
                                label={t('kepcoinPage.tasks.blocked')}
                              />
                            ) : null}
                          </Stack>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              minHeight: 60,
                            }}
                          >
                            {task.description}
                          </Typography>
                        </Stack>

                        <Button
                          fullWidth
                          size="medium"
                          variant="outlined"
                          disabled={task.status === 'completed'}
                          onClick={() => onOpenTask(task)}
                          sx={{
                            py: 1,
                            borderStyle: 'dashed',
                            borderWidth: 1,
                            color: 'warning.dark',
                            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05),
                            borderColor: (theme) => alpha(theme.palette.warning.main, 0.5),
                            '&:hover': {
                              borderStyle: 'dashed',
                              borderColor: 'warning.dark',
                              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                            },
                            '&.Mui-disabled': {
                              borderStyle: 'dashed',
                              borderColor: 'success.main',
                              color: 'success.main',
                            },
                          }}
                        >
                          {getActionLabel(task)}
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
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
