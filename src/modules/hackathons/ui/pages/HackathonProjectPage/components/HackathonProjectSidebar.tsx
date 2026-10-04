import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, MenuItem, Stack, Typography } from '@mui/material';
import { getResourceById, getResourceByParams, resources } from 'app/routes/resources';
import { useSubmitHackathonProject } from 'modules/hackathons/application';
import { type Hackathon, type HackathonProject, HackathonStatus } from 'modules/hackathons/domain';
import { HackathonStatusChip, formatHackathonDateTime } from 'modules/hackathons/ui/shared';
import ProjectFileUpload from 'modules/projects/ui/pages/ProjectDetailPage/components/ProjectFileUpload';
import {
  isProjectFileAccepted,
  resolveProjectFileAccept,
} from 'modules/projects/ui/shared/lib/upload';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StyledTextField from 'shared/components/styled/StyledTextField';
import { toast } from 'sonner';

interface HackathonProjectSidebarProps {
  hackathonProject: HackathonProject;
  hackathon?: Hackathon;
  onSubmitted?: () => void;
}

const MAX_FILE_SIZE = 1024 * 1024;

const HackathonProjectSidebar = ({
  hackathonProject,
  hackathon,
  onSubmitted,
}: HackathonProjectSidebarProps) => {
  const { t } = useTranslation();
  const project = hackathonProject.project;
  const { trigger: submitHackathonProject, isMutating: isSubmitting } = useSubmitHackathonProject();
  const [selectedTechnology, setSelectedTechnology] = useState(
    project.availableTechnologies[0]?.technology ?? '',
  );
  const [file, setFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState(false);

  const technologyOptions = project.availableTechnologies.map(
    (technology) => technology.technology,
  );
  const fileAccept = resolveProjectFileAccept(project.fileAccept);
  const canSubmit = hackathon?.status === HackathonStatus.ALREADY && hackathon.isRegistered;
  const hasFinished = hackathon?.status === HackathonStatus.FINISHED;
  const needsRegistration = !hackathon?.isRegistered;

  const handleFileSelect = (uploadedFile: File) => {
    if (uploadedFile.size > MAX_FILE_SIZE) {
      toast.error(t('projects.maxFileSize'));
      return;
    }
    if (!isProjectFileAccepted(uploadedFile, fileAccept)) {
      toast.error(t('projects.invalidFileType', { accept: fileAccept }));
      return;
    }
    setFile(uploadedFile);
    setSubmitError(false);
  };

  const handleSubmit = async () => {
    if (!file || !selectedTechnology || !hackathon || !canSubmit || isSubmitting) return;
    setSubmitError(false);
    try {
      await submitHackathonProject({
        slug: project.slug,
        technology: selectedTechnology,
        file,
        hackathonId: hackathon.id,
        projectSymbol: hackathonProject.symbol,
      });
      setFile(null);
      onSubmitted?.();
      toast.success(t('projects.submitSuccess'));
    } catch {
      setSubmitError(true);
    }
  };

  if (!hackathon) return null;

  if (!canSubmit) {
    return (
      <Stack direction="column" spacing={2} sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t(
            hasFinished
              ? 'hackathons.finishedSubmissionTitle'
              : needsRegistration
                ? 'hackathons.registerToSubmitTitle'
                : 'hackathons.submissionsLive',
          )}
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
            variant="soft"
            color="neutral"
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('hackathons.goToProject')}
          </Button>
        ) : needsRegistration ? (
          <Button
            component={RouterLink}
            to={getResourceById(resources.Hackathon, hackathon.id)}
            variant="soft"
            color="neutral"
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
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      sx={{ height: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <Stack direction="column" spacing={2.5} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
          <HackathonStatusChip hackathon={hackathon} />
          <Typography variant="caption" color="text.secondary">
            {t('hackathons.endsAt')}: {formatHackathonDateTime(hackathon.finishTime)}
          </Typography>
        </Stack>
        <StyledTextField
          id="hackathon-project-technology"
          select
          fullWidth
          size="small"
          label={t('projects.technology')}
          value={selectedTechnology}
          disabled={isSubmitting || !technologyOptions.length}
          onChange={(event) => setSelectedTechnology(event.target.value)}
        >
          {technologyOptions.map((technology) => (
            <MenuItem key={technology} value={technology}>
              {technology}
            </MenuItem>
          ))}
        </StyledTextField>
        <Stack direction="column" spacing={1}>
          <Typography variant="caption" fontWeight={500} sx={{ ml: 1.5 }}>
            {t('projects.file')}
          </Typography>
          <ProjectFileUpload
            file={file}
            fileAccept={fileAccept}
            disabled={isSubmitting}
            onSelect={handleFileSelect}
            onRemove={() => {
              setFile(null);
              setSubmitError(false);
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {t('projects.uploadRequirements', { accept: fileAccept })}
          </Typography>
        </Stack>
        {submitError ? <Alert severity="error">{t('projects.submitError')}</Alert> : null}
      </Stack>
      <Box
        component="footer"
        sx={{
          p: 2,
          pb: 'max(16px, env(safe-area-inset-bottom))',
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.elevation1',
          flexShrink: 0,
        }}
      >
        <Button
          type="submit"
          fullWidth
          variant="contained"
          startIcon={<IconifyIcon icon="mdi:send-outline" />}
          loading={isSubmitting}
          disabled={!file || !selectedTechnology}
        >
          {t(isSubmitting ? 'projects.submitting' : 'projects.submit')}
        </Button>
      </Box>
    </Box>
  );
};

export default HackathonProjectSidebar;
