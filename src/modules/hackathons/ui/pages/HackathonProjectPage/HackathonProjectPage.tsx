import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useHackathonProjectPage } from 'modules/hackathons/application/hooks/useHackathonProjectPage';
import { HackathonAsyncState } from 'modules/hackathons/ui/shared';
import { WorkspaceRoot } from 'shared/components/sections/common/Workspace';
import HackathonProjectWorkspace from './components/HackathonProjectWorkspace';
import HackathonProjectWorkspaceHeader from './components/HackathonProjectWorkspaceHeader';

const HackathonProjectPage = () => {
  const { t } = useTranslation();
  const {
    id,
    project,
    hackathon,
    hackathonProject,
    canOpenWorkspace,
    isLoading,
    error,
    hasProjectError,
    onRefresh,
  } = useHackathonProjectPage();
  if (project && hackathonProject && hackathon && canOpenWorkspace) {
    return (
      <HackathonProjectWorkspace
        key={`${hackathon.id}:${hackathonProject.symbol}:${project.slug}`}
        hackathonProject={hackathonProject}
        hackathon={hackathon}
        hasError={hasProjectError}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <WorkspaceRoot>
      <HackathonProjectWorkspaceHeader hackathonId={id} />
      <Box component="main" sx={{ p: 3, overflowY: 'auto' }} aria-busy={isLoading}>
        <HackathonAsyncState
          isLoading={isLoading}
          error={error}
          isEmpty={!project || !canOpenWorkspace}
          emptyTitle={t(
            canOpenWorkspace ? 'hackathons.projectUnavailableTitle' : 'hackathons.unavailableTitle',
          )}
          emptyMessage={t(
            canOpenWorkspace
              ? 'hackathons.projectUnavailableMessage'
              : 'hackathons.unavailableMessage',
          )}
          loadingHeight={320}
        />
        {error ? <Button onClick={onRefresh}>{t('common.retry')}</Button> : null}
      </Box>
    </WorkspaceRoot>
  );
};

export default HackathonProjectPage;
