export interface BlogAuthor {
  username: string;
  avatar: string;
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
