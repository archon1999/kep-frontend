import { Component, Input, OnInit } from '@angular/core';
import { Course, CourseParticipant } from '../../courses.models';
import { CoursesService } from '../../courses.service';

@Component({
  selector: 'course-best-participants',
  templateUrl: './course-best-participants.component.html',
  styleUrls: ['./course-best-participants.component.scss']
})
export class CourseBestParticipantsComponent implements OnInit {

  @Input() course: Course;

  public type = 1;

  public topActiveParticipants: Array<CourseParticipant> = [];
  public topBestParticipants: Array<CourseParticipant> = [];

  public topParticipants: Array<CourseParticipant> = [];

  constructor(
    public service: CoursesService,
  ) { }

  ngOnInit(): void {
    this.service.getCourseTopActiveParticipants(this.course.id).subscribe(
      (result: any) => {
        this.topActiveParticipants = result;
        this.update();
      }
    );

    this.service.getCourseTopBestParticipants(this.course.id).subscribe(
      (result: any) => {
        this.topBestParticipants = result;
      }
    );
  }

  update(){
    if(this.type == 1){
      this.topParticipants = this.topActiveParticipants;
    } else {
      this.topParticipants = this.topBestParticipants;
    }
  }

}
