import { ApiBlogListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { blogApiClient } from '../api/blog.client';
import { blogMappers, mapBlogComment, mapBlogPost, mapPageResult } from '../mappers/blog.mapper';
import { BlogRepository } from '../../domain/ports/blog.repository';
import { BlogPost } from '../../domain/entities/blog.entity';

export class HttpBlogRepository implements BlogRepository {
  async list(params?: ApiBlogListParams) {
    const response = await blogApiClient.list(params);
    return mapPageResult<BlogPost>(response, (item) => mapBlogPost({ ...item, body: item.bodyShort ?? '' } as any));
  }

  async getById(id: number | string) {
    const response = await blogApiClient.getById(String(id));
    return mapBlogPost(response as any);
  }

  async getAuthors() {
    const response = await blogApiClient.getAuthors();
    return Array.isArray(response) ? response : [];
  }

  async getComments(id: number | string) {
    const response = await blogApiClient.getComments(String(id));
    return Array.isArray(response) ? response.map(mapBlogComment) : [];
  }

  async createComment(id: number | string, body: string) {
    await blogApiClient.createComment(String(id), { body });
  }

  async likePost(id: number | string) {
    const response = await blogApiClient.likePost(String(id));
    const parsed = Array.isArray(response) ? response[0] : response;
    return (parsed as any) ?? 0;
  }

  async likeComment(id: number | string) {
    const response = await blogApiClient.likeComment(String(id));
    const parsed = Array.isArray(response) ? response[0] : response;
    return (parsed as any)?.likes ?? 0;
  }

  async deleteComment(id: number | string) {
    await blogApiClient.deleteComment(String(id));
  }
}

export const blogRepository = new HttpBlogRepository();
export const blogDataMappers = blogMappers;
