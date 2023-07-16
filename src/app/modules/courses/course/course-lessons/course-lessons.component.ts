import { Component, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { Course, CourseLesson } from '../../courses.models';

@Component({
  selector: 'course-lessons',
  templateUrl: './course-lessons.component.html',
  styleUrls: ['./course-lessons.component.scss']
})
export class CourseLessonsComponent implements OnInit {

  @Input() lessons: Array<CourseLesson> = [];

  public lessonsSwiperConfig: SwiperOptions = {
    lazy: true,
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
  }

  constructor() { }

  ngOnInit(): void {
  }

}
