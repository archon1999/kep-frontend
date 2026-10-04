import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { Test } from 'modules/testing/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface TestDetailHeaderProps {
  test: Test;
  questionsCount: number;
}

const TestDetailHeader = ({ test, questionsCount }: TestDetailHeaderProps) => {
  const { t } = useTranslation();

  const description = useMemo(
    () =>
      new DOMParser().parseFromString(test.description || '', 'text/html').body.textContent?.trim(),
    [test.description],
  );
  const durationParts = test.duration.split(':').map(Number);
  const seconds =
    durationParts.length === 3 && durationParts.every(Number.isFinite)
      ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]
      : 0;
  const duration =
    seconds > 0
      ? seconds % 60 === 0
        ? t('tests.durationMinutes', { count: seconds / 60 })
        : t('tests.durationSeconds', { count: seconds })
      : test.duration || '—';
  const metadata = [
    {
      icon: 'material-symbols:quiz-outline-rounded',
      label: t('tests.questionsCount', { count: questionsCount }),
    },
    { icon: 'material-symbols:schedule-rounded', label: duration },
    ...(test.passesCount !== undefined
      ? [
          {
            icon: 'material-symbols:person-outline-rounded',
            label: `${test.passesCount} ${t('tests.passes').toLocaleLowerCase()}`,
          },
        ]
      : []),
  ];

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1.25} alignItems="center">
        <Avatar
          src={test.chapter.icon}
          alt=""
          variant="rounded"
          sx={{ width: 32, height: 32, bgcolor: 'transparent', '& img': { objectFit: 'contain' } }}
        >
          <IconifyIcon icon="material-symbols:menu-book-outline-rounded" fontSize={24} />
        </Avatar>
        <Typography variant="body2" color="text.secondary">
          {test.chapter.title}
        </Typography>
      </Stack>

      <Typography component="h1" variant="h5" sx={{ overflowWrap: 'anywhere' }}>
        {test.title}
      </Typography>

      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
        {test.difficultyTitle && (
          <Chip
            size="small"
            variant="soft"
            color={
              test.difficulty === 1
                ? 'success'
                : test.difficulty === 2
                  ? 'warning'
                  : test.difficulty === 3
                    ? 'error'
                    : 'neutral'
            }
            label={test.difficultyTitle}
            sx={{ height: 24, fontWeight: 500 }}
          />
        )}
        {metadata.map(({ icon, label }) => (
          <Stack key={icon} direction="row" gap={0.5} alignItems="center" color="text.secondary">
            <IconifyIcon icon={icon} fontSize={16} aria-hidden />
            <Typography variant="caption">{label}</Typography>
          </Stack>
        ))}
      </Stack>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}
        >
          {description}
        </Typography>
      )}
      {test.tags?.length > 0 && (
        <Box role="group" aria-label={t('tests.tags')}>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {test.tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                variant="soft"
                color="neutral"
                sx={{ height: 24, fontWeight: 500 }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default TestDetailHeader;
