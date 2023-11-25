import { Component, Input, OnInit } from '@angular/core';
import { CourseLesson } from '../../courses.models';
import { SwiperOptions } from 'swiper/types/swiper-options';

@Component({
  selector: 'course-lessons',
  templateUrl: './course-lessons.component.html',
  styleUrls: ['./course-lessons.component.scss']
})
export class CourseLessonsComponent implements OnInit {

  @Input() lessons: Array<CourseLesson> = [];

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

  constructor() {
  }

  ngOnInit(): void {
  }

}
