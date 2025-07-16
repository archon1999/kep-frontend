import { Project } from '@projects/domain/entities/project';

export interface HackathonProject {
  id: number;
  symbol: string;
  project: Project;
}
