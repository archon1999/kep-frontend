import { ProjectAttemptLog, ProjectAttemptsPage } from '../entities/project.entity';

export interface ProjectAttemptsRepository {
  list(params: { projectId: number; page?: number; hackathonId?: number; username?: string }): Promise<ProjectAttemptsPage>;
  getLog(attemptId: number): Promise<ProjectAttemptLog>;
  submitAttempt(params: { slug: string; technology: string; file: File; hackathonId?: number; projectSymbol?: string }): Promise<void>;
  rerun(attemptId: number): Promise<void>;
}
