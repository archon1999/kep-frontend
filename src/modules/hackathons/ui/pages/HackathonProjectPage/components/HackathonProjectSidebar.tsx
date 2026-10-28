import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { getResourceById, getResourceByParams, resources } from 'app/routes/resources';
import { type Hackathon, type HackathonProject, HackathonStatus } from 'modules/hackathons/domain';
import { HackathonStatusChip, formatHackathonDateTime } from 'modules/hackathons/ui/shared';
import ProjectSubmissionForm from 'modules/projects/ui/shared/components/ProjectSubmissionForm';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';

interface HackathonProjectSidebarProps {
  hackathonProject: HackathonProject;
  hackathon?: Hackathon;
  onSubmitted?: () => void;
}

const HackathonProjectSidebar = ({
  hackathonProject,
  hackathon,
  onSubmitted,
}: HackathonProjectSidebarProps) => {
  const { t } = useTranslation();
  const project = hackathonProject.project;
  const canSubmit = hackathon?.status === HackathonStatus.ALREADY && hackathon.isRegistered;
  const hasFinished = hackathon?.status === HackathonStatus.FINISHED;
  const needsRegistration = !hackathon?.isRegistered;

  if (!hackathon) return null;

  if (!canSubmit) {
    return (
      <Stack
        direction="column"
        spacing={2}
        sx={{ p: { xs: 2.5, md: 3 }, minHeight: 0, overflowY: 'auto' }}
      >
        <PatternArtwork kind="hackathon" sx={{ width: 200, alignSelf: 'center' }} />
        <Typography variant="h6" sx={{ fontFamily: 'var(--kep-display-font)' }}>
          <MixedText>
            {t(
              hasFinished
                ? 'hackathons.finishedSubmissionTitle'
                : needsRegistration
                  ? 'hackathons.registerToSubmitTitle'
                  : 'hackathons.submissionsLive',
            )}
          </MixedText>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(
            hasFinished
              ? 'hackathons.finishedSubmissionBody'
              : needsRegistration
                ? 'hackathons.registerToSubmitBody'
                : 'hackathons.beforeStartLead',
          )}
        </Typography>
        {hasFinished ? (
          <Button
            component={RouterLink}
            to={getResourceByParams(resources.Project, { slug: project.slug })}
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('hackathons.goToProject')}
          </Button>
        ) : needsRegistration ? (
          <Button
            component={RouterLink}
            to={getResourceById(resources.Hackathon, hackathon.id)}
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('hackathons.goToOverview')}
          </Button>
        ) : hackathon.startTime ? (
          <Typography variant="body2">
            {t('hackathons.startsAt')}: {formatHackathonDateTime(hackathon.startTime)}
          </Typography>
        ) : null}
      </Stack>
    );
  }

  return (
    <ProjectSubmissionForm
      key={`${hackathon.id}:${hackathonProject.symbol}`}
      project={project}
      hackathonId={hackathon.id}
      projectSymbol={hackathonProject.symbol}
      onSubmitted={onSubmitted}
    >
      <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
        <HackathonStatusChip hackathon={hackathon} />
        <Typography variant="caption" color="text.secondary">
          {t('hackathons.endsAt')}: {formatHackathonDateTime(hackathon.finishTime)}
        </Typography>
      </Stack>
    </ProjectSubmissionForm>
  );
};
export default HackathonProjectSidebar;
