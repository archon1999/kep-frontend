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
  title: string;
  points: number;
  descriptionShort: string;
  description: string;
  tasks: Array<ProjectTask>;
  availableTechnologies: Array<ProjectAvailableTechnology>;
  level: number;
  levelTitle: string;
  tags: Array<any>;
  inThePipeline: boolean;
  purchaseKepcoinValue: number;
  logo: string;
  purchased: boolean;
}

export interface ProjectAttempt {
  id: number;
  username: string;
  technology: string;
  projectId: number;
  projectTitle: string;
  points: number;
  verdict: number;
  verdictTitle: string;
  time: number;
  memory: number;
  created: string;
}

export interface ProjectAttemptTaskLog {
  taskNumber: number;
  taskTitle: string;
  log: string;
  done: boolean;
}
