import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fadeInRightOnEnterAnimation } from 'angular-animations';
import { ProblemsFilterService } from 'app/modules/problems/services/problems-filter.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'section-topics',
  templateUrl: './section-topics.component.html',
  styleUrls: ['./section-topics.component.scss'],
  animations: [fadeInRightOnEnterAnimation({ duration: 3000 })]
})
export class SectionTopicsComponent implements OnInit {

  public activeTopic = 0;

  public swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
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
  }

  constructor(
    public filterService: ProblemsFilterService,
  ) { }

  ngOnInit(): void {}

  click(topicId: number) {
    this.activeTopic = topicId;
    this.filterService.updateFilter({ topic: topicId });
  }

}
