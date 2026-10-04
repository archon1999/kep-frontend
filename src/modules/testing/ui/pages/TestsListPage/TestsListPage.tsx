import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useTestsCatalog } from 'modules/testing/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StyledTextField from 'shared/components/styled/StyledTextField';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import ChapterTestsList, { ChapterTestsListSkeleton } from './components/ChapterTestsList';
import TestsDataGrid from './components/TestsDataGrid';
import TestsDataGridSkeleton from './components/TestsDataGridSkeleton';
import TopicCard from './components/TopicCard';
import TopicCardSkeleton from './components/TopicCardSkeleton';

const topicGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(3, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))',
    lg: 'repeat(5, minmax(0, 1fr))',
  },
  gap: { xs: 2, md: 3 },
};

const TestsListPage = () => {
  const { t } = useTranslation();
  const { currentUser, isAuthLoading } = useAuth();
  const {
    data: tests = [],
    isLoading: isCatalogLoading,
    error,
    mutate,
  } = useTestsCatalog(currentUser?.username, !isAuthLoading);
  const isLoading = isAuthLoading || isCatalogLoading;
  const completion = useMemo(
    () =>
      Object.fromEntries(
        tests
          .filter((test) => typeof test.userCompleted === 'boolean')
          .map((test) => [test.id, test.userCompleted!]),
      ),
    [tests],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const chapterParam = searchParams.get('chapter');
  const parsedChapterId = chapterParam && /^\d+$/.test(chapterParam) ? Number(chapterParam) : 0;
  const chapterId =
    Number.isSafeInteger(parsedChapterId) && parsedChapterId > 0 ? parsedChapterId : 0;
  const [view, setView] = useState('topics');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState(0);

  useEffect(() => {
    setSearch('');
    setDifficulty(0);
  }, [chapterId]);

  const chapters = useMemo(() => {
    const grouped = new Map<
      number,
      { id: number; title: string; icon: string; count: number; completed: number }
    >();
    tests.forEach((test) => {
      const chapter = grouped.get(test.chapter.id);
      const completed = completion?.[test.id] ? 1 : 0;
      if (chapter) {
        chapter.count += 1;
        chapter.completed += completed;
      } else grouped.set(test.chapter.id, { ...test.chapter, count: 1, completed });
    });
    return [...grouped.values()].sort((a, b) => a.id - b.id);
  }, [tests, completion]);
  const selectedChapter = chapters.find((chapter) => chapter.id === chapterId);
  const showTopics = view === 'topics' && !search.trim() && !chapterId;
  const difficulties = useMemo(
    () =>
      [...new Map(tests.map((test) => [test.difficulty, test.difficultyTitle])).entries()].sort(
        ([a], [b]) => a - b,
      ),
    [tests],
  );
  const filteredTests = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const filtered = tests.filter(
      (test) =>
        (!chapterId || test.chapter.id === chapterId) &&
        (!difficulty || test.difficulty === difficulty) &&
        (!query ||
          [
            test.title,
            test.description,
            test.chapter.title,
            ...(test.tags ?? []).map((tag) => tag.name),
          ].some((value) => value.toLocaleLowerCase().includes(query))),
    );
    return filtered.sort((a, b) => a.chapter.id - b.chapter.id || a.id - b.id);
  }, [tests, chapterId, difficulty, search]);
  const resetFilters = () => {
    setSearch('');
    setDifficulty(0);
    if (searchParams.has('chapter')) {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.delete('chapter');
        return next;
      });
    }
  };
  const openTopics = () => {
    resetFilters();
    setView('topics');
  };
  const resultsCount = (
    <Chip
      aria-live="polite"
      size="small"
      variant="soft"
      color="neutral"
      icon={<IconifyIcon icon="material-symbols:assignment-outline-rounded" />}
      label={t('tests.testCount', { count: filteredTests.length })}
      sx={{ height: 26, '& .MuiChip-icon': { fontSize: 15 } }}
    />
  );

  return (
    <Paper
      elevation={0}
      sx={{ ...responsivePagePaddingSx, outline: 0, minHeight: 'calc(100vh - 180px)' }}
    >
      <Container maxWidth={chapterId ? 'md' : 'lg'} disableGutters>
        <Stack spacing={{ xs: 3, md: 4 }}>
          {!chapterId && (
            <>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'center' }}
                justifyContent="space-between"
                gap={2}
              >
                <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                  <Typography component="h1" variant="h4">
                    {t('tests.title')}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {isLoading ? (
                      <>
                        <Skeleton variant="rounded" width={88} height={28} />
                        <Skeleton variant="rounded" width={96} height={28} />
                      </>
                    ) : (
                      <>
                        <Chip
                          size="small"
                          variant="soft"
                          color="neutral"
                          icon={<IconifyIcon icon="material-symbols:quiz-outline-rounded" />}
                          label={t('tests.testCount', { count: tests.length })}
                          sx={{ height: 28, '& .MuiChip-icon': { fontSize: 16 } }}
                        />
                        <Chip
                          size="small"
                          variant="soft"
                          color="neutral"
                          icon={<IconifyIcon icon="material-symbols:folder-outline-rounded" />}
                          label={t('tests.chapterCount', { count: chapters.length })}
                          sx={{ height: 28, '& .MuiChip-icon': { fontSize: 16 } }}
                        />
                      </>
                    )}
                  </Stack>
                </Stack>
                <DebouncedTextField
                  placeholder={t('tests.searchPlaceholder')}
                  value={search}
                  onValueChange={setSearch}
                  fullWidth
                  sx={{ maxWidth: { sm: 360 } }}
                  slotProps={{
                    htmlInput: { 'aria-label': t('tests.searchPlaceholder') },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:search-rounded" fontSize={20} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
              <Tabs
                value={view}
                onChange={(_, value) => {
                  setView(value);
                  resetFilters();
                }}
                aria-label={t('tests.title')}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Tab value="topics" label={t('tests.chapters')} onClick={openTopics} />
                <Tab value="tests" label={t('tests.allTests')} />
              </Tabs>
            </>
          )}
          {chapterId > 0 && (
            <Button
              color="neutral"
              onClick={openTopics}
              startIcon={<IconifyIcon icon="material-symbols:arrow-back-rounded" fontSize={17} />}
              sx={{ alignSelf: 'flex-start', px: 0, py: 0, fontSize: 14 }}
            >
              {t('tests.chapters')}
            </Button>
          )}
          {error ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" onClick={() => mutate()}>
                  {t('tests.retry')}
                </Button>
              }
            >
              {t('tests.catalogLoadError')}
            </Alert>
          ) : isLoading ? (
            <Stack role="status" aria-label={t('tests.loading')} spacing={2}>
              {!showTopics && (
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems={{ md: 'flex-end' }}
                  justifyContent="space-between"
                  gap={2}
                  aria-hidden="true"
                >
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    {chapterId > 0 && <Skeleton variant="rounded" width={48} height={48} />}
                    <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                      {(chapterId > 0 || search.trim()) && <Skeleton width={190} height={32} />}
                      <Skeleton variant="rounded" width={82} height={26} />
                    </Stack>
                  </Stack>
                  <Skeleton variant="rounded" height={44} sx={{ width: { xs: 1, sm: 190 } }} />
                </Stack>
              )}
              {chapterId ? (
                <ChapterTestsListSkeleton />
              ) : showTopics ? (
                <Box sx={topicGridSx}>
                  {Array.from({ length: 10 }, (_, index) => (
                    <TopicCardSkeleton key={index} />
                  ))}
                </Box>
              ) : (
                <TestsDataGridSkeleton showChapter />
              )}
            </Stack>
          ) : showTopics ? (
            <Stack spacing={2}>
              <Box sx={topicGridSx}>
                {chapters.map((chapter) => (
                  <TopicCard
                    key={chapter.id}
                    chapter={chapter}
                    onClick={() => {
                      setSearchParams((previous) => {
                        const next = new URLSearchParams(previous);
                        next.set('chapter', String(chapter.id));
                        return next;
                      });
                    }}
                  />
                ))}
                {chapters.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t('tests.emptyTitle')}
                  </Typography>
                )}
              </Box>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ md: 'flex-end' }}
                justifyContent="space-between"
                gap={2}
              >
                <Stack spacing={1.5} sx={{ minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
                    {selectedChapter && (
                      <Avatar
                        src={selectedChapter.icon}
                        alt=""
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          flexShrink: 0,
                          bgcolor: 'transparent',
                          '& img': { objectFit: 'contain' },
                        }}
                      >
                        <IconifyIcon icon="material-symbols:folder-outline-rounded" fontSize={28} />
                      </Avatar>
                    )}
                    <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                      {(chapterId > 0 || search.trim()) && (
                        <Typography
                          component={chapterId ? 'h1' : 'h2'}
                          variant={chapterId ? 'h5' : 'h6'}
                          fontWeight={600}
                        >
                          {selectedChapter?.title ||
                            (chapterId
                              ? `${t('tests.chapters')} #${chapterId}`
                              : t('tests.searchResults'))}
                        </Typography>
                      )}
                      {resultsCount}
                    </Stack>
                  </Stack>
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{ width: { xs: 1, md: 'auto' }, flexShrink: 0 }}
                >
                  <StyledTextField
                    select
                    value={difficulty}
                    onChange={(event) => {
                      setDifficulty(Number(event.target.value));
                    }}
                    sx={{ flex: 1, minWidth: 0, width: { sm: 190 } }}
                    slotProps={{ select: { inputProps: { 'aria-label': t('tests.difficulty') } } }}
                  >
                    <MenuItem value={0}>{t('tests.allDifficulties')}</MenuItem>
                    {difficulties.map(([value, title]) => (
                      <MenuItem key={value} value={value}>
                        {title}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Stack>
              </Stack>
              {!filteredTests.length ? (
                <Stack alignItems="flex-start" spacing={1.5} sx={{ py: 5 }}>
                  <Typography variant="h6">
                    {t(tests.length || chapterId ? 'tests.noMatches' : 'tests.emptyTitle')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      tests.length || chapterId ? 'tests.noMatchesSubtitle' : 'tests.emptySubtitle',
                    )}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (selectedChapter) {
                        setSearch('');
                        setDifficulty(0);
                      } else resetFilters();
                    }}
                  >
                    {t('tests.resetFilters')}
                  </Button>
                </Stack>
              ) : chapterId ? (
                <ChapterTestsList tests={filteredTests} completion={completion} />
              ) : (
                <TestsDataGrid
                  tests={filteredTests}
                  showChapter={!chapterId}
                  isFiltered={Boolean(search.trim() || chapterId || difficulty)}
                  completion={completion}
                />
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </Paper>
  );
};
export default TestsListPage;
