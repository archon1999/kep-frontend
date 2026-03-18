import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'sonner';
import { getResourceById, getResourceByParams, resources } from 'app/routes/resources';
import { projectsQueries } from 'modules/projects/application/queries';
import { Hackathon, HackathonStatus } from '../../domain/entities/hackathon.entity';
import { HackathonProject } from '../../domain/entities/hackathon-project.entity';
import { formatHackathonDateTime, getHackathonProjectPoints } from '../lib/format';
import { formatProjectUploadHint, resolveProjectFileAccept } from 'modules/projects/ui/lib/upload.ts';
import HackathonPointsBadge from './HackathonPointsBadge';

interface HackathonProjectSidebarProps {
  hackathonProject: HackathonProject;
  hackathon?: Hackathon;
  onSubmitted?: () => void;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

const HackathonProjectSidebar = ({
  hackathonProject,
  hackathon,
  onSubmitted,
}: HackathonProjectSidebarProps) => {
  const { t, i18n } = useTranslation();
  const project = hackathonProject.project;
  const [selectedTechnology, setSelectedTechnology] = useState(project.availableTechnologies[0]?.technology ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const technologyOptions = useMemo(
    () => project.availableTechnologies.map((technology) => technology.technology),
    [project.availableTechnologies],
  );
  const fileAccept = useMemo(() => resolveProjectFileAccept(project.fileAccept), [project.fileAccept]);
  const fileLabel = useMemo(
    () => file?.name ?? `${t('projects.file')} ${formatProjectUploadHint(fileAccept)}`,
    [file?.name, fileAccept, t],
  );
  const totalPoints = getHackathonProjectPoints(hackathonProject);

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
    if (!file || !selectedTechnology || !hackathon) return;

    try {
      setIsSubmitting(true);
      await projectsQueries.attemptsRepository.submitAttempt({
        slug: project.slug,
        technology: selectedTechnology,
        file,
        hackathonId: hackathon.id,
        projectSymbol: hackathonProject.symbol,
      });
      setFile(null);
      onSubmitted?.();
      toast.success(t('projects.submitSuccess'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSubmissionCard = () => {
    if (!hackathon) return null;

    if (hackathon.status === HackathonStatus.FINISHED) {
      return (
        <Card>
          <CardHeader
            title={
              <Typography variant="subtitle1" fontWeight={800}>
                {t('hackathons.finishedSubmissionTitle')}
              </Typography>
            }
          />
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t('hackathons.finishedSubmissionBody')}
              </Typography>
              <Button
                component={RouterLink}
                to={getResourceByParams(resources.Project, { slug: project.slug })}
                variant="contained"
              >
                {t('hackathons.goToProject')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      );
    }

    if (!hackathon.isRegistered) {
      return (
        <Card>
          <CardHeader
            title={
              <Typography variant="subtitle1" fontWeight={800}>
                {t('hackathons.registerToSubmitTitle')}
              </Typography>
            }
          />
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t('hackathons.registerToSubmitBody')}
              </Typography>
              <Button component={RouterLink} to={getResourceById(resources.Hackathon, hackathon.id)} variant="outlined">
                {t('hackathons.goToOverview')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      );
    }

    if (hackathon.status === HackathonStatus.NOT_STARTED) {
      return (
        <Card>
          <CardHeader
            title={
              <Typography variant="subtitle1" fontWeight={800}>
                {t('hackathons.submissionsLive')}
              </Typography>
            }
          />
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {t('hackathons.submissionWindow')}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatHackathonDateTime(hackathon.startTime, i18n.language)} -{' '}
                {formatHackathonDateTime(hackathon.finishTime, i18n.language)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader
          title={
            <Typography variant="subtitle1" fontWeight={800}>
              {t('projects.submit')}
            </Typography>
          }
          subheader={t('hackathons.submissionWindow')}
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
                {fileLabel}
                <input type="file" hidden accept={fileAccept} onChange={handleFileChange} />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                {t('projects.maxFileSize')}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 3, pt: 0 }}>
          <Button fullWidth variant="contained" onClick={handleSubmit} disabled={!file || isSubmitting}>
            {t('projects.submit')}
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Stack direction="column" spacing={3}>
      <Card>
        <CardHeader
          title={
            <Typography variant="subtitle1" fontWeight={800}>
              {t('projects.info')}
            </Typography>
          }
        />
        <CardContent>
          <Stack direction="column" spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={700}>
                {t('hackathons.projectSymbol')}
              </Typography>
              <Chip label={hackathonProject.symbol} size="small" variant="outlined" />
            </Stack>

            <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={700}>
                {t('projects.level')}
              </Typography>
              <Chip label={project.levelTitle} color="success" size="small" />
            </Stack>

            <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight={700}>
                {t('hackathons.points')}
              </Typography>
              <HackathonPointsBadge value={totalPoints} color="primary" />
            </Stack>

            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" fontWeight={700}>
                {t('projects.technologies')}
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" rowGap={0.75} justifyContent="flex-end">
                {project.availableTechnologies.map((technology) => (
                  <Chip key={technology.technology} label={technology.technology} size="small" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {renderSubmissionCard()}
    </Stack>
  );
};

export default HackathonProjectSidebar;
