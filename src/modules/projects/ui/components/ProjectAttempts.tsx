import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Pagination, Stack } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import OnlyMeSwitch from 'shared/components/common/OnlyMeSwitch.tsx';
import { wsService } from 'shared/services/websocket';
import { useProjectAttempts } from '../../application/queries';
import { Project } from '../../domain/entities/project.entity';
import ProjectAttemptsTable from './ProjectAttemptsTable.tsx';

interface ProjectAttemptsProps {
  project: Project;
  hackathonId?: number;
}

const ProjectAttempts = ({ project, hackathonId }: ProjectAttemptsProps) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [showMine, setShowMine] = useState(!!currentUser);

  useEffect(() => {
    if (!currentUser) {
      setShowMine(false);
    }
  }, [currentUser]);

  const { data, isLoading, mutate } = useProjectAttempts(project.id, {
    page,
    username: showMine ? currentUser?.username : undefined,
    hackathonId,
  });

  const attemptIds = useMemo(() => (data?.data ?? []).map((attempt) => attempt.id), [data?.data]);

  useEffect(() => {
    if (!i18n.language) return;

    wsService.send('lang-change', i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (!attemptIds.length) return undefined;

    attemptIds.forEach((id) => wsService.send('attempt-add', id));

    return () => {
      attemptIds.forEach((id) => wsService.send('attempt-delete', id));
    };
  }, [attemptIds]);

  useEffect(() => {
    const unsubscribe = wsService.on<{ id?: number }>('attempt-update', (payload) => {
      if (!payload?.id) return;

      if (attemptIds.includes(payload.id)) {
        mutate();
      }
    });

    return unsubscribe;
  }, [attemptIds, mutate]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleToggleMine = () => {
    setPage(1);
    setShowMine((prev) => !prev);
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
