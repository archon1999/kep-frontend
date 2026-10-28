import { type ReactNode, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { useSubmitProjectAttempt } from 'modules/projects/application/mutations';
import { Project } from 'modules/projects/domain/entities/project.entity';
import {
  resolveProjectFileAccept,
  validateProjectFile,
} from 'modules/projects/domain/utils/project-upload';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { toast } from 'sonner';
import ProjectFileUpload from './ProjectFileUpload';

interface ProjectSubmissionFormProps {
  project: Project;
  children?: ReactNode;
  onSubmitted?: () => void;
  hackathonId?: number;
  projectSymbol?: string;
}

const ProjectSubmissionForm = ({
  project,
  onSubmitted,
  hackathonId,
  projectSymbol,
  children,
}: ProjectSubmissionFormProps) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const [selectedTechnology, setSelectedTechnology] = useState(
    project.availableTechnologies[0]?.technology ?? '',
  );
  const [file, setFile] = useState<File | null>(null);
  const { trigger: submit, isMutating: isSubmitting } = useSubmitProjectAttempt();
  const submittingRef = useRef(false);
  const technologyId = useId();
  const [submitError, setSubmitError] = useState(false);

  const technologyOptions = project.availableTechnologies.map(({ technology }) => technology);
  const fileAccept = resolveProjectFileAccept(project.fileAccept);

  const clearFile = () => {
    setFile(null);
    setSubmitError(false);
  };

  const handleFileSelect = (uploadedFile: File) => {
    const error = validateProjectFile(uploadedFile, fileAccept);
    if (error === 'too-large') {
      toast.error(t('projects.maxFileSize'));
      return;
    }

    if (error === 'unsupported-type') {
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
    if (!file || !selectedTechnology || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitError(false);
    try {
      await submit({
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
      submittingRef.current = false;
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
      sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
        <Stack direction="column" gap={2}>
          {children}
          <TextField
            id={technologyId}
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
          </TextField>

          <Stack direction="column" gap={1}>
            <Typography variant="label">{t('projects.file')}</Typography>
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
                sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0, mt: 0.25 }}
              />
              <Typography variant="caption" color="text.secondary">
                {t('projects.uploadRequirements', { accept: fileAccept })}
              </Typography>
            </Stack>
          </Stack>

          {submitError ? <Alert severity="error">{t('projects.submitError')}</Alert> : null}
        </Stack>
      </Box>
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
          type="submit"
          loading={isSubmitting}
          disabled={!file || !selectedTechnology}
        >
          {t(isSubmitting ? 'projects.submitting' : 'projects.submit')}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectSubmissionForm;
