import { Component, Input } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { Course } from '@courses/interfaces';
import { NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'course-header',
  templateUrl: './course-header.component.html',
  styleUrls: ['./course-header.component.scss'],
  imports: [
    CoreCommonModule,
    NgbTooltipModule,
    NgbRatingModule,
  ],
  standalone: true,
})
export class CourseHeaderComponent {
  @Input() course: Course;
}
