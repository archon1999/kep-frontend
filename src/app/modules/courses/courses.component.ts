import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';
import { Course } from './courses.models';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  animations: [fadeInRightAnimation({ duration: 3000 })]
})
export class CoursesComponent implements OnInit {
  public startAnimationState = false;

  courses: Array<Course> = [];

  contentHeader = {
    headerTitle: 'COURSES.COURSES',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'CPython.uz',
          isLink: false,
        },
      ]
    }
  };

  constructor(
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.startAnimationState = true;
    }, 0);

    this.route.data.subscribe(({ courses }) => {
      this.courses = courses;
    })
  }

}
