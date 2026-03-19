import { BlogComment as ApiBlogComment } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  BlogComment,
  BlogPost,
  BlogStatus,
  BlogTableOfContentsItem,
} from '../../domain/entities/blog.entity';
import { PageResult } from '../../domain/ports/blog.repository';

export interface BlogApiPost {
  id?: number | string;
  author?: {
    username?: string | null;
    avatar?: string | null;
    bio?: string | null;
  } | string | null;
  title?: string | null;
  body?: string | null;
  bodyShort?: string | null;
  body_short?: string | null;
  image?: string | null;
  views?: number | null;
  likesCount?: number | null;
  likes_count?: number | null;
  commentsCount?: number | null;
  comments_count?: number | null;
  tags?: string | string[] | null;
  created?: string | null;
  updated?: string | null;
  updatedAt?: string | null;
  updated_at?: string | null;
  publishedAt?: string | null;
  published_at?: string | null;
  status?: number | string | null;
  kepcoinRewardValue?: number | string | null;
  kepcoin_reward_value?: number | string | null;
  canEdit?: boolean | null;
  can_edit?: boolean | null;
  canSubmit?: boolean | null;
  can_submit?: boolean | null;
  tableOfContents?: BlogTableOfContentsItem[] | null;
  table_of_contents?: BlogTableOfContentsItem[] | null;
}

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

const normalizeStatus = (value?: number | string | null) => {
  const parsed = Number(value);

  if (parsed === BlogStatus.Draft || parsed === BlogStatus.Published || parsed === BlogStatus.Pending) {
    return parsed;
  }

  return BlogStatus.Published;
};

const mapTableOfContents = (items?: BlogTableOfContentsItem[] | null): BlogTableOfContentsItem[] =>
  Array.isArray(items)
    ? items
        .map((item) => ({
          id: item?.id ?? '',
          text: item?.text ?? '',
          level: Number(item?.level) as BlogTableOfContentsItem['level'],
        }))
        .filter(
          (item) =>
            Boolean(item.id && item.text) && [1, 2, 3].includes(item.level),
        )
    : [];

const mapBasePost = (payload: BlogApiPost): BlogPost => {
  const status = normalizeStatus(payload.status);

  return {
    id: Number(payload.id ?? 0),
    author: {
      username:
        typeof payload.author === 'string'
          ? payload.author
          : payload.author?.username?.trim() || 'unknown',
      avatar: typeof payload.author === 'string' ? null : payload.author?.avatar ?? null,
      bio: typeof payload.author === 'string' ? '' : payload.author?.bio?.trim() ?? '',
    },
    title: payload.title ?? '',
    bodyShort: payload.bodyShort ?? payload.body_short ?? undefined,
    image: payload.image ?? null,
    views: payload.views ?? 0,
    likesCount: payload.likesCount ?? payload.likes_count ?? 0,
    commentsCount: payload.commentsCount ?? payload.comments_count ?? 0,
    tags: mapTags(payload.tags),
    created: payload.created ?? undefined,
    updatedAt: payload.updatedAt ?? payload.updated_at ?? payload.updated ?? undefined,
    publishedAt: payload.publishedAt ?? payload.published_at ?? undefined,
    status,
    rewardValue:
      payload.kepcoinRewardValue !== undefined && payload.kepcoinRewardValue !== null
        ? Number(payload.kepcoinRewardValue)
        : payload.kepcoin_reward_value !== undefined && payload.kepcoin_reward_value !== null
          ? Number(payload.kepcoin_reward_value)
          : null,
    canEdit: payload.canEdit ?? payload.can_edit ?? true,
    canSubmit: payload.canSubmit ?? payload.can_submit ?? status === BlogStatus.Draft,
  };
};

export const mapBlogPost = (payload: BlogApiPost): BlogPost => ({
  ...mapBasePost(payload),
  body: payload.body ?? undefined,
  tableOfContents: mapTableOfContents(payload.tableOfContents ?? payload.table_of_contents),
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => {
  const sourceData = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.results)
        ? payload.results
        : [];

  return {
    page: payload?.page ?? 1,
    pageSize: payload?.pageSize ?? payload?.page_size ?? sourceData.length ?? 0,
    count: payload?.count ?? sourceData.length ?? 0,
    total: payload?.total ?? payload?.count ?? sourceData.length ?? 0,
    pagesCount: payload?.pagesCount ?? payload?.pages_count ?? undefined,
    data: sourceData.map(mapItem),
  };
};

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
