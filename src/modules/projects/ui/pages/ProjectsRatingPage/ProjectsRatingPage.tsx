import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentInsetSx } from 'app/theme/styles/content';
import { useProjectsRatingPage } from 'modules/projects/application/hooks/useProjectsRatingPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import EmptyState from 'shared/components/common/EmptyState';
import { ListToolbar } from 'shared/components/sections/common/FramedListPage';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ProjectsRatingTable from './components/ProjectsRatingTable';

const ProjectsRatingPage = () => {
  const { t } = useTranslation();
  const { query, search, currentUser, paginationModel, onPaginationModelChange } =
    useProjectsRatingPage();
  const empty = !query.isLoading && !query.error && !query.data?.data.length;

  return (
    <FramedPage>
      <PageHeader title={t('projects.rating.title')} backTo={resources.Projects} />
      <Box sx={{ ...contentInsetSx, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="label" color="text.secondary" component="p" sx={{ mb: 1 }}>
          {t('projects.rating.maximum')}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={{ xs: 2, sm: 4 }} sx={{ mb: 1.5 }}>
          {[
            ['junior', 100],
            ['juniorPlus', 200],
            ['middle', 300],
          ].map(([level, points]) => (
            <Stack key={level} direction="row" gap={1} alignItems="baseline">
              <Typography variant="body2" color="text.secondary">
                {t(`projects.rating.levels.${level}`)}
              </Typography>
              <Typography variant="metric" sx={{ fontSize: 22 }}>
                {points}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
      <ListToolbar>
        <TextField
          size="small"
          value={search.value}
          onChange={(event) => search.setValue(event.target.value)}
          onCompositionStart={() => search.setIsComposing(true)}
          onCompositionEnd={() => search.setIsComposing(false)}
          placeholder={t('projects.rating.search')}
          slotProps={{
            htmlInput: { 'aria-label': t('projects.rating.search') },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="mdi:magnify" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: '100%', sm: 360 } }}
        />
      </ListToolbar>
      {query.error ? (
        <Box sx={contentInsetSx}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" onClick={() => void query.mutate()}>
                {t('common.retry')}
              </Button>
            }
          >
            {t('common.loadFailed')}
          </Alert>
        </Box>
      ) : empty ? (
        <EmptyState
          kind="competitions"
          title={t(
            search.value.trim() ? 'projects.rating.emptySearchTitle' : 'projects.rating.emptyTitle',
          )}
          description={t(
            search.value ? 'projects.rating.emptySearch' : 'projects.rating.emptyDescription',
          )}
          action={
            search.value ? (
              <Button onClick={() => search.setValue('')}>{t('projects.clearFilters')}</Button>
            ) : undefined
          }
        />
      ) : (
        <ProjectsRatingTable
          rows={query.data?.data ?? []}
          total={query.data?.total ?? 0}
          loading={query.isLoading}
          currentUsername={currentUser?.username}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
        />
      )}
    </FramedPage>
  );
};

export default ProjectsRatingPage;
