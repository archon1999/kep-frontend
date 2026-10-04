import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import { GridPaginationModel } from '@mui/x-data-grid';
import { useAuth } from 'app/providers/AuthProvider';
import { useProjectAttempts } from 'modules/projects/application/queries';
import { Project } from 'modules/projects/domain/entities/project.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { booleanFlagParam, numberParam } from 'shared/lib/queryParams';
import { wsService } from 'shared/services/websocket';
import ProjectAttemptsTable from './ProjectAttemptsTable.tsx';

interface ProjectAttemptsProps {
  project: Project;
  hackathonId?: number;
}

const ProjectAttempts = ({ project, hackathonId }: ProjectAttemptsProps) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { state, setField, patchState } = useRouteQueryState({
    defaults: {
      page: 1,
      pageSize: 10,
      showMine: Boolean(currentUser),
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: 'attemptsPage',
      },
      showMine: {
        ...booleanFlagParam(),
        serialize: (value) => (value ? '1' : '0'),
        param: 'myAttempts',
      },
      pageSize: { ...numberParam({ min: 10, max: 50 }), param: 'attemptsPageSize' },
    },
    historyByKey: {
      page: 'push',
    },
  });
  const page = state.page;
  const showMine = state.showMine;

  useEffect(() => {
    if (!currentUser) {
      setField('showMine', false);
    }
  }, [currentUser, setField]);

  const { data, isLoading, error, mutate } = useProjectAttempts(project.id, {
    page,
    pageSize: state.pageSize,
    username: showMine ? currentUser?.username : undefined,
    hackathonId,
  });

  const attemptIds = useMemo(() => (data?.data ?? []).map((attempt) => attempt.id), [data?.data]);

  useEffect(() => {
    if (!currentUser?.username || !i18n.language) return;

    wsService.send('lang-change', i18n.language);
  }, [currentUser?.username, i18n.language]);

  useEffect(() => {
    if (!currentUser?.username || !attemptIds.length) return undefined;

    attemptIds.forEach((id) => wsService.send('attempt-add', id));

    return () => {
      attemptIds.forEach((id) => wsService.send('attempt-delete', id));
    };
  }, [attemptIds, currentUser?.username]);

  useEffect(() => {
    if (!currentUser?.username) return undefined;

    const unsubscribe = wsService.on<{ id?: number }>('attempt-update', (payload) => {
      if (!payload?.id) return;

      if (attemptIds.includes(payload.id)) {
        mutate();
      }
    });

    return unsubscribe;
  }, [attemptIds, currentUser?.username, mutate]);

  const handlePaginationChange = (model: GridPaginationModel) => {
    patchState({
      page: model.pageSize !== state.pageSize ? 1 : model.page + 1,
      pageSize: model.pageSize,
    });
  };

  const handleToggleMine = () => {
    patchState({ showMine: !showMine, page: 1 });
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
      >
        {currentUser && (
          <>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <OnlyMeSwitch
                label={t('projects.myAttempts')}
                checked={showMine}
                onChange={handleToggleMine}
                switchSize="medium"
              />
            </Box>
            <Button
              size="small"
              variant={showMine ? 'soft' : 'text'}
              color={showMine ? 'primary' : 'inherit'}
              startIcon={
                <IconifyIcon
                  icon={showMine ? 'mdi:account-check-outline' : 'mdi:account-outline'}
                />
              }
              aria-pressed={showMine}
              onClick={handleToggleMine}
              sx={{
                display: { xs: 'inline-flex', sm: 'none' },
                minHeight: 36,
                px: 1.25,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t('projects.myAttempts')}
            </Button>
          </>
        )}
        <Tooltip title={t('problems.detail.refresh')}>
          <Button
            onClick={() => void mutate()}
            aria-label={t('problems.detail.refresh')}
            variant="soft"
            color="neutral"
            size="large"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, ml: 'auto' }}
          >
            <IconifyIcon icon="mdi:reload" />
          </Button>
        </Tooltip>
        <Tooltip title={t('problems.detail.refresh')}>
          <IconButton
            onClick={() => void mutate()}
            aria-label={t('problems.detail.refresh')}
            size="small"
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, ml: 'auto', width: 36, height: 36 }}
          >
            <IconifyIcon icon="mdi:reload" />
          </IconButton>
        </Tooltip>
      </Stack>

      {error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => mutate()}>{t('projects.retry')}</Button>}
        >
          {t('projects.attemptsLoadError')}
        </Alert>
      ) : null}

      {!error || data ? (
        <ProjectAttemptsTable
          project={project}
          attempts={data?.data}
          isLoading={isLoading}
          scoreMode={hackathonId ? 'hackathon' : 'kepcoin'}
          onRerun={() => mutate()}
          total={data?.total ?? 0}
          paginationModel={{ page: page - 1, pageSize: state.pageSize }}
          onPaginationChange={handlePaginationChange}
        />
      ) : null}
    </Stack>
  );
};

export default ProjectAttempts;
