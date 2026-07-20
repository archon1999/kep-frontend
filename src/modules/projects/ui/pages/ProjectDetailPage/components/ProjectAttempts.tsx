import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Pagination, Stack } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch.tsx';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { booleanFlagParam, numberParam } from 'shared/lib/queryParams';
import { wsService } from 'shared/services/websocket';
import { useProjectAttempts } from 'modules/projects/application/queries';
import { Project } from 'modules/projects/domain/entities/project.entity';
import ProjectAttemptsTable from './ProjectAttemptsTable.tsx';

interface ProjectAttemptsProps {
  project: Project;
  hackathonId?: number;
}

const ProjectAttempts = ({ project, hackathonId }: ProjectAttemptsProps) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { state, setField } = useRouteQueryState({
    defaults: {
      page: 1,
      showMine: Boolean(currentUser),
    },
    schema: {
      page: {
        ...numberParam({ min: 1 }),
        param: 'attemptsPage',
      },
      showMine: {
        ...booleanFlagParam(),
        param: 'myAttempts',
      },
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

  const { data, isLoading, mutate } = useProjectAttempts(project.id, {
    page,
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

  const handlePageChange = (_: any, value: number) => {
    setField('page', value);
  };

  const handleToggleMine = () => {
    setField('showMine', !showMine);
    setField('page', 1);
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <OnlyMeSwitch
          label={t('projects.myAttempts')}
          checked={showMine}
          onChange={handleToggleMine}
        />
      </Stack>

      <ProjectAttemptsTable
        project={project}
        attempts={data?.data}
        isLoading={isLoading}
        scoreMode={hackathonId ? 'hackathon' : 'kepcoin'}
        onRerun={() => mutate()}
      />

      <Box display="flex" justifyContent="flex-end">
        <Pagination
          shape="rounded"
          count={data?.pagesCount ?? 0}
          page={page}
          color="primary"
          onChange={handlePageChange}
          disabled={!data}
        />
      </Box>
    </Stack>
  );
};

export default ProjectAttempts;
