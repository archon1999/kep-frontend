import { BlogComment as ApiBlogComment, BlogDetail, BlogList } from 'shared/api/orval/generated/endpoints/index.schemas';
import { BlogComment, BlogPost } from '../../domain/entities/blog.entity';
import { PageResult } from '../../domain/ports/blog.repository';

const mapTags = (tags?: string | string[] | null): string[] => {
  if (Array.isArray(tags)) {
    return tags.filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const mapBasePost = (payload: BlogList): BlogPost => ({
  id: Number(payload.id ?? 0),
  author: {
    username: payload.author.username,
    avatar: payload.author.avatar,
  },
  title: payload.title,
  bodyShort: payload.bodyShort ?? undefined,
  image: payload.image ?? null,
  views: payload.views ?? 0,
  likesCount: payload.likesCount ?? 0,
  commentsCount: payload.commentsCount ?? 0,
  tags: mapTags(payload.tags),
  created: payload.created,
});

export const mapBlogPost = (payload: BlogDetail): BlogPost => ({
  ...mapBasePost(payload),
  body: payload.body,
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload.page ?? 1,
  pageSize: payload.pageSize ?? payload.data?.length ?? 0,
  count: payload.count ?? payload.data?.length ?? 0,
  total: payload.total ?? payload.count ?? payload.data?.length ?? 0,
  pagesCount: payload.pagesCount ?? undefined,
  data: Array.isArray(payload.data) ? payload.data.map(mapItem) : [],
});

export const mapBlogComment = (payload: ApiBlogComment): BlogComment => ({
  id: Number(payload.id ?? 0),
  username: payload.username,
  userAvatar: payload.userAvatar,
  likes: payload.likes ?? 0,
  reply: payload.reply ?? undefined,
  body: payload.body,
  created: payload.created,
});

export const blogMappers = { mapBlogPost, mapPageResult, mapBlogComment };
