import { Component, inject } from '@angular/core';
import { HomeService } from '../home.service';
import { PageResult } from '@core/common/classes/page-result';
import { BaseTablePageComponent } from '@core/common';
import { Observable } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';
import { NewsCardComponent } from '@app/modules/blog/components/news-card/news-card.component';

@Component({
  selector: 'news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss'],
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
    TranslateModule,
    NewsCardComponent
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
