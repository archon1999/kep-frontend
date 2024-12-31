import { Component, inject } from '@angular/core';
import { BaseLoadComponent } from '@app/common';
import { Contest } from '@contests/models';
import { ContestsService } from '@contests/contests.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageResult } from '@app/common/classes/page-result';
import { ContestCardComponent } from '@app/modules/home/contests-section/contest-card/contest-card.component';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { NgForOf } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';

@Component({
  selector: 'contests-section',
  standalone: true,
  imports: [
    ContestCardComponent,
    SwiperComponent,
    NgForOf,
    NgxSkeletonLoaderModule,
    TranslateModule,
    KepIconComponent
  ],
  templateUrl: './contests-section.component.html',
  styleUrl: './contests-section.component.scss'
})
export class ContestsSectionComponent extends BaseLoadComponent<Contest[]> {
  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true,
    },
  };
  private service = inject(ContestsService);

  get contests() {
    return this.data || [];
  }

  getData(): Observable<Contest[]> {
    return this.service.getContests({
      page: 1,
      pageSize: 3,
    }).pipe(map((pageResult: PageResult<Contest>) => {
      return pageResult.data;
    }));
  }
}
