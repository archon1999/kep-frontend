import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { Project } from '../../domain/entities/project.entity';

interface ProjectDescriptionProps {
  project: Project;
}

const ProjectDescription = ({ project }: ProjectDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        {project.logo ? (
          <Box
            component="img"
            src={project.logo}
            alt={project.title}
            sx={{
              width: 56,
              height: 56,
              objectFit: 'contain',
              borderRadius: 2,
              bgcolor: 'background.neutral',
            }}
          />
        ) : null}

        <Stack direction="column" spacing={0.5}>
          <Typography variant="h4" fontWeight={700}>
            {project.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
            <IconifyIcon icon="mdi:rocket-launch-outline" />
            <Typography variant="body2" fontWeight={600}>
              {t('projects.levelLabel', { level: project.levelTitle })}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {project.description ? (
        <Typography
          variant="body1"
          component="div"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
      ) : null}

      <Divider />

      <Stack direction="column" spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          {t('projects.tasks')}
        </Typography>
        <Stack direction="column" spacing={1.5}>
          {project.tasks.map((task) => (
            <Accordion key={task.number} disableGutters>
              <AccordionSummary expandIcon={<IconifyIcon icon="mdi:chevron-down" />}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width={1}
                  spacing={2}
                >
                  <Typography fontWeight={700}>
                    {task.number}. {task.title}
                  </Typography>
                  <KepcoinValue value={task.kepcoinValue} />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  component="div"
                  variant="body2"
                  color="text.secondary"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Stack>

      <Stack direction="column" spacing={2}>
        <Typography variant="h6" fontWeight={700}>
          {t('projects.technologies')}
        </Typography>
        <Stack direction="column" spacing={1.5}>
          {project.availableTechnologies.map((technology) => (
            <Accordion key={technology.technology} disableGutters>
              <AccordionSummary expandIcon={<IconifyIcon icon="mdi:chevron-down" />}>
                <Typography fontWeight={700}>{technology.technology}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  component="div"
                  variant="body2"
                  color="text.secondary"
                  dangerouslySetInnerHTML={{ __html: technology.info }}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProjectDescription;
