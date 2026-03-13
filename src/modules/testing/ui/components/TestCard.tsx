import { Link as RouterLink } from 'react-router-dom';
import { useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Link, Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getResourceById, resources } from 'app/routes/resources';
import { Test } from '../../domain';

interface Props {
  test: Test;
}

const TestCard = ({ test }: Props) => {
  const { t } = useTranslation();

  const progress = useMemo(() => {
    if (!test.questionsCount || !test.userBestResult) return 0;
    return Math.min(100, (test.userBestResult / test.questionsCount) * 100);
  }, [test.questionsCount, test.userBestResult]);

  return (
    <Paper
      background={1}
      sx={{
        outline: 'none',
        p: 3,
        borderRadius: 3,
      }}
    >
      <Stack direction="column" spacing={2} alignItems="flex-start" justifyContent="space-between">
        <Stack direction="column" spacing={1} sx={{ width: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'background.default',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={test.chapter.icon}
                alt="chapter"
                sx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {test.chapter.title}
            </Typography>
          </Stack>

          <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
            {test.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
            {test.description}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('tests.questionsCount', { count: test.questionsCount ?? test.questions?.length ?? 0 })}
            </Typography>
            <Divider flexItem orientation="vertical" />
            <Typography variant="body2" color="text.secondary">
              {t('tests.duration', { value: test.duration || '—' })}
            </Typography>
            <Divider flexItem orientation="vertical" />
            <Typography variant="body2" color="text.secondary">
              {test.difficultyTitle || t('tests.difficulty')}
            </Typography>
          </Stack>

          <Stack direction="column" spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t('tests.bestResult')}
              </Typography>
              <Typography variant="subtitle2" color="text.primary" fontWeight={700}>
                {test.userBestResult ?? 0}/{test.questionsCount ?? test.questions?.length ?? 0}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 999, bgcolor: 'background.neutral' }}
            />
          </Stack>

          {test.tags?.length ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {test.tags.map((tag) => (
                <Chip key={tag.id} label={tag.name} size="small" />
              ))}
            </Stack>
          ) : null}
        </Stack>

        <Box>
          <Link component={RouterLink} to={getResourceById(resources.Test, test.id)} underline="none">
            <Button variant="text">{t('tests.viewDetails')}</Button>
          </Link>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TestCard;
