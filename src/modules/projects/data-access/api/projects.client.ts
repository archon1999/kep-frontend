import { apiClient } from 'shared/api';
import { instance } from 'shared/api/http/axiosInstance.ts';
import type {
  ApiProjectAttemptsList200,
  ApiProjectAttemptsListParams,
  ProjectAttemptList,
  ProjectDetail,
  ProjectList,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const projectsApiClient = {
  list: () => apiClient.apiProjectsList() as Promise<ProjectList[]>,
  getBySlug: (slug: string) => apiClient.apiProjectsRead(slug) as Promise<ProjectDetail>,
  purchase: (slug: string) => apiClient.apiProjectsPurchase(slug, {} as ProjectDetail) as Promise<ProjectDetail>,
  listAttempts: (params: ApiProjectAttemptsListParams) =>
    apiClient.apiProjectAttemptsList(params) as Promise<ApiProjectAttemptsList200>,
  getAttemptLog: (attemptId: string) => apiClient.apiProjectAttemptsLog(attemptId) as Promise<ProjectAttemptList>,
  rerunAttempt: (attemptId: string) => apiClient.apiProjectAttemptsRerun(attemptId, {} as ProjectAttemptList),
  submitAttempt: async (slug: string, technology: string, file: File, hackathonId?: number, projectSymbol?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('technology', technology);

    const path = hackathonId && projectSymbol
      ? `/api/hackathons/${hackathonId}/projects/${projectSymbol}/submit/`
      : `/api/projects/${slug}/submit/`;

    await instance.post(path, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
