import { Component, inject } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { HomeService } from '../home.service';
import { PageResult } from '@app/common/classes/page-result';
import { BaseTablePageComponent } from '@app/common';
import { Observable } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';
import { BlogPostCardModule } from '@app/modules/blog/components/blog-post-card/blog-post-card.module';

const NEWS_MAX_LIMIT = 50;

@Component({
  selector: 'news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss'],
  animations: [fadeInRightOnEnterAnimation({duration: 1000, translate: '40px'})],
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
    TranslateModule,
    BlogPostCardModule
  ]
})
export class NewsSectionComponent extends BaseTablePageComponent<any> {
  override defaultPageSize = 3;
  override pageQueryParam = 'newsPage';
  override pageSizeQueryParam = 'newsPageSize';

  protected homeService = inject(HomeService);

  getPage(): Observable<PageResult<any>> {
    return this.homeService.getNews({
      pageSize: this.pageSize
    });
  }
}
