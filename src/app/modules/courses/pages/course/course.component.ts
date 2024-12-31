import { Component, OnInit } from '@angular/core';
import { Course } from '@courses/interfaces';
import { BaseComponent } from '@app/common';
import { CoreCommonModule } from '@core/common.module';
import { CourseHeaderComponent } from '@courses/pages/course/course-header/course-header.component';
import { CourseInfoComponent } from '@courses/pages/course/course-info/course-info.component';
import { CourseLessonsComponent } from '@courses/pages/course/course-lessons/course-lessons.component';
import { ReviewsComponent } from '@courses/pages/course/course-reviews/reviews.component';
import { CourseBestParticipantsComponent } from '@courses/pages/course/course-best-participants/course-best-participants.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  imports: [
    CoreCommonModule,
    CourseHeaderComponent,
    CourseInfoComponent,
    CourseLessonsComponent,
    ReviewsComponent,
    CourseBestParticipantsComponent,
  ],
  standalone: true,
})
export class CourseComponent extends BaseComponent implements OnInit {
  public course: Course;

  ngOnInit() {
    this.route.data.subscribe(({ course }) => {
      this.course = course;
      this.titleService.updateTitle(this.route, { courseTitle: course.title });
    });
  }
}
