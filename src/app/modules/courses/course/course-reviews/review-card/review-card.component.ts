import { Component, Input, OnInit } from '@angular/core';
import { CourseParticipantReview } from '../../../courses.models';
import { SwiperOptions } from 'swiper/types/swiper-options';

@Component({
  selector: 'review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent implements OnInit {

  @Input() review: CourseParticipantReview;

  public lessonsSwiperConfig: SwiperOptions = {
    breakpoints: {
      1300: {
        slidesPerView: 3,
        spaceBetween: 100
      },
      880: {
        slidesPerView: 2,
        spaceBetween: 60
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 60
      }
    }
  };

  constructor() {}

  ngOnInit(): void {
  }

}
