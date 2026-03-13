import type {
  ApiProjectAttemptsList200,
  ProjectAttemptList,
  ProjectDetail,
  ProjectList,
  ProjectTask,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  Project,
  ProjectAttempt,
  ProjectAttemptLog,
  ProjectAttemptLogTask,
  ProjectAttemptsPage,
  ProjectAvailableTechnology,
  ProjectTask as DomainProjectTask,
} from '../../domain/entities/project.entity';

const toBoolean = (value?: string | boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
  return false;
};

const toNumber = (value?: string | number) => {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const mapTasks = (tasks?: readonly ProjectTask[]): DomainProjectTask[] =>
  (tasks ?? []).map((task) => ({
    number: task.number,
    title: task.title,
    description: task.description,
    kepcoinValue: task.kepcoinValue,
  }));

const mapTechnologies = (
  technologies?: readonly ProjectAvailableTechnology[],
): ProjectAvailableTechnology[] =>
  (technologies ?? []).map((technology) => ({
    technology: technology.technology,
    info: technology.info,
  }));

export const mapProjectListToDomain = (project: ProjectList): Project => ({
  id: project.id ?? 0,
  slug: project.slug,
  title: project.title,
  descriptionShort: project.descriptionShort,
  description: undefined,
  tasks: [],
  availableTechnologies: mapTechnologies(project.availableTechnologies),
  level: project.level,
  levelTitle: project.levelTitle,
  tags: project.tags?.map((tag) => tag.name),
  inThePipeline: project.inThePipeline,
  purchaseKepcoinValue: project.purchaseKepcoinValue,
  kepcoins: toNumber(project.kepcoins),
  logo: project.logo,
  purchased: toBoolean(project.purchased),
});

export const mapProjectDetailToDomain = (project: ProjectDetail): Project => ({
  id: project.id ?? 0,
  slug: project.slug,
  title: project.title,
  descriptionShort: undefined,
  description: project.description,
  tasks: mapTasks(project.tasks),
  availableTechnologies: mapTechnologies(project.availableTechnologies),
  level: project.level,
  levelTitle: project.levelTitle,
  tags: project.tags?.map((tag) => tag.name),
  inThePipeline: project.inThePipeline,
  purchaseKepcoinValue: project.purchaseKepcoinValue,
  kepcoins: toNumber(project.kepcoins),
  logo: project.logo,
  purchased: toBoolean(project.purchased),
});

export const mapProjectAttemptToDomain = (attempt: ProjectAttemptList): ProjectAttempt => ({
  id: attempt.id ?? 0,
  username: attempt.username,
  userAvatar: attempt.userAvatar,
  technology: attempt.technology,
  projectId: attempt.projectId,
  projectSlug: attempt.projectSlug,
  projectTitle: attempt.projectTitle,
  projectKepcoins: toNumber(attempt.projectKepcoins),
  kepcoins: toNumber(attempt.kepcoins),
  verdict: attempt.verdict,
  verdictTitle: attempt.verdictTitle,
  time: attempt.time,
  memory: attempt.memory,
  taskNumber: attempt.taskNumber,
  created: attempt.created,
  log: attempt.log,
});

const mapAttemptLogTask = (task?: any): ProjectAttemptLogTask | undefined => {
  if (!task) return undefined;
  return {
    taskNumber: task.taskNumber ?? task.task_number,
    taskTitle: task.taskTitle ?? task.task_title,
    log: task.log,
    done: task.done,
  };
};

export const mapAttemptLogToDomain = (
  attempt: ProjectAttemptList & { tasks?: any[] },
): ProjectAttemptLog => ({
  log: attempt.log,
  tasks: attempt.tasks?.map(mapAttemptLogTask).filter(Boolean) as ProjectAttemptLogTask[] | undefined,
});

export const mapAttemptsPageToDomain = (page: ApiProjectAttemptsList200): ProjectAttemptsPage => ({
  page: page.page,
  pageSize: page.pageSize,
  count: page.count,
  total: page.total,
  pagesCount: page.pagesCount,
  data: (page.data ?? []).map(mapProjectAttemptToDomain),
});
