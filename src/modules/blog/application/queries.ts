import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { createKeyFactory } from 'shared/api';
import { ApiBlogListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { blogRepository } from '../data-access/repository/http.blog.repository';
import { BlogComment, BlogPost } from '../domain/entities/blog.entity';
import { PageResult } from '../domain/ports/blog.repository';

export const blogKeys = createKeyFactory('blog');

export const useBlogPosts = (params?: ApiBlogListParams) =>
  useSWR<PageResult<BlogPost>>(blogKeys.list(params), () => blogRepository.list(params), { suspense: false });

export const useBlogPost = (id?: string) =>
  useSWR<BlogPost>(id ? blogKeys.detail(id) : null, () => blogRepository.getById(id!), { suspense: false });

export const useBlogAuthors = () =>
  useSWR<string[]>(blogKeys.detail('authors'), () => blogRepository.getAuthors(), { suspense: false });

export const useBlogComments = (id?: string) =>
  useSWR<BlogComment[]>(id ? blogKeys.detail(`comments-${id}`) : null, () => blogRepository.getComments(id!), {
    suspense: false,
  });

export const useBlogCommentCreate = (id?: string) =>
  useSWRMutation(
    id ? blogKeys.detail(`create-comment-${id}`) : null,
    (_, { arg }: { arg: string }) => blogRepository.createComment(id!, arg),
  );

export const useBlogPostLike = (id?: string) =>
  useSWRMutation(id ? blogKeys.detail(`like-${id}`) : null, () => blogRepository.likePost(id!));

export const useBlogCommentLike = (id?: string) =>
  useSWRMutation(
    id ? blogKeys.detail(`like-comment-${id}`) : null,
    (_, { arg }: { arg: number }) => blogRepository.likeComment(arg),
  );

export const useBlogCommentDelete = (id?: string) =>
  useSWRMutation(
    id ? blogKeys.detail(`delete-comment-${id}`) : null,
    (_, { arg }: { arg: number }) => blogRepository.deleteComment(arg),
  );
