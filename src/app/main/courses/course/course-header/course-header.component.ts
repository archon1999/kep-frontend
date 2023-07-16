import { Component, Input, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { Course } from '../../courses.models';

@Component({
  selector: 'course-header',
  templateUrl: './course-header.component.html',
  styleUrls: ['./course-header.component.scss', '../../levels.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
  ]
})
export class CourseHeaderComponent implements OnInit {

  @Input() course: Course;

  constructor() { }

  ngOnInit(): void {
  }

}
