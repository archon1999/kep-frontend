import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { projectsQueries } from 'modules/projects/application/queries';
import { Project } from 'modules/projects/domain/entities/project.entity';
import {
  isProjectFileAccepted,
  resolveProjectFileAccept,
} from 'modules/projects/ui/shared/lib/upload';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import StyledTextField from 'shared/components/styled/StyledTextField';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { toast } from 'sonner';
import ProjectFileUpload from './ProjectFileUpload';

interface ProjectSidebarProps {
  project: Project;
  onSubmitted?: () => void;
  hackathonId?: number;
  projectSymbol?: string;
}

const MAX_FILE_SIZE = 1024 * 1024;

const ProjectSidebar = ({
  project,
  onSubmitted,
  hackathonId,
  projectSymbol,
}: ProjectSidebarProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const [selectedTechnology, setSelectedTechnology] = useState(
    project.availableTechnologies[0]?.technology ?? '',
  );
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const technologyOptions = useMemo(
    () => project.availableTechnologies.map((technology) => technology.technology),
    [project.availableTechnologies],
  );
  const fileAccept = resolveProjectFileAccept(project.fileAccept);

  const clearFile = () => {
    setFile(null);
    setSubmitError(false);
  };

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
    if (!currentUser) {
      redirectToLogin();
      return;
    }
    if (!file || !selectedTechnology || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(false);
    try {
      await projectsQueries.attemptsRepository.submitAttempt({
        slug: project.slug,
        technology: selectedTechnology,
        file,
        hackathonId,
        projectSymbol,
      });
      clearFile();
      onSubmitted?.();
      toast.success(t('projects.submitSuccess'));
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      background={0}
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: { xs: 0, md: undefined },
        borderRadius: { xs: 0, md: undefined },
        boxShadow: { xs: 'none', md: undefined },
      }}
    >
      <CardHeader
        sx={{ py: 0 }}
        title={
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minHeight: 36 }}>
            <IconifyIcon icon="mdi:file-upload-outline" />
            <Typography variant="subtitle2">{t('projects.solution')}</Typography>
          </Stack>
        }
      />
      <Divider />
      <CardContent sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: { xs: 2, sm: 3 } }}>
        <Stack direction="column" gap={2}>
          <StyledTextField
            id="project-submission-technology"
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

          <Stack direction="column" gap={1}>
            <Typography variant="caption" fontWeight={500} sx={{ ml: 1.5 }}>
              {t('projects.file')}
            </Typography>
            <ProjectFileUpload
              file={file}
              fileAccept={fileAccept}
              disabled={isSubmitting}
              onSelect={handleFileSelect}
              onRemove={clearFile}
            />
            <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 0.5 }}>
              <IconifyIcon
                icon="material-symbols:info-outline-rounded"
                sx={{ fontSize: 16, color: 'info.main', flexShrink: 0, mt: 0.25 }}
              />
              <Typography variant="caption" color="info.main">
                {t('projects.uploadRequirements', { accept: fileAccept })}
              </Typography>
            </Stack>
          </Stack>

          {submitError ? <Alert severity="error">{t('projects.submitError')}</Alert> : null}
        </Stack>
      </CardContent>
      <Box
        component="footer"
        sx={{
          p: 2,
          pb: 'max(16px, env(safe-area-inset-bottom))',
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Button
          fullWidth
          variant="contained"
          startIcon={<IconifyIcon icon="mdi:send-outline" />}
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!file || !selectedTechnology}
        >
          {t(isSubmitting ? 'projects.submitting' : 'projects.submit')}
        </Button>
      </Box>
    </Card>
  );
};

export default ProjectSidebar;
