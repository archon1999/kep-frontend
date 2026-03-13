import { ApiBlogListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { BlogComment, BlogPost } from '../entities/blog.entity';

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount?: number;
  data: T[];
}

export interface BlogRepository {
  list: (params?: ApiBlogListParams) => Promise<PageResult<BlogPost>>;
  getById: (id: number | string) => Promise<BlogPost>;
  getAuthors: () => Promise<string[]>;
  getComments: (id: number | string) => Promise<BlogComment[]>;
  createComment: (id: number | string, body: string) => Promise<void>;
  likePost: (id: number | string) => Promise<number>;
  likeComment: (id: number | string) => Promise<number>;
  deleteComment: (id: number | string) => Promise<void>;
}
