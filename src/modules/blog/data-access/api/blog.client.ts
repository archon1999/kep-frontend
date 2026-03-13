import { apiClient } from 'shared/api';
import {
  ApiBlogAllAuthors200,
  ApiBlogAllAuthorsParams,
  ApiBlogCommentsList200,
  ApiBlogList200,
  ApiBlogListParams,
  BlogComment,
  BlogDetail,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const blogApiClient = {
  list: (params?: ApiBlogListParams) => apiClient.apiBlogList(params) as Promise<ApiBlogList200>,
  getAuthors: (params?: ApiBlogAllAuthorsParams) => apiClient.apiBlogAllAuthors(params) as Promise<ApiBlogAllAuthors200>,
  getById: (id: string) => apiClient.apiBlogRead(id) as Promise<BlogDetail>,
  getComments: (id: string) => apiClient.apiBlogComments(id) as unknown as Promise<ApiBlogCommentsList200>,
  createComment: (id: string, payload: Partial<BlogComment>) => apiClient.apiBlogCreateComment(id, payload as any),
  likePost: (id: string) => apiClient.apiBlogLike(id, {} as any),
  likeComment: (id: string) => apiClient.apiBlogCommentsLike(id, {} as any),
  deleteComment: (id: string) => apiClient.apiBlogCommentsDelete(id),
};
