import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { BaseLoadComponent } from '@core/common/classes/base-load.component';
import { Review } from '@app/modules/landing-page/sections/section-reviews/review';
import { Observable } from 'rxjs';
import { LandingPageService } from '@app/modules/landing-page/landing-page.service';
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'section-reviews',
  standalone: true,
  imports: [CoreCommonModule, CarouselModule, KepCardComponent],
  templateUrl: './section-reviews.component.html',
  styleUrl: './section-reviews.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SectionReviewsComponent extends BaseLoadComponent<Array<Review>> {
  public service = inject(LandingPageService);

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 100,
    autoplay: false,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
    },
    nav: false,
  };

  getData(): Observable<Array<Review>> {
    return this.service.getReviews();
  }
}
