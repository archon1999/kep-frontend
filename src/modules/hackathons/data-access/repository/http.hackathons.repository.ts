import { ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Hackathon } from '../../domain/entities/hackathon.entity';
import { HackathonProject, HackathonRegistrant, HackathonStanding } from '../../domain/entities/hackathon-project.entity';
import { HackathonsRepository, PageResult } from '../../domain/ports/hackathons.repository';
import { hackathonsApiClient } from '../api/hackathons.client';
import {
  mapHackathon,
  mapHackathonProject,
  mapHackathonRegistrant,
  mapHackathonStanding,
  mapPageResult,
} from '../mappers/hackathon.mapper';

export class HttpHackathonsRepository implements HackathonsRepository {
  async list(params?: ApiHackathonsListParams): Promise<PageResult<Hackathon>> {
    const result = await hackathonsApiClient.list(params);
    return mapPageResult(result, mapHackathon);
  }

  async getById(id: number | string): Promise<Hackathon> {
    const result = await hackathonsApiClient.getById(String(id));
    return mapHackathon(result as any);
  }

  async getProjects(id: number | string): Promise<HackathonProject[]> {
    const result = await hackathonsApiClient.getProjects(String(id));
    return Array.isArray(result) ? result.map(mapHackathonProject) : [];
  }

  async getProjectBySymbol(id: number | string, symbol: string): Promise<HackathonProject> {
    const result = await hackathonsApiClient.getProject(String(id), symbol);
    return mapHackathonProject(result as any);
  }

  async register(id: number | string): Promise<Hackathon> {
    const result = await hackathonsApiClient.register(String(id), {} as any);
    return mapHackathon(result as any);
  }

  async unregister(id: number | string): Promise<void> {
    await hackathonsApiClient.unregister(String(id));
  }

  async getRegistrants(id: number | string): Promise<HackathonRegistrant[]> {
    const result = await hackathonsApiClient.getStandings(String(id));
    return Array.isArray(result) ? result.map(mapHackathonRegistrant) : [];
  }

  async getStandings(id: number | string): Promise<HackathonStanding[]> {
    const result = await hackathonsApiClient.getStandings(String(id));
    return Array.isArray(result) ? result.map(mapHackathonStanding) : [];
  }
}
