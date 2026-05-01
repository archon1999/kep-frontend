export interface BlogTableOfContentsItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export interface BlogAuthor {
  username: string;
  avatar: string | null;
  bio: string;
}

export type BlogTranslationLocale = 'uz' | 'ru' | 'en';

export interface BlogTranslationFields {
  title: string;
  subtitle: string;
  body: string;
}

export type BlogTranslations = Record<BlogTranslationLocale, BlogTranslationFields>;

export enum BlogStatus {
  Draft = 1,
  Published = 2,
  Pending = 3,
}

export interface BlogPost {
  id: number;
  author: BlogAuthor;
  title: string;
  subtitle?: string;
  body?: string;
  bodyShort?: string;
  tableOfContents?: BlogTableOfContentsItem[];
  image?: string | null;
  views: number;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  topics: BlogTopic[];
  canonicalLink?: string;
  translations?: BlogTranslations;
  created?: string;
  updatedAt?: string;
  publishedAt?: string;
  status?: BlogStatus;
  rewardValue?: number | null;
  canEdit?: boolean;
  canSubmit?: boolean;
}

export interface BlogComment {
  id: number;
  username: string;
  userAvatar: string;
  likes: number;
  reply?: number | null;
  body: string;
  created?: string;
}

export interface BlogTopic {
  id: number;
  title: string;
}

export interface BlogUpsertPayload {
  translations: BlogTranslations;
  tags: string[];
  topicIds: number[];
  canonicalLink: string;
  imageFile?: File | null;
  removeImage?: boolean;
}
