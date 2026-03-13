export interface BlogAuthor {
  username: string;
  avatar: string | null;
}

export enum BlogStatus {
  Draft = 1,
  Published = 2,
  Pending = 3,
}

export interface BlogPost {
  id: number;
  author: BlogAuthor;
  title: string;
  body?: string;
  bodyShort?: string;
  image?: string | null;
  views: number;
  likesCount: number;
  commentsCount: number;
  tags: string[];
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

export interface BlogUpsertPayload {
  title: string;
  body: string;
  tags: string[];
  imageFile?: File | null;
  removeImage?: boolean;
}
