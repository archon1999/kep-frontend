import { Component, inject } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { BaseLoadComponent } from '@app/common/classes/base-load.component';
import { Review } from '@app/modules/landing-page/sections/section-reviews/review';
import { Observable, of } from 'rxjs';
import { ReviewCardComponent } from '@app/modules/landing-page/sections/section-reviews/review-card/review-card.component';
import { LandingPageService } from '@app/modules/landing-page/landing-page.service';

@Component({
  selector: 'section-reviews',
  standalone: true,
  imports: [CoreCommonModule, SwiperComponent, ReviewCardComponent],
  templateUrl: './section-reviews.component.html',
  styleUrl: './section-reviews.component.scss'
})
export class SectionReviewsComponent extends BaseLoadComponent<Array<Review>> {
  public service = inject(LandingPageService);

  public swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    autoHeight: false,
    autoplay: {
      delay: 2500,
      disableOnInteraction: true,
    },
    loop: true,
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 30
      },
    }
  };

  getData(): Observable<Array<Review>> {
    return this.service.getReviews();
  }
}
