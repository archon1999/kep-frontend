import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import type { OneTimeTask, TaskCategory } from '../../domain/entities/kepcoin.entity';

interface TaskCategoriesWidgetProps {
  categories: TaskCategory[];
  isLoading: boolean;
  onOpenTask: (task: OneTimeTask) => void;
}

const taskIconMap: Record<string, string> = {
  'connect-telegram': 'logos:telegram',
  'connect-google': 'logos:google-icon',
  'connect-github': 'logos:github-icon',
  'complete-bio': 'solar:document-text-bold-duotone',
  'upload-avatar': 'solar:user-circle-bold-duotone',
  'add-three-technologies': 'solar:code-square-bold-duotone',
  'add-codeforces-handle': 'solar:hashtag-circle-bold-duotone',
  'follow-user': 'solar:users-group-rounded-bold-duotone',
  'create-or-join-team': 'solar:users-group-two-rounded-bold-duotone',
  'subscribe-telegram-channel': 'solar:chat-round-bold-duotone',
  'first-problem-attempt': 'solar:play-circle-bold-duotone',
  'first-problem-ac': 'solar:medal-ribbon-star-bold-duotone',
  'register-contest': 'solar:cup-star-bold-duotone',
  'join-arena': 'solar:bolt-circle-bold-duotone',
  'complete-course-lesson-part': 'solar:book-bold-duotone',
  'first-project-attempt': 'solar:folder-with-files-bold-duotone',
  'leave-order-review': 'solar:chat-square-like-bold-duotone',
};

const TaskCategoriesWidget = ({ categories, isLoading, onOpenTask }: TaskCategoriesWidgetProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent sx={responsivePagePaddingSx}>
        <Stack direction="column" spacing={3}>
          <Stack direction="column" spacing={0.75}>
            <Typography variant="h5" fontWeight={700}>
              {t('kepcoinPage.tasks.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('kepcoinPage.tasks.subtitle')}
            </Typography>
          </Stack>

          {isLoading ? (
            <Stack direction="column" spacing={2}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={84} />
              ))}
            </Stack>
          ) : categories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('kepcoinPage.tasks.empty')}
            </Typography>
          ) : (
            <Stack direction="column" spacing={3}>
              {categories.map((category) => (
                <Stack key={category.slug} direction="column" spacing={1.5}>
                  <Stack direction="column" spacing={0.5}>
                    <Typography variant="h6">{category.title}</Typography>
                    {category.description ? (
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    ) : null}
                  </Stack>

                  <Stack direction="column" spacing={1.25}>
                    {category.tasks.map((task) => (
                      <Stack
                        key={task.slug}
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: 'background.level1',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.main' }}>
                          <IconifyIcon icon={taskIconMap[task.slug] ?? 'solar:checklist-bold-duotone'} />
                        </Avatar>

                        <Stack direction="column" spacing={0.5} flex={1} minWidth={0}>
                          <Typography variant="subtitle2">{task.title}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap title={task.description}>
                            {task.description}
                          </Typography>
                        </Stack>

                        <Stack direction="column" spacing={1} alignItems="flex-end">
                          <KepcoinValue value={task.reward} iconSize={16} spacing={0.5} textVariant="caption" fontWeight={700} />
                          {task.status === 'completed' ? (
                            <Chip size="small" color="success" label={t('kepcoinPage.tasks.completed')} />
                          ) : task.status === 'blocked' ? (
                            <Chip size="small" color="warning" label={t('kepcoinPage.tasks.blocked')} />
                          ) : null}
                          <Button
                            size="small"
                            variant={task.status === 'completed' ? 'outlined' : 'contained'}
                            onClick={() => onOpenTask(task)}
                          >
                            {task.status === 'completed' ? t('kepcoinPage.tasks.view') : t('kepcoinPage.tasks.open')}
                          </Button>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCategoriesWidget;
