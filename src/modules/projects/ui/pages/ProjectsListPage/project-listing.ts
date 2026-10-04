import { Project, ProjectAttempt } from 'modules/projects/domain/entities/project.entity';
import { decodeHtmlEntities } from 'shared/lib/html';

export type ProjectCategoryKey = 'frontend' | 'backend' | 'python' | 'devops';

export const PROJECT_PAGE_SIZE = 10;

export const PROJECT_SORT_OPTIONS = ['default', 'level', 'reward', 'title'] as const;
export const PROJECT_STATUS_OPTIONS = ['all', 'notStarted', 'started', 'completed'] as const;

export interface ProjectListFilters {
  search: string;
  category: 'all' | ProjectCategoryKey;
  level: number;
  status: (typeof PROJECT_STATUS_OPTIONS)[number];
  sort: (typeof PROJECT_SORT_OPTIONS)[number];
}

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
    icon: string;
    labelKey: string;
    subtitleKey: string;
  }
> = {
  frontend: {
    icon: 'mdi:monitor-cellphone-star',
    labelKey: 'projects.categories.frontend.title',
    subtitleKey: 'projects.categories.frontend.subtitle',
  },
  backend: {
    icon: 'mdi:server-security',
    labelKey: 'projects.categories.backend.title',
    subtitleKey: 'projects.categories.backend.subtitle',
  },
  python: {
    icon: 'mdi:language-python',
    labelKey: 'projects.categories.python.title',
    subtitleKey: 'projects.categories.python.subtitle',
  },
  devops: {
    icon: 'mdi:console-network-outline',
    labelKey: 'projects.categories.devops.title',
    subtitleKey: 'projects.categories.devops.subtitle',
  },
};

const FRONTEND_TECHNOLOGIES = new Set(['Frontend', 'Angular']);
const BACKEND_TECHNOLOGIES = new Set(['Django', 'FastAPI', 'NodeJS']);

export const getProjectCategory = (project: Project): ProjectCategoryKey => {
  const technologies = project.availableTechnologies.map((technology) => technology.technology);

  if (
    project.fileAccept === '.json' ||
    technologies.includes('Text') ||
    project.slug.startsWith('devops-')
  ) {
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

export const stripProjectDescription = (value?: string) => {
  const stripped = decodeHtmlEntities(value ?? '').replace(/<[^>]+>/g, ' ');
  const text =
    typeof DOMParser === 'undefined'
      ? stripped
      : (new DOMParser().parseFromString(stripped, 'text/html').body.textContent ?? '');
  return text.replace(/\s+/g, ' ').trim();
};

export const filterAndSortProjects = (
  projects: Project[],
  filters: ProjectListFilters,
  progressLookup: Record<number, ProjectProgressSummary>,
) => {
  const search = filters.search.trim().toLocaleLowerCase();
  const filtered = projects.filter((project) => {
    if (filters.category !== 'all' && getProjectCategory(project) !== filters.category)
      return false;
    if (filters.level && project.level !== filters.level) return false;

    const progress = progressLookup[project.id];
    if (filters.status === 'notStarted' && progress?.attemptCount) return false;
    if (filters.status === 'started' && (!progress?.attemptCount || progress.completed))
      return false;
    if (filters.status === 'completed' && !progress?.completed) return false;

    return (
      !search ||
      [
        project.title,
        stripProjectDescription(project.descriptionShort),
        ...(project.tags ?? []),
        ...project.availableTechnologies.map((technology) => technology.technology),
      ]
        .join(' ')
        .toLocaleLowerCase()
        .includes(search)
    );
  });

  return filtered.sort((left, right) => {
    if (filters.sort === 'level') return left.level - right.level;
    if (filters.sort === 'reward') return (right.kepcoins ?? 0) - (left.kepcoins ?? 0);
    if (filters.sort === 'title') return left.title.localeCompare(right.title);
    return 0;
  });
};

export const buildProjectProgressLookup = (
  projects: Project[],
  attempts?: ProjectAttempt[],
): Record<number, ProjectProgressSummary> => {
  const totalsByProjectId = Object.fromEntries(
    projects.map((project) => [project.id, Number(project.kepcoins ?? 0)]),
  ) as Record<number, number>;

  const summaries: Record<number, ProjectProgressSummary> = {};

  for (const attempt of attempts ?? []) {
    const totalKepcoins = Number(
      attempt.projectKepcoins ?? totalsByProjectId[attempt.projectId] ?? 0,
    );
    const earnedKepcoins = Number(attempt.kepcoins ?? 0);
    const current = summaries[attempt.projectId];
    const currentBest = current?.earnedKepcoins ?? -1;
    const nextBest = Math.max(currentBest, earnedKepcoins);
    const progressPercent =
      totalKepcoins > 0 ? Math.min(100, Math.round((nextBest / totalKepcoins) * 100)) : 0;

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
