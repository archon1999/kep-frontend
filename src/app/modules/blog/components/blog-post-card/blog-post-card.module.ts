import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostCardComponent } from './blog-post-card/blog-post-card.component';
import { UserPopoverModule } from '../../../../shared/components/user-popover/user-popover.module';
import { RouterModule } from '@angular/router';
import { CorePipesModule } from '../../../../../@core/pipes/pipes.module';
import { CoreDirectivesModule } from '../../../../../@core/directives/directives';
import { NewsCardComponent } from './news-card/news-card.component';


@NgModule({
  declarations: [
    BlogPostCardComponent,
    NewsCardComponent
  ],
  imports: [
    CommonModule,
    UserPopoverModule,
    RouterModule,
    CorePipesModule,
    CoreDirectivesModule
  ],
  exports: [
    BlogPostCardComponent,
    NewsCardComponent,
  ]
})
export class BlogPostCardModule { }
