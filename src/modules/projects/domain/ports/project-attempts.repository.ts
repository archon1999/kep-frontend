import { ProjectAttempt, ProjectAttemptLog, ProjectAttemptsPage } from '../entities/project.entity';

export interface ProjectAttemptsRepository {
  list(params: { projectId?: number; page?: number; pageSize?: number; hackathonId?: number; username?: string }): Promise<ProjectAttemptsPage>;
  listAll(params: { projectId?: number; pageSize?: number; hackathonId?: number; username?: string }): Promise<ProjectAttempt[]>;
  getLog(attemptId: number): Promise<ProjectAttemptLog>;
  submitAttempt(params: { slug: string; technology: string; file: File; hackathonId?: number; projectSymbol?: string }): Promise<void>;
  rerun(attemptId: number): Promise<void>;
}
