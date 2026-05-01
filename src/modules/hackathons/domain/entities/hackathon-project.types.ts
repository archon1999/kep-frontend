import { Project } from 'modules/projects/domain/entities/project.entity';

export interface HackathonProjectTaskPoint {
  taskNumber: number;
  points: number;
}

export interface HackathonProjectResult {
  symbol: string;
  points: number;
  hackathonTime?: string;
}

export interface HackathonProject {
  id: number;
  symbol: string;
  project: Project;
  maxPoints?: number;
  taskPoints?: HackathonProjectTaskPoint[];
}

export interface HackathonStanding {
  username: string;
  userAvatar?: string;
  userFullName?: string;
  points: number;
  rank?: number;
  projectResults?: HackathonProjectResult[];
}

export interface HackathonRegistrant {
  username: string;
  userAvatar?: string;
  userFullName?: string;
}
