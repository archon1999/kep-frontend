import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/blog-list/blog-list.component').then(c => c.BlogListComponent),
    title: 'Blog.Blog',
    data: { title: 'Blog.Blog' },
  },
  {
    path: 'post/:id',
    loadComponent: () => import('@app/modules/blog/pages/post-detail/post-detail.component').then(c => c.PostDetailComponent),
    data: {
      title: 'Blog.PostDetail',
    }
  }
] satisfies Route[];
