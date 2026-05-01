import { projectsApiClient } from '../api/projects.client.ts';
import { mapProjectDetailToDomain, mapProjectListToDomain } from '../mappers/project.mapper.ts';
import { Project } from '../../domain/entities/project.entity';
import { ProjectsRepository } from '../../domain/ports/projects.repository';

export class HttpProjectsRepository implements ProjectsRepository {
  async list(): Promise<Project[]> {
    const projects = await projectsApiClient.list();
    return (projects ?? []).map(mapProjectListToDomain);
  }

  async getBySlug(slug: string): Promise<Project> {
    const project = await projectsApiClient.getBySlug(slug);
    return mapProjectDetailToDomain(project);
  }

  async purchase(slug: string): Promise<Project> {
    const project = await projectsApiClient.purchase(slug);
    return mapProjectDetailToDomain(project);
  }
}
