import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { CoreCommonModule } from '@core/common.module';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'section-contests',
  templateUrl: './section-contests.component.html',
  styleUrls: ['./section-contests.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
  ]
})
export class SectionContestsComponent implements OnInit {

  public contests: Array<Contest> = [];

  public swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    breakpoints: {
      1024: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 50
      },
    }
  };

  constructor(
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({contests}) => {
      this.contests = contests.map((contest: any) => Contest.fromJSON(contest));
    });
  }

}
