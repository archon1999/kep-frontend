import { Project } from 'modules/projects/domain/entities/project.entity';

export interface HackathonProjectResult {
  symbol: string;
  points: number;
  hackathonTime?: string;
}

export interface HackathonProject {
  id: number;
  symbol: string;
  project: Project;
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
