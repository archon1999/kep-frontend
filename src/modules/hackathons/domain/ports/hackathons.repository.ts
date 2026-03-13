import { ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Hackathon } from '../entities/hackathon.entity';
import { HackathonProject, HackathonRegistrant, HackathonStanding } from '../entities/hackathon-project.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}

export interface HackathonsRepository {
  list: (params?: ApiHackathonsListParams) => Promise<PageResult<Hackathon>>;
  getById: (id: number | string) => Promise<Hackathon>;
  getProjects: (id: number | string) => Promise<HackathonProject[]>;
  getProjectBySymbol: (id: number | string, symbol: string) => Promise<HackathonProject>;
  register: (id: number | string) => Promise<Hackathon>;
  unregister: (id: number | string) => Promise<void>;
  getRegistrants: (id: number | string) => Promise<HackathonRegistrant[]>;
  getStandings: (id: number | string) => Promise<HackathonStanding[]>;
}
