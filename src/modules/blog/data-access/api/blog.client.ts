import { apiClient } from 'shared/api';
import { instance } from 'shared/api/http/axiosInstance';
import {
  ApiBlogAllAuthors200,
  ApiBlogAllAuthorsParams,
  ApiBlogCommentsList200,
  ApiBlogList200,
  ApiBlogListParams,
  BlogComment,
  BlogDetail,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { BlogApiPost } from '../mappers/blog.mapper';

export const blogApiClient = {
  list: (params?: ApiBlogListParams) => apiClient.apiBlogList(params) as Promise<ApiBlogList200>,
  getAuthors: (params?: ApiBlogAllAuthorsParams) => apiClient.apiBlogAllAuthors(params) as Promise<ApiBlogAllAuthors200>,
  getById: (id: string) => apiClient.apiBlogRead(id) as Promise<BlogDetail>,
  mine: async (params?: Partial<ApiBlogListParams>) =>
    (await instance.get('/api/blog/mine/', { params })).data as ApiBlogList200 | BlogApiPost[],
  create: async (payload: FormData) => (await instance.post('/api/blog/', payload)).data as BlogApiPost,
  update: async (id: string, payload: FormData) =>
    (await instance.patch(`/api/blog/${id}/`, payload)).data as BlogApiPost,
  submitForReview: async (id: string) =>
    (await instance.post(`/api/blog/${id}/submit-for-review/`, {})).data as BlogApiPost,
  getComments: (id: string) => apiClient.apiBlogComments(id) as unknown as Promise<ApiBlogCommentsList200>,
  createComment: (id: string, payload: Partial<BlogComment>) => apiClient.apiBlogCreateComment(id, payload as any),
  likePost: (id: string) => apiClient.apiBlogLike(id, {} as any),
  likeComment: (id: string) => apiClient.apiBlogCommentsLike(id, {} as any),
  deleteComment: (id: string) => apiClient.apiBlogCommentsDelete(id),
};
