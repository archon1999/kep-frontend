import { useTranslation } from 'react-i18next';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { type HackathonProject } from 'modules/hackathons/domain';
import ProjectDetailsAccordion from 'modules/projects/ui/pages/ProjectDetailPage/components/ProjectDetailsAccordion';
import ProjectDetailsSection from 'modules/projects/ui/pages/ProjectDetailPage/components/ProjectDetailsSection';

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
    <Stack
      direction="column"
      spacing={3}
      sx={{
        '& .MuiAccordionSummary-root': { minHeight: 48, py: 1 },
        '& .MuiAccordionSummary-root .MuiTypography-root': {
          fontSize: 'subtitle1.fontSize',
          fontWeight: 500,
        },
      }}
    >
      {project.description ? (
        <Box sx={{ typography: 'body2', maxWidth: '85ch' }}>
          <ProjectDetailsSection title={t('projects.overview')} description={project.description} />
        </Box>
      ) : null}

      <Stack direction="column" spacing={1}>
        <Typography component="h2" variant="subtitle1" fontWeight={700}>
          {t('projects.tasks')}
        </Typography>

        <Stack direction="column" divider={<Divider flexItem />}>
          {project.tasks.length ? (
            project.tasks.map((task) => (
              <ProjectDetailsAccordion
                key={task.number}
                id={`hackathon-project-${hackathonProject.id}-task-${task.number}`}
                title={
                  <Stack
                    component="span"
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ minWidth: 0, overflowWrap: 'anywhere' }}
                  >
                    <Box component="span" sx={{ fontSize: 'subtitle1.fontSize', fontWeight: 500 }}>
                      {task.number}. {task.title}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        color: 'text.secondary',
                        fontSize: 'caption.fontSize',
                        fontWeight: 400,
                        flexShrink: 0,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {taskPointsByNumber.get(task.number) ?? 0} {t('hackathons.pointsUnit')}
                    </Box>
                  </Stack>
                }
                description={task.description}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              {t('projects.noTasks')}
            </Typography>
          )}
        </Stack>
      </Stack>

      {project.availableTechnologies.length ? (
        <Stack direction="column" spacing={1}>
          <Typography component="h2" variant="subtitle1" fontWeight={700}>
            {t('projects.technologies')}
          </Typography>
          <Stack direction="column" divider={<Divider flexItem />}>
            {project.availableTechnologies.map((technology, index) => (
              <ProjectDetailsAccordion
                key={technology.technology}
                id={`hackathon-project-${hackathonProject.id}-technology-${index}`}
                title={technology.technology}
                description={technology.info}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default HackathonProjectDescription;
