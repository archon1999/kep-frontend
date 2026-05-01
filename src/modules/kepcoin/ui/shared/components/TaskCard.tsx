import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.png';
import type { OneTimeTask } from 'modules/kepcoin/domain/entities/kepcoin.entity';

interface TaskCardProps {
  task: OneTimeTask;
  onOpenTask: (task: OneTimeTask) => void;
}

const TaskCard = ({ task, onOpenTask }: TaskCardProps) => {
  const { t } = useTranslation();

  const actionLabel =
    task.status === 'completed'
      ? t('kepcoinPage.tasks.completed')
      : t('kepcoinPage.tasks.goToTask');

  return (
    <Card
      sx={(theme) => ({
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor:
          task.status === 'completed'
            ? alpha(theme.palette.success.main, 0.45)
            : alpha(theme.palette.primary.main, 0.08),
        boxShadow:
          task.status === 'completed'
            ? `0 10px 24px ${alpha(theme.palette.success.main, 0.12)}`
            : '0 10px 24px rgba(15, 23, 42, 0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow:
            task.status === 'completed'
              ? `0 16px 32px ${alpha(theme.palette.success.main, 0.16)}`
              : '0 16px 32px rgba(15, 23, 42, 0.08)',
          borderColor:
            task.status === 'completed'
              ? alpha(theme.palette.success.main, 0.65)
              : alpha(theme.palette.warning.main, 0.18),
        },
      })}
    >
      <Stack direction="row" sx={{ minHeight: 148, height: '100%' }}>
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{
            width: { xs: 92, sm: 98 },
            px: 1.5,
            py: 2,
            bgcolor: (theme) =>
              alpha(
                task.status === 'completed' ? theme.palette.success.main : theme.palette.warning.main,
                0.08,
              ),
            borderRight: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              bgcolor: 'background.paper',
              boxShadow: '0 10px 20px rgba(245, 158, 11, 0.16)',
            }}
          >
            <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 38, height: 38 }} />
          </Box>
          <Typography
            variant="h6"
            fontWeight={800}
            color={task.status === 'completed' ? 'success.main' : 'warning.main'}
          >
            +{task.reward}
          </Typography>
        </Stack>

        <Stack justifyContent="space-between" spacing={1.5} sx={{ p: 2, flex: 1, minWidth: 0 }}>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" justifyContent="space-between" gap={1} alignItems="flex-start">
              <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.35 }}>
                {task.title}
              </Typography>
              {task.status === 'blocked' ? (
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
                minHeight: 54,
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
              py: 0.9,
              borderStyle: 'dashed',
              borderWidth: 1,
              color: task.status === 'completed' ? 'success.main' : 'warning.dark',
              bgcolor: (theme) =>
                alpha(
                  task.status === 'completed' ? theme.palette.success.main : theme.palette.warning.main,
                  0.05,
                ),
              borderColor: (theme) =>
                alpha(
                  task.status === 'completed' ? theme.palette.success.main : theme.palette.warning.main,
                  0.5,
                ),
              '&:hover': {
                borderStyle: 'dashed',
                borderColor: task.status === 'completed' ? 'success.main' : 'warning.dark',
                bgcolor: (theme) =>
                  alpha(
                    task.status === 'completed' ? theme.palette.success.main : theme.palette.warning.main,
                    0.08,
                  ),
              },
              '&.Mui-disabled': {
                borderStyle: 'dashed',
                borderColor: 'success.main',
                color: 'success.main',
              },
            }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default TaskCard;
