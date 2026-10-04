import { useTranslation } from 'react-i18next';
import { Avatar, Box, Card, CardActionArea, Chip, Stack, Tooltip, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface Props {
  chapter: { id: number; title: string; icon: string; count: number; completed: number };
  onClick: () => void;
}

const TopicCard = ({ chapter, onClick }: Props) => {
  const { t } = useTranslation();
  const progress = chapter.count ? Math.min(chapter.completed / chapter.count, 1) : 0;
  const progressColor = progress === 1 ? 'success.main' : 'warning.main';
  const progressLabel = t('tests.chapterProgress', {
    completed: chapter.completed,
    total: chapter.count,
  });
  return (
    <Card
      elevation={0}
      data-topic-progress={progress}
      sx={{ position: 'relative', borderRadius: 4, outline: 0, bgcolor: 'transparent', height: 1 }}
    >
      <Box
        component="svg"
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          width: 1,
          height: 1,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {progress > 0 && (
          <Box
            component="rect"
            x={1}
            y={1}
            rx={15}
            pathLength={100}
            fill="none"
            stroke="currentColor"
            strokeDasharray={progress === 1 ? undefined : `${progress * 100} 100`}
            sx={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              color: progressColor,
              strokeWidth: 2,
            }}
          />
        )}
      </Box>
      <CardActionArea
        onClick={onClick}
        aria-label={`${chapter.title}, ${t('tests.testCount', { count: chapter.count })}, ${progressLabel}`}
        sx={{
          height: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          '&:hover': { bgcolor: 'background.elevation1' },
        }}
      >
        <Stack
          component="figure"
          justifyContent="center"
          alignItems="center"
          sx={{
            m: 0,
            aspectRatio: 1.27,
            width: 1,
            borderRadius: 4,
            bgcolor: 'background.elevation1',
            overflow: 'hidden',
          }}
        >
          <Avatar
            src={chapter.icon}
            alt=""
            variant="rounded"
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              bgcolor: 'transparent',
              color: 'text.secondary',
              '& img': { objectFit: 'contain' },
            }}
          >
            <IconifyIcon icon="material-symbols:folder-outline-rounded" fontSize={64} />
          </Avatar>
        </Stack>
        <Stack spacing={0.75} sx={{ p: 2, flex: 1 }}>
          <Typography component="h2" variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.5 }}>
            {chapter.title}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Chip
              size="small"
              variant="soft"
              color="neutral"
              icon={<IconifyIcon icon="material-symbols:quiz-outline-rounded" />}
              label={t('tests.testCount', { count: chapter.count })}
              sx={{ height: 24, '& .MuiChip-icon': { fontSize: 15 } }}
            />
            {progress > 0 && (
              <Tooltip title={progressLabel}>
                <Typography
                  variant="caption"
                  sx={{ color: progressColor, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}
                >
                  {chapter.completed}/{chapter.count}
                </Typography>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default TopicCard;
