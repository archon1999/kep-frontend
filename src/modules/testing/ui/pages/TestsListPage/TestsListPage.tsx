import { useTranslation } from 'react-i18next';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentGridSx } from 'app/theme/styles/content';
import { useTestsListPage } from 'modules/testing/application/hooks/useTestsListPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import DebouncedTextField from 'shared/components/common/DebouncedTextField';
import EmptyState from 'shared/components/common/EmptyState';
import BackToListButton from 'shared/components/sections/common/BackToListButton';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import StyledTextField from 'shared/components/styled/StyledTextField';
import ChapterTestsList, { ChapterTestsListSkeleton } from './components/ChapterTestsList';
import TestsDataGrid from './components/TestsDataGrid';
import TestsDataGridSkeleton from './components/TestsDataGridSkeleton';
import TopicCard from './components/TopicCard';
import TopicCardSkeleton from './components/TopicCardSkeleton';

const topicGridSx = {
  ...contentGridSx,
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(3, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))',
    lg: 'repeat(5, minmax(0, 1fr))',
  },
  gap: '1px',
};

const TestsListPage = () => {
  const {
    tests,
    error,
    mutate,
    setSearchParams,
    isLoading,
    completion,
    chapterId,
    chapters,
    selectedChapter,
    showTopics,
    difficulties,
    filteredTests,
    resetFilters,
    openTopics,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    view,
    setView,
  } = useTestsListPage();

  const { t } = useTranslation();
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
    <FramedPage>
      <PageHeader
        title={t('tests.title')}
        variant="detail"
        actionComponent={
          chapterId > 0 ? (
            <BackToListButton
              to={resources.Tests}
              onClick={openTopics}
              label={t('common.backTo', { destination: t('tests.chapters') })}
            />
          ) : undefined
        }
      />
      <Box>
        <Stack spacing={0}>
          {!chapterId && (
            <>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'center' }}
                justifyContent="space-between"
                gap={2}
                sx={{
                  px: 'var(--kep-content-inset)',
                  py: 2.5,
                  borderBottom: '1px solid var(--kep-line)',
                }}
              >
                <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
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
                sx={{ px: 'var(--kep-content-inset)', borderBottom: '1px solid var(--kep-line)' }}
              >
                <Tab value="topics" label={t('tests.chapters')} onClick={openTopics} />
                <Tab value="tests" label={t('tests.allTests')} />
              </Tabs>
            </>
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
            <Stack spacing={0}>
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
                  <EmptyState
                    title={t('tests.emptyTitle')}
                    description={t('tests.emptySubtitle')}
                    sx={{ gridColumn: '1 / -1' }}
                  />
                )}
              </Box>
            </Stack>
          ) : (
            <Stack spacing={0}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ md: 'flex-end' }}
                justifyContent="space-between"
                gap={2}
                sx={{
                  px: 'var(--kep-content-inset)',
                  py: 3,
                  borderBottom: '1px solid var(--kep-line)',
                }}
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
                          component="h2"
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
                <EmptyState
                  kind="search"
                  title={t(tests.length || chapterId ? 'tests.noMatches' : 'tests.emptyTitle')}
                  description={t(
                    tests.length || chapterId ? 'tests.noMatchesSubtitle' : 'tests.emptySubtitle',
                  )}
                  action={
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
                  }
                />
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
      </Box>
    </FramedPage>
  );
};
export default TestsListPage;
