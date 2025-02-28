import { Component } from '@angular/core';
import {
  SectionProblemsListComponent
} from '@problems/pages/problems/sections/section-problems-list/section-problems-list.component';
import { CoreCommonModule } from '@core/common.module';
import {
  ProblemCardComponent
} from '@problems/pages/problems/sections/section-problems-list/problem-card/problem-card.component';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'last-problems-section',
  standalone: true,
  imports: [
    CoreCommonModule,
    ProblemCardComponent,
    SwiperComponent,
    NgxSkeletonLoaderModule
  ],
  templateUrl: './last-problems-section.component.html',
  styleUrl: './last-problems-section.component.scss'
})
export class LastProblemsSectionComponent extends SectionProblemsListComponent {
  override defaultOrdering = '-id';
  override defaultPageSize = 12;

  public swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    autoplay: true,
    breakpoints: {
      1300: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      880: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 30,
      }
    },
  };
}
