import { Project, ProjectAttempt } from '../../domain/entities/project.entity';

export type ProjectCategoryKey = 'frontend' | 'backend' | 'python' | 'devops';

export interface ProjectProgressSummary {
  attemptCount: number;
  earnedKepcoins: number;
  totalKepcoins: number;
  progressPercent: number;
  completed: boolean;
}

export const PROJECT_CATEGORY_ORDER: ProjectCategoryKey[] = [
  'frontend',
  'backend',
  'python',
  'devops',
];

export const PROJECT_CATEGORY_META: Record<
  ProjectCategoryKey,
  {
    accent: string;
    softAccent: string;
    icon: string;
    labelKey: string;
    subtitleKey: string;
  }
> = {
  frontend: {
    accent: '#ff8a00',
    softAccent: '#ffd5a3',
    icon: 'mdi:monitor-cellphone-star',
    labelKey: 'projects.categories.frontend.title',
    subtitleKey: 'projects.categories.frontend.subtitle',
  },
  backend: {
    accent: '#00a7b5',
    softAccent: '#9af1ef',
    icon: 'mdi:server-security',
    labelKey: 'projects.categories.backend.title',
    subtitleKey: 'projects.categories.backend.subtitle',
  },
  python: {
    accent: '#2f9e44',
    softAccent: '#c3f1b2',
    icon: 'mdi:language-python',
    labelKey: 'projects.categories.python.title',
    subtitleKey: 'projects.categories.python.subtitle',
  },
  devops: {
    accent: '#d9480f',
    softAccent: '#ffd0a8',
    icon: 'mdi:console-network-outline',
    labelKey: 'projects.categories.devops.title',
    subtitleKey: 'projects.categories.devops.subtitle',
  },
};

const LEVEL_TASK_COUNTS: Record<number, number> = {
  1: 3,
  2: 4,
  3: 5,
};

const FRONTEND_TECHNOLOGIES = new Set(['Frontend', 'Angular']);
const BACKEND_TECHNOLOGIES = new Set(['Django', 'FastAPI', 'NodeJS']);

export const getProjectCategory = (project: Project): ProjectCategoryKey => {
  const technologies = project.availableTechnologies.map((technology) => technology.technology);

  if (project.fileAccept === '.json' || technologies.includes('Text') || project.slug.startsWith('devops-')) {
    return 'devops';
  }

  if (technologies.includes('Python') || project.slug.startsWith('python-')) {
    return 'python';
  }

  if (technologies.some((technology) => FRONTEND_TECHNOLOGIES.has(technology))) {
    return 'frontend';
  }

  if (technologies.some((technology) => BACKEND_TECHNOLOGIES.has(technology))) {
    return 'backend';
  }

  return 'backend';
};

export const getProjectTaskCount = (project: Project) =>
  project.tasks.length || LEVEL_TASK_COUNTS[project.level] || 0;

export const stripProjectDescription = (value?: string) =>
  (value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const buildProjectProgressLookup = (
  projects: Project[],
  attempts?: ProjectAttempt[],
): Record<number, ProjectProgressSummary> => {
  const totalsByProjectId = Object.fromEntries(
    projects.map((project) => [project.id, Number(project.kepcoins ?? 0)]),
  ) as Record<number, number>;

  const summaries: Record<number, ProjectProgressSummary> = {};

  for (const attempt of attempts ?? []) {
    const totalKepcoins = Number(attempt.projectKepcoins ?? totalsByProjectId[attempt.projectId] ?? 0);
    const earnedKepcoins = Number(attempt.kepcoins ?? 0);
    const current = summaries[attempt.projectId];
    const currentBest = current?.earnedKepcoins ?? -1;
    const nextBest = Math.max(currentBest, earnedKepcoins);
    const progressPercent = totalKepcoins > 0 ? Math.min(100, Math.round((nextBest / totalKepcoins) * 100)) : 0;

    summaries[attempt.projectId] = {
      attemptCount: (current?.attemptCount ?? 0) + 1,
      earnedKepcoins: nextBest,
      totalKepcoins,
      progressPercent,
      completed: totalKepcoins > 0 && nextBest >= totalKepcoins,
    };
  }

  return summaries;
};
