export interface ProjectTask {
  number: number;
  title: string;
  description: string;
  kepcoinValue: number;
}

export interface ProjectAvailableTechnology {
  technology: string;
  info: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  descriptionShort?: string;
  description?: string;
  tasks: ProjectTask[];
  availableTechnologies: ProjectAvailableTechnology[];
  level: number;
  levelTitle: string;
  tags?: string[];
  inThePipeline?: boolean;
  purchaseKepcoinValue: number;
  kepcoins?: number;
  logo?: string;
  purchased: boolean;
}

export interface ProjectAttemptLogTask {
  taskNumber?: number;
  taskTitle?: string;
  log?: string;
  done?: boolean;
}

export interface ProjectAttemptLog {
  log?: string;
  tasks?: ProjectAttemptLogTask[];
}

export interface ProjectAttempt {
  id: number;
  username: string;
  userAvatar: string;
  technology: string;
  projectId: number;
  projectSlug: string;
  projectTitle: string;
  projectKepcoins?: number;
  kepcoins?: number;
  verdict?: number;
  verdictTitle: string;
  time?: number;
  memory?: number;
  taskNumber?: number;
  created?: string;
  log?: string;
}

export interface ProjectAttemptsPage {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: ProjectAttempt[];
}
