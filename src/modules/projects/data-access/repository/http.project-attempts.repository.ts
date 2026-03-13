import { projectsApiClient } from '../api/projects.client.ts';
import { mapAttemptLogToDomain, mapAttemptsPageToDomain } from '../mappers/project.mapper.ts';
import { ProjectAttemptLog, ProjectAttemptsPage } from '../../domain/entities/project.entity';
import { ProjectAttemptsRepository } from '../../domain/ports/project-attempts.repository';

export class HttpProjectAttemptsRepository implements ProjectAttemptsRepository {
  async list(params: { projectId?: number; page?: number; hackathonId?: number; username?: string }): Promise<ProjectAttemptsPage> {
    const response = await projectsApiClient.listAttempts({
      project_id: params.projectId ? params.projectId.toString() : undefined,
      username: params.username,
      page: params.page,
      hackathon_id: params.hackathonId?.toString(),
    });

    return mapAttemptsPageToDomain(response);
  }

  async getLog(attemptId: number): Promise<ProjectAttemptLog> {
    const response = await projectsApiClient.getAttemptLog(attemptId.toString());
    return mapAttemptLogToDomain(response);
  }

  async submitAttempt(params: { slug: string; technology: string; file: File; hackathonId?: number; projectSymbol?: string }): Promise<void> {
    await projectsApiClient.submitAttempt(params.slug, params.technology, params.file, params.hackathonId, params.projectSymbol);
  }

  async rerun(attemptId: number): Promise<void> {
    await projectsApiClient.rerunAttempt(attemptId.toString());
  }
}
