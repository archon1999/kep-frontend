import { Component, inject, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { CoreCommonModule } from '@core/common.module';
import { Course, CourseLesson } from '@courses/interfaces';
import { BaseLoadComponent } from '@core/common';
import { Observable } from 'rxjs';
import { CoursesService } from '@courses/courses.service';
import { LessonCardComponent } from '@courses/pages/course/course-lessons/lesson-card/lesson-card.component';

@Component({
  selector: 'course-lessons',
  templateUrl: './course-lessons.component.html',
  styleUrls: ['./course-lessons.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, LessonCardComponent]
})
export class CourseLessonsComponent extends BaseLoadComponent<CourseLesson[]> implements OnInit {
  @Input() course: Course;

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

  private service = inject(CoursesService);

  getData(): Observable<CourseLesson[]> {
    return this.service.getCourseLessons(this.course.id);
  }
}
