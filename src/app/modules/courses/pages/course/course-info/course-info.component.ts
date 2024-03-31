import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Course } from '@courses/interfaces';
import { BaseUserComponent } from '@app/common';
import { CoreCommonModule } from '@core/common.module';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbProgressbarModule,
    ResourceByIdPipe,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CourseInfoComponent extends BaseUserComponent implements OnInit, OnDestroy {
  @Input() course: Course;

  public tasksRatio = 0;

  ngOnInit(): void {
    this.tasksRatio = Math.trunc(100 * this.course.tasksCount / this.course.partsCount);
  }

  protected readonly Resources = Resources;
}
