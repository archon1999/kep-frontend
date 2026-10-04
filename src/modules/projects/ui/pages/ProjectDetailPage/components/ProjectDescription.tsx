import { useTranslation } from 'react-i18next';
import { Divider, Stack, Typography } from '@mui/material';
import { Project } from 'modules/projects/domain/entities/project.entity';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import ProjectDetailsAccordion from './ProjectDetailsAccordion';
import ProjectDetailsSection from './ProjectDetailsSection';

interface ProjectDescriptionProps {
  project: Project;
}

const ProjectDescription = ({ project }: ProjectDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" gap={4} sx={{ mb: 4 }}>
      {project.description ? (
        <ProjectDetailsSection title={t('projects.overview')} description={project.description} />
      ) : null}

      <Stack direction="column" gap={1}>
        <Typography variant="subtitle1" fontWeight={700}>
          {t('projects.tasks')}
        </Typography>
        <Stack direction="column" divider={<Divider flexItem />}>
          {project.tasks.length ? (
            project.tasks.map((task) => (
              <ProjectDetailsAccordion
                key={task.number}
                id={`project-${project.id}-task-${task.number}`}
                title={
                  <Stack
                    component="span"
                    direction="row"
                    gap={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <span>
                      {task.number}. {task.title}
                    </span>
                    <KepcoinValue
                      component="span"
                      value={task.kepcoinValue}
                      iconSize={16}
                      sx={{ display: 'inline-flex', flexShrink: 0 }}
                    />
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
        <Typography variant="subtitle1" fontWeight={700}>
          {t('projects.technologies')}
        </Typography>
        <Stack direction="column" divider={<Divider flexItem />}>
          {project.availableTechnologies.map((technology, index) => (
            <ProjectDetailsAccordion
              key={technology.technology}
              id={`project-${project.id}-technology-${index}`}
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
