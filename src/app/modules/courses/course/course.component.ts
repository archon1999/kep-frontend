import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, User } from '@auth';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Course, CourseLesson } from '../courses.models';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  public course: Course;
  public courseLessons: Array<CourseLesson> = [];

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public authService: AuthService,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    document.getElementsByTagName('body')[0].classList.add('course-detail-page');

    this.route.data.subscribe(({ course, courseLessons }) => {
      this.course = course;
      this.courseLessons = courseLessons;
      this.titleService.updateTitle(this.route, { courseTitle: this.course.title });
    })

    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User) => {
        this.currentUser = user;
      }
    )
  }

  ngOnDestroy(): void {
    document.getElementsByTagName('body')[0].classList.remove('course-detail-page');
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
