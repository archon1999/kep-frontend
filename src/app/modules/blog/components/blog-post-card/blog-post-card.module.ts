import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostCardComponent } from './blog-post-card/blog-post-card.component';
import { UserPopoverModule } from '../../../../shared/components/user-popover/user-popover.module';
import { RouterModule } from '@angular/router';
import { CorePipesModule } from '@shared/pipes/pipes.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { NewsCardComponent } from './news-card/news-card.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { KepIconComponent } from "@shared/components/kep-icon/kep-icon.component";
import { TranslatePipe } from "@ngx-translate/core";


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
    CoreDirectivesModule,
    KepCardComponent,
    KepIconComponent,
    TranslatePipe
  ],
  exports: [
    BlogPostCardComponent,
    NewsCardComponent,
  ]
})
export class BlogPostCardModule {}
