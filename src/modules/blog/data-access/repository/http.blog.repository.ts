import { ApiBlogListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { blogApiClient } from '../api/blog.client';
import { blogMappers, mapBlogComment, mapBlogPost, mapPageResult } from '../mappers/blog.mapper';
import { BlogRepository } from '../../domain/ports/blog.repository';
import { BlogPost, BlogUpsertPayload } from '../../domain/entities/blog.entity';

const toFormData = (payload: BlogUpsertPayload) => {
  const formData = new FormData();

  formData.append(
    'translations',
    JSON.stringify({
      uz: {
        title: payload.translations.uz.title,
        sub_text: payload.translations.uz.subtitle,
        body: payload.translations.uz.body,
      },
      ru: {
        title: payload.translations.ru.title,
        sub_text: payload.translations.ru.subtitle,
        body: payload.translations.ru.body,
      },
      en: {
        title: payload.translations.en.title,
        sub_text: payload.translations.en.subtitle,
        body: payload.translations.en.body,
      },
    }),
  );
  formData.append('tags', JSON.stringify(payload.tags));
  formData.append('topics', JSON.stringify(payload.topicIds));
  formData.append('canonical_link', payload.canonicalLink);

  if (payload.imageFile) {
    formData.append('image', payload.imageFile);
  }

  if (payload.removeImage) {
    formData.append('remove_image', 'true');
  }

  return formData;
};

export class HttpBlogRepository implements BlogRepository {
  async list(params?: ApiBlogListParams) {
    const response = await blogApiClient.list(params);
    return mapPageResult<BlogPost>(response, (item) => mapBlogPost({ ...item, body: item.bodyShort ?? '' } as any));
  }

  async mine(params?: Partial<ApiBlogListParams>) {
    const response = await blogApiClient.mine(params);
    return mapPageResult<BlogPost>(response, (item) => mapBlogPost(item as any));
  }

  async getById(id: number | string) {
    const response = await blogApiClient.getById(String(id));
    return mapBlogPost(response as any);
  }

  async getAuthors() {
    const response = await blogApiClient.getAuthors();
    return Array.isArray(response) ? response : [];
  }

  async getTopics() {
    const response = await blogApiClient.getTopics();
    return Array.isArray(response)
      ? response
          .map((topic) => ({
            id: Number(topic.id ?? 0),
            title: topic.title ?? '',
          }))
          .filter((topic) => topic.id > 0 && topic.title)
      : [];
  }

  async create(payload: BlogUpsertPayload) {
    const response = await blogApiClient.create(toFormData(payload));
    return mapBlogPost(response as any);
  }

  async update(id: number | string, payload: BlogUpsertPayload) {
    const response = await blogApiClient.update(String(id), toFormData(payload));
    return mapBlogPost(response as any);
  }

  async submitForReview(id: number | string) {
    const response = await blogApiClient.submitForReview(String(id));
    return mapBlogPost(response as any);
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
