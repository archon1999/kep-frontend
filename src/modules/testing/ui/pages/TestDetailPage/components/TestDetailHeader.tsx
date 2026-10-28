import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { Test } from 'modules/testing/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';

const TestDetailHeader = ({ test, questionsCount }: { test: Test; questionsCount: number }) => {
  const { t, i18n } = useTranslation();
  const description = useMemo(
    () =>
      new DOMParser().parseFromString(test.description || '', 'text/html').body.textContent?.trim(),
    [test.description],
  );
  const [hours = 0, minutes = 0, seconds = 0] = test.duration.split(':').map(Number);
  const total = hours * 3600 + minutes * 60 + seconds;
  const duration =
    total > 0
      ? total % 60 === 0
        ? t('tests.durationMinutes', { count: total / 60 })
        : t('tests.durationSeconds', { count: total })
      : test.duration || '—';
  const stats = [
    {
      icon: 'mdi:help-box-multiple-outline',
      label: t('tests.questions'),
      value: questionsCount.toLocaleString(i18n.language),
    },
    { icon: 'mdi:clock-outline', label: t('tests.durationLabel'), value: duration },
    ...(test.passesCount !== undefined
      ? [
          {
            icon: 'mdi:account-outline',
            label: t('tests.passes'),
            value: test.passesCount.toLocaleString(i18n.language),
          },
        ]
      : []),
  ];
  return (
    <Box
      component="section"
      sx={{ p: 'var(--kep-content-inset)', borderBottom: '1px solid var(--kep-line)' }}
    >
      <Stack direction="row" gap={1.25} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          src={test.chapter.icon}
          alt=""
          variant="square"
          sx={{ width: 36, height: 36, bgcolor: 'transparent', '& img': { objectFit: 'contain' } }}
        >
          <IconifyIcon icon="mdi:book-open-outline" />
        </Avatar>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--kep-display-font)',
            fontWeight: 500,
            fontSize: 20,
            flex: 1,
            minWidth: 0,
          }}
        >
          <MixedText>{test.chapter.title}</MixedText>
        </Typography>
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
          />
        )}
      </Stack>
      <Box
        component="dl"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(' + stats.length + ',minmax(0,1fr))',
          gap: 2,
          m: 0,
          mb: 2.5,
        }}
      >
        {stats.map((s) => (
          <Box key={s.label} sx={{ minWidth: 0 }}>
            <Stack
              component="dt"
              direction="row"
              gap={0.75}
              alignItems="center"
              sx={{ mb: 1, color: 'text.secondary' }}
            >
              <IconifyIcon icon={s.icon} sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography component="span" variant="label" sx={{ fontSize: 11 }}>
                {s.label}
              </Typography>
            </Stack>
            <Typography component="dd" variant="metric" sx={{ m: 0, fontSize: { xs: 21, sm: 27 } }}>
              {s.value}
            </Typography>
          </Box>
        ))}
      </Box>
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
        <Stack
          role="group"
          aria-label={t('tests.tags')}
          direction="row"
          gap={1}
          flexWrap="wrap"
          sx={{ mt: 2 }}
        >
          {test.tags.map((tag) => (
            <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
          ))}
        </Stack>
      )}
    </Box>
  );
};
export default TestDetailHeader;
