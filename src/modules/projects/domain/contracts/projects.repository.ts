import { Project } from '../entities/project.entity';

export interface ProjectsRepository {
  list(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project>;
  purchase(slug: string): Promise<Project>;
}
