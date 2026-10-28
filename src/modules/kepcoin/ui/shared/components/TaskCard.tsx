import { useTranslation } from 'react-i18next';
import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { OneTimeTask } from 'modules/kepcoin/domain/entities/kepcoin.entity';
import kepcoinImage from 'shared/assets/images/icons/kepcoin-icon.webp';

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
    <Card variant="panel" sx={{ height: '100%', border: 0, '&::before': { display: 'none' } }}>
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
                task.status === 'completed'
                  ? theme.palette.success.main
                  : theme.palette.warning.main,
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
            }}
          >
            <Box component="img" src={kepcoinImage} alt="Kepcoin" sx={{ width: 38, height: 38 }} />
          </Box>
          <Typography
            variant="metric"
            fontSize={24}
            color={task.status === 'completed' ? 'success.main' : 'warning.main'}
          >
            +{task.reward}
          </Typography>
        </Stack>

        <Stack justifyContent="space-between" spacing={1.5} sx={{ p: 2, flex: 1, minWidth: 0 }}>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" justifyContent="space-between" gap={1} alignItems="flex-start">
              <Typography variant="h6" fontWeight={500} sx={{ lineHeight: 1.35 }}>
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
                minHeight: 40,
              }}
            >
              {task.description}
            </Typography>
          </Stack>

          <Button
            fullWidth
            size="medium"
            variant="contained"
            disabled={task.status === 'completed'}
            onClick={() => onOpenTask(task)}
          >
            {actionLabel}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default TaskCard;
