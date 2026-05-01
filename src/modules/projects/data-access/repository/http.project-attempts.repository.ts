import { projectsApiClient } from '../api/projects.client.ts';
import { mapAttemptLogToDomain, mapAttemptsPageToDomain } from '../mappers/project.mapper.ts';
import { ProjectAttempt, ProjectAttemptLog, ProjectAttemptsPage } from '../../domain/entities/project.entity';
import { ProjectAttemptsRepository } from '../../domain/ports/project-attempts.repository';

export class HttpProjectAttemptsRepository implements ProjectAttemptsRepository {
  async list(params: { projectId?: number; page?: number; pageSize?: number; hackathonId?: number; username?: string }): Promise<ProjectAttemptsPage> {
    const response = await projectsApiClient.listAttempts({
      project_id: params.projectId ? params.projectId.toString() : undefined,
      username: params.username,
      page: params.page,
      pageSize: params.pageSize,
      hackathon_id: params.hackathonId?.toString(),
      ...(params.pageSize ? ({ page_size: params.pageSize } as Record<string, number>) : {}),
    } as never);

    return mapAttemptsPageToDomain(response);
  }

  async listAll(params: { projectId?: number; pageSize?: number; hackathonId?: number; username?: string }): Promise<ProjectAttempt[]> {
    const pageSize = params.pageSize ?? 50;
    const attempts: ProjectAttempt[] = [];
    let page = 1;
    let pagesCount = 1;

    while (page <= pagesCount) {
      const response = await this.list({
        ...params,
        page,
        pageSize,
      });

      attempts.push(...response.data);
      pagesCount = response.pagesCount || 1;
      page += 1;
    }

    return attempts;
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
