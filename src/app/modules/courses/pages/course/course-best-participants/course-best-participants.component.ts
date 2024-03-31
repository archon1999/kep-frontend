import { Component, Input, OnInit } from '@angular/core';
import { CoursesService } from '@courses/courses.service';
import { Course, CourseParticipant } from '@courses/interfaces';
import { CoreCommonModule } from '@core/common.module';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { UserPopoverModule } from '@shared/components/user-popover/user-popover.module';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';

@Component({
  selector: 'course-best-participants',
  templateUrl: './course-best-participants.component.html',
  styleUrls: ['./course-best-participants.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbButtonsModule,
    UserPopoverModule,
    KepTableComponent,
  ]
})
export class CourseBestParticipantsComponent implements OnInit {

  @Input() course: Course;

  public topActiveParticipants: Array<CourseParticipant> = [];
  public topBestParticipants: Array<CourseParticipant> = [];

  constructor(
    public service: CoursesService,
  ) { }

  ngOnInit(): void {
    this.service.getCourseTopActiveParticipants(this.course.id).subscribe(
      (result: any) => {
        this.topActiveParticipants = result;
      }
    );

    this.service.getCourseTopBestParticipants(this.course.id).subscribe(
      (result: any) => {
        this.topBestParticipants = result;
      }
    );
  }

}
