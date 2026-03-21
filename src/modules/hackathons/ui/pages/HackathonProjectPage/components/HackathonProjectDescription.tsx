import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { type HackathonProject } from 'modules/hackathons/domain';
import { getHackathonProjectPoints, HackathonPointsBadge } from 'modules/hackathons/ui/shared';
import IconifyIcon from 'shared/components/base/IconifyIcon';

interface HackathonProjectDescriptionProps {
  hackathonProject: HackathonProject;
}

const HackathonProjectDescription = ({ hackathonProject }: HackathonProjectDescriptionProps) => {
  const { t } = useTranslation();
  const project = hackathonProject.project;
  const taskPointsByNumber = new Map(
    (hackathonProject.taskPoints ?? []).map((item) => [item.taskNumber, item.points]),
  );

  return (
    <Stack direction="column" spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        {project.logo ? (
          <Box
            component="img"
            src={project.logo}
            alt={project.title}
            sx={{
              width: 64,
              height: 64,
              objectFit: 'contain',
              borderRadius: 3,
              bgcolor: 'background.neutral',
            }}
          />
        ) : null}

        <Stack direction="column" spacing={1} flex={1}>
          <Typography variant="h3" fontWeight={800}>
            {project.title}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} alignItems="center">
            <Chip label={`${t('hackathons.projectSymbol')}: ${hackathonProject.symbol}`} size="small" variant="outlined" />
            <HackathonPointsBadge value={getHackathonProjectPoints(hackathonProject)} color="primary" />
            <Chip label={project.levelTitle} color="success" size="small" />
          </Stack>
        </Stack>
      </Stack>

      {project.description ? (
        <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: project.description }} />
      ) : null}

      <Divider />

      <Stack direction="column" spacing={2}>
        <Typography variant="h6" fontWeight={800}>
          {t('projects.tasks')}
        </Typography>

        <Stack direction="column" spacing={1.5}>
          {project.tasks.map((task) => (
            <Accordion key={task.number} disableGutters>
              <AccordionSummary expandIcon={<IconifyIcon icon="mdi:chevron-down" />}>
                <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center" width={1}>
                  <Typography fontWeight={700}>
                    {task.number}. {task.title}
                  </Typography>
                  <HackathonPointsBadge value={taskPointsByNumber.get(task.number) ?? 0} color="primary" />
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
        <Typography variant="h6" fontWeight={800}>
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

export default HackathonProjectDescription;
