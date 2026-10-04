import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Chip, Link, Skeleton, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { Test } from 'modules/testing/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface ChapterTestsListProps {
  tests: Test[];
  completion?: Record<number, boolean>;
}

const INITIAL_TEST_COUNT = 7;

const getDurationSeconds = (duration: string) => {
  const parts = duration.split(':').map(Number);
  return parts.length === 3 && parts.every(Number.isFinite)
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : 0;
};

export const ChapterTestsListSkeleton = () => (
  <Stack gap={1} aria-hidden="true">
    {Array.from({ length: 4 }, (_, index) => (
      <Stack
        key={index}
        direction="row"
        alignItems="center"
        gap={{ xs: 1.5, sm: 2 }}
        sx={{ p: { xs: 2, sm: 2.5 }, minHeight: { sm: 112 } }}
      >
        <Skeleton
          variant="rounded"
          width={52}
          height={52}
          sx={{ display: { xs: 'none', sm: 'block' }, flexShrink: 0, borderRadius: 2 }}
        />
        <Stack gap={0.75} sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton width="65%" height={25} />
          <Skeleton width="85%" height={20} />
          <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
            <Skeleton width={64} height={18} />
            <Skeleton width={54} height={18} />
            <Skeleton variant="rounded" width={64} height={24} />
            <Skeleton width={32} height={18} sx={{ display: { xs: 'block', sm: 'none' } }} />
          </Stack>
        </Stack>
        <Stack
          gap={0.25}
          alignItems="flex-end"
          sx={{ width: 104, flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}
        >
          <Skeleton width={72} height={18} />
          <Skeleton width={44} height={24} />
        </Stack>
        <Skeleton variant="circular" width={22} height={22} sx={{ flexShrink: 0 }} />
      </Stack>
    ))}
  </Stack>
);

const ChapterTestsList = ({ tests, completion }: ChapterTestsListProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [tests]);

  const descriptions = useMemo(() => {
    const parser = new DOMParser();
    return new Map(
      tests.map((test) => [
        test.id,
        parser.parseFromString(test.description || '', 'text/html').body.textContent?.trim() || '',
      ]),
    );
  }, [tests]);

  const formatDuration = (duration: string) => {
    const seconds = getDurationSeconds(duration);
    return seconds > 0
      ? seconds % 60 === 0
        ? t('tests.durationMinutes', { count: seconds / 60 })
        : t('tests.durationSeconds', { count: seconds })
      : duration || '—';
  };

  const renderScore = (test: Test, compact = false) => {
    const result = test.userBestResult ?? 0;
    const questionCount = test.questionsCount ?? test.questions?.length ?? 0;
    const hasResult = result > 0 || completion?.[test.id] === true;
    const perfect = hasResult && questionCount > 0 && result === questionCount;

    return (
      <Stack
        gap={0.25}
        sx={
          compact
            ? { display: { xs: 'flex', sm: 'none' } }
            : {
                display: { xs: 'none', sm: 'flex' },
                width: 104,
                flexShrink: 0,
                alignItems: 'flex-end',
              }
        }
      >
        {!compact && hasResult && (
          <Typography variant="caption" color="text.secondary">
            {t('tests.bestResult')}
          </Typography>
        )}
        {hasResult ? (
          <Stack direction="row" alignItems="center" gap={0.5}>
            {perfect && (
              <IconifyIcon
                icon="material-symbols:check-rounded"
                fontSize={16}
                sx={{ color: 'success.main' }}
              />
            )}
            <Typography
              variant={compact ? 'caption' : 'body1'}
              fontWeight={600}
              color={perfect ? 'success.main' : 'text.primary'}
              aria-label={`${t('tests.bestResult')}: ${result}/${questionCount}`}
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {result}
              <Box
                component="span"
                sx={{ color: perfect ? 'success.main' : 'text.secondary', fontWeight: 400 }}
              >
                /{questionCount}
              </Box>
            </Typography>
          </Stack>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {t(completion?.[test.id] === false ? 'tests.notPassed' : 'tests.noScore')}
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <Stack gap={2} sx={{ minWidth: 0 }}>
      <Stack component="ol" gap={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {(expanded ? tests : tests.slice(0, INITIAL_TEST_COUNT)).map((test, index) => {
          const questionCount = test.questionsCount ?? test.questions?.length ?? 0;
          const description = descriptions.get(test.id);

          return (
            <Box component="li" key={test.id} data-chapter-test-id={test.id}>
              <Link
                component={RouterLink}
                to={getResourceById(resources.Test, test.id)}
                underline="none"
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  minWidth: 0,
                  minHeight: { sm: 112 },
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'background.elevation1' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                    bgcolor: 'background.elevation1',
                  },
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    width: { xs: 40, sm: 52 },
                    height: { xs: 40, sm: 52 },
                    bgcolor: 'background.elevation1',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color="text.secondary"
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                </Box>

                <Stack gap={0.75} sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    component="h2"
                    variant="subtitle1"
                    fontWeight={600}
                    data-test-title
                    sx={{ fontSize: 17, lineHeight: 1.45, overflowWrap: 'anywhere' }}
                  >
                    {test.title}
                  </Typography>
                  {description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {description}
                    </Typography>
                  )}
                  <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                    <Typography variant="caption" color="text.secondary">
                      {t('tests.questionsCount', { count: questionCount })}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <IconifyIcon
                        icon="material-symbols:schedule-rounded"
                        fontSize={14}
                        sx={{ color: 'text.secondary' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDuration(test.duration)}
                      </Typography>
                    </Stack>
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
                      label={test.difficultyTitle || t('tests.difficulty')}
                      sx={{ height: 24, maxWidth: '100%', fontWeight: 500 }}
                    />
                    {renderScore(test, true)}
                  </Stack>
                </Stack>

                {renderScore(test)}
                <IconifyIcon
                  icon="material-symbols:chevron-right-rounded"
                  fontSize={22}
                  sx={{ flexShrink: 0, color: 'text.secondary' }}
                />
              </Link>
            </Box>
          );
        })}
      </Stack>
      {tests.length > INITIAL_TEST_COUNT && (
        <Button
          size="small"
          onClick={() => setExpanded((previous) => !previous)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {expanded
            ? t('tests.showLessTests')
            : t('tests.showMoreTests', { count: tests.length - INITIAL_TEST_COUNT })}
        </Button>
      )}
    </Stack>
  );
};

export default ChapterTestsList;
