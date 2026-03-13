import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';
import { projectsQueries } from '../../application/queries';
import { Project } from '../../domain/entities/project.entity';
import ProjectInfoCard from './ProjectInfoCard.tsx';

interface ProjectSidebarProps {
  project: Project;
  onSubmitted?: () => void;
  hackathonId?: number;
  projectSymbol?: string;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

const ProjectSidebar = ({
  project,
  onSubmitted,
  hackathonId,
  projectSymbol,
}: ProjectSidebarProps) => {
  const { t } = useTranslation();
  const [selectedTechnology, setSelectedTechnology] = useState(
    project.availableTechnologies[0]?.technology ?? '',
  );
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const technologyOptions = useMemo(
    () => project.availableTechnologies.map((tech) => tech.technology),
    [project.availableTechnologies],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];

    if (!uploadedFile) return;

    if (uploadedFile.size > MAX_FILE_SIZE) {
      toast.error(t('projects.maxFileSize'));
      return;
    }

    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file || !selectedTechnology) return;

    try {
      setIsSubmitting(true);
      await projectsQueries.attemptsRepository.submitAttempt({
        slug: project.slug,
        technology: selectedTechnology,
        file,
        hackathonId,
        projectSymbol,
      });
      setFile(null);
      onSubmitted?.();
      toast.success(t('projects.submitSuccess'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack direction="column" spacing={3}>
      <ProjectInfoCard project={project} />

      <Card>
        <CardHeader
          title={
            <Typography variant="subtitle1" fontWeight={800}>
              {t('projects.submit')}
            </Typography>
          }
        />
        <CardContent>
          <Stack direction="column" spacing={2}>
            <TextField
              select
              fullWidth
              label={t('projects.technology')}
              value={selectedTechnology}
              onChange={(event) => setSelectedTechnology(event.target.value)}
            >
              {technologyOptions.map((technology) => (
                <MenuItem key={technology} value={technology}>
                  {technology}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                {t('projects.file')}
              </Typography>
              <Button variant="soft" component="label" fullWidth>
                {file?.name ?? t('projects.maxFileSize')}
                <input type="file" hidden accept=".txt" onChange={handleFileChange} />
              </Button>
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 3, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
          >
            {t('projects.submit')}
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
};

export default ProjectSidebar;
