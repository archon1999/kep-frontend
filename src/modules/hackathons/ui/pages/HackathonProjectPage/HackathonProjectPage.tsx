import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Card } from '@mui/material';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import { useHackathon, useHackathonProject } from 'modules/hackathons/application';
import { HackathonAsyncState, HackathonDetailLayout } from 'modules/hackathons/ui/shared';
import HackathonProjectWorkspace from './components/HackathonProjectWorkspace';

const HackathonProjectPage = () => {
  const { t } = useTranslation();
  const { id, symbol } = useParams();
  const {
    data: hackathon,
    isLoading: isHackathonLoading,
    error: hackathonError,
  } = useHackathon(id);
  const { data: hackathonProject, isLoading, error, mutate } = useHackathonProject(id, symbol);
  const project = hackathonProject?.project;
  const canOpenWorkspace = Boolean(
    hackathon && hackathon.id > 0 && hackathon.id === Number(id) && !hackathonError,
  );
  useDocumentTitle(
    project?.title ? 'pageTitles.hackathonProject' : undefined,
    project?.title ? { projectTitle: project.title } : undefined,
  );

  return (
    <HackathonDetailLayout
      hackathon={hackathon}
      isLoading={isHackathonLoading}
      error={hackathonError}
      workspace
    >
      <Card
        background={0}
        sx={{ height: 1, display: 'flex', flexDirection: 'column', minHeight: 0, borderRadius: 3 }}
      >
        {project && canOpenWorkspace && error ? (
          <Box sx={{ px: 3, py: 2, flexShrink: 0 }}>
            <HackathonAsyncState error={error} />
          </Box>
        ) : null}

        <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {project && hackathonProject && hackathon && canOpenWorkspace ? (
            <HackathonProjectWorkspace
              key={`${hackathon.id}:${hackathonProject.symbol}:${project.slug}`}
              hackathonProject={hackathonProject}
              hackathon={hackathon}
              onRefresh={() => void mutate()}
            />
          ) : (
            <Box sx={{ p: 3 }}>
              <HackathonAsyncState
                isLoading={isLoading || isHackathonLoading}
                error={error || hackathonError}
                isEmpty={!project || !canOpenWorkspace}
                emptyTitle={t(
                  canOpenWorkspace
                    ? 'hackathons.projectUnavailableTitle'
                    : 'hackathons.unavailableTitle',
                )}
                emptyMessage={t(
                  canOpenWorkspace
                    ? 'hackathons.projectUnavailableMessage'
                    : 'hackathons.unavailableMessage',
                )}
                loadingHeight={320}
              />
            </Box>
          )}
        </Box>
      </Card>
    </HackathonDetailLayout>
  );
};

export default HackathonProjectPage;
