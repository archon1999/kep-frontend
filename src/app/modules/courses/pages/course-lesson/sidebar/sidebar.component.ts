import { Component, Input } from '@angular/core';
import { Course, CourseLesson } from '@courses/interfaces';
import { CoreCommonModule } from '@core/common.module';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { Resources } from '@app/resources';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lesson-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ResourceByIdPipe,
    NgbProgressbarModule,
    NgbTooltipModule,
  ]
})
export class SidebarComponent {
  @Input() course: Course;
  @Input() courseLessons: Array<CourseLesson>;
  @Input() currentCourseLesson: CourseLesson;
  protected readonly Resources = Resources;
}
