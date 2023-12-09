import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Course } from '../../courses.models';

@Component({
  selector: 'course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit, OnDestroy {

  @Input() course: Course;

  public tasksRatio = 0;

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
  ) { }
  
  ngOnInit(): void {
    this.tasksRatio = Math.trunc(100 * this.course.tasksCount / this.course.partsCount);

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User) => {
        this.currentUser = user;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
