import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Stack, type SxProps, type Theme, Typography } from '@mui/material';
import { Project, ProjectTask } from 'modules/projects/domain/entities/project.entity';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ProjectDetailsAccordion from './ProjectDetailsAccordion';
import ProjectDetailsSection from './ProjectDetailsSection';

interface ProjectDescriptionProps {
  project: Project;
  idPrefix?: string;
  renderTaskReward?: (task: ProjectTask) => ReactNode;
  sx?: SxProps<Theme>;
}

const ProjectDescription = ({
  project,
  idPrefix = `project-${project.id}`,
  renderTaskReward,
  sx = [],
}: ProjectDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" gap={4} sx={[{ mb: 4 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {project.description ? (
        <ProjectDetailsSection title={t('projects.overview')} description={project.description} />
      ) : null}

      <Stack direction="column" gap={1}>
        <Typography component="h2" variant="h6">
          {t('projects.tasks')}
        </Typography>
        <Stack direction="column" divider={<Divider flexItem />}>
          {project.tasks.length ? (
            project.tasks.map((task) => (
              <ProjectDetailsAccordion
                key={task.number}
                id={`${idPrefix}-task-${task.number}`}
                title={
                  <Stack
                    component="span"
                    direction="row"
                    gap={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack
                      component="span"
                      direction="row"
                      gap={1.5}
                      alignItems="baseline"
                      sx={{ minWidth: 0 }}
                    >
                      <Typography
                        component="span"
                        variant="metric"
                        color="primary.main"
                        sx={{ fontSize: 18, flexShrink: 0 }}
                      >
                        {String(task.number).padStart(2, '0')}
                      </Typography>
                      <span>{task.title}</span>
                    </Stack>
                    {renderTaskReward ? (
                      renderTaskReward(task)
                    ) : (
                      <KepcoinValue
                        component="span"
                        value={task.kepcoinValue}
                        iconSize={16}
                        sx={{ display: 'inline-flex', flexShrink: 0 }}
                      />
                    )}
                  </Stack>
                }
                description={task.description}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('projects.noTasks')}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack direction="column" gap={1}>
        <Typography component="h2" variant="h6">
          {t('projects.technologies')}
        </Typography>
        <Stack direction="column" divider={<Divider flexItem />}>
          {project.availableTechnologies.map((technology, index) => (
            <ProjectDetailsAccordion
              key={technology.technology}
              id={`${idPrefix}-technology-${index}`}
              title={technology.technology}
              description={technology.info}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProjectDescription;
