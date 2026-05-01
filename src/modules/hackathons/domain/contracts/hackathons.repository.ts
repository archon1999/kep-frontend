import type { ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import type { Hackathon, HackathonProject, HackathonRegistrant, HackathonStanding } from '../entities';

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
