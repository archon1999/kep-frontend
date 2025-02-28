import { Component, OnInit } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { ProblemsFilterService } from 'app/modules/problems/services/problems-filter.service';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperComponent } from '@shared/third-part-modules/swiper/swiper.component';

@Component({
  selector: 'section-topics',
  templateUrl: './section-topics.component.html',
  styleUrls: ['./section-topics.component.scss'],
  animations: [fadeInRightOnEnterAnimation({duration: 3000})],
  standalone: true,
  imports: [
    NgbTooltipModule,
    CommonModule,
    TranslateModule,
    SwiperComponent,
  ],
})
export class SectionTopicsComponent implements OnInit {

  public activeTopic = 0;

  public swiperConfig: SwiperOptions = {
    pagination: {clickable: true, enabled: false},
    autoHeight: true,
    slidesPerView: 3,
    breakpoints: {
      1024: {
        slidesPerView: 7,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 5,
        spaceBetween: 30
      },
      472: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      0: {
        slidesPerView: 2,
        spaceBetween: 30
      },
    }
  };

  constructor(
    public filterService: ProblemsFilterService,
  ) {}

  ngOnInit(): void {}

  click(topicId: number) {
    if (this.activeTopic === topicId) {
      topicId = null;
    }
    this.activeTopic = topicId;
    this.filterService.updateFilter({topic: topicId});
  }

}
