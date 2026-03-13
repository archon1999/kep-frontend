import { apiClient } from 'shared/api';
import { ApiHackathonsList200, ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';

export const hackathonsApiClient = {
  list: (params?: ApiHackathonsListParams) => apiClient.apiHackathonsList(params) as Promise<ApiHackathonsList200>,
  getById: (id: string) => apiClient.apiHackathonsRead(id),
  getAttempts: (id: string) => apiClient.apiHackathonsAttempts(id),
  getProjects: (id: string) => apiClient.apiHackathonsProjects(id),
  getProject: (id: string, symbol: string) => apiClient.apiHackathonsProject(id, symbol),
  submitProject: (id: string, symbol: string, payload: any) => apiClient.apiHackathonsProjectsSubmit(id, symbol, payload),
  register: (id: string, payload: any) => apiClient.apiHackathonsRegistrationCreate(id, payload),
  unregister: (id: string) => apiClient.apiHackathonsRegistrationDelete(id),
  getStandings: (id: string) => apiClient.apiHackathonsStandings(id),
};
