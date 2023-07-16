import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { UserPopoverModule } from '../elements/user-popover/user-popover.module';
import { MathjaxModule } from '../third-part-modules/mathjax/mathjax.module';
import { QuillModule } from '../third-part-modules/quill/quill.module';
import { BlogComponent } from './blog.component';
import { BlogPostResolver } from './blog.resolver';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { CommentsComponent } from './post-detail/comments/comments.component';
import { FormsModule } from '@angular/forms';
import { BlogPostCardModule } from '../elements/blog-post-card/blog-post-card.module';
import { NgSelectModule } from '../third-part-modules/ng-select/ng-select.module';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    title: 'Blog.Blog',
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
    data: {
      animation: 'post-detail',
      title: 'Blog.PostDetail',
    },
    resolve: {
      blogPost: BlogPostResolver,
    },
  }
];

@NgModule({
  declarations: [
    BlogComponent,
    PostDetailComponent,
    CommentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreDirectivesModule,
    ContentHeaderModule,
    UserPopoverModule,
    CorePipesModule,
    QuillModule,
    MathjaxModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    BlogPostCardModule,
    NgSelectModule,
    NgbPaginationModule,
  ],
  exports: [
    PostDetailComponent,
  ],
  providers: [
    BlogPostResolver,
  ]
})
export class BlogModule { }
