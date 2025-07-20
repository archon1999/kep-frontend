export interface ProjectAttemptLogTaskDto {
  taskNumber: number;
  taskTitle: string;
  log: string;
  done: boolean;
}

export interface ProjectAttemptLogDto {
  log: string;
  tasks: ProjectAttemptLogTaskDto[];
}

export interface ProjectAttemptDto {
  id: number;
  username: string;
  userAvatar: string;
  technology: string;
  projectId: number;
  projectSlug: string;
  projectTitle: string;
  projectKepcoins: number;
  kepcoins: number;
  verdict: number;
  verdictTitle: string;
  time: number;
  memory: number;
  taskNumber: number;
  created: string;
}
