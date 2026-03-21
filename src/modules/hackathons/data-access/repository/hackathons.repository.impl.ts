import { apiClient } from 'shared/api';
import { instance } from 'shared/api/http/axiosInstance';
import type { ApiHackathonsList200, ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import type { Hackathon, HackathonProject, HackathonRegistrant, HackathonStanding, HackathonsRepository, PageResult } from '../../domain';
import {
  mapHackathon,
  mapHackathonProject,
  mapHackathonRegistrant,
  mapHackathonStanding,
  mapPageResult,
} from '../mappers/hackathon.mapper';

export class HackathonsRepositoryImpl implements HackathonsRepository {
  async list(params?: ApiHackathonsListParams): Promise<PageResult<Hackathon>> {
    const result = (await apiClient.apiHackathonsList(params)) as ApiHackathonsList200;
    return mapPageResult(result, mapHackathon);
  }

  async getById(id: number | string): Promise<Hackathon> {
    const result = await apiClient.apiHackathonsRead(String(id));
    return mapHackathon(result as any);
  }

  async getProjects(id: number | string): Promise<HackathonProject[]> {
    const result = await apiClient.apiHackathonsProjects(String(id));
    return Array.isArray(result) ? result.map(mapHackathonProject) : [];
  }

  async getProjectBySymbol(id: number | string, symbol: string): Promise<HackathonProject> {
    const result = await apiClient.apiHackathonsProject(String(id), symbol);
    return mapHackathonProject(result as any);
  }

  async register(id: number | string): Promise<Hackathon> {
    const result = await apiClient.apiHackathonsRegistrationCreate(String(id), {} as never);
    return mapHackathon(result as any);
  }

  async unregister(id: number | string): Promise<void> {
    await apiClient.apiHackathonsRegistrationDelete(String(id));
  }

  async getRegistrants(id: number | string): Promise<HackathonRegistrant[]> {
    const response = await instance.get(`/api/hackathons/${id}/registrants/`);
    return Array.isArray(response.data) ? response.data.map(mapHackathonRegistrant) : [];
  }

  async getStandings(id: number | string): Promise<HackathonStanding[]> {
    const result = await apiClient.apiHackathonsStandings(String(id));
    return Array.isArray(result) ? result.map(mapHackathonStanding) : [];
  }
}

export const hackathonsRepository = new HackathonsRepositoryImpl();
