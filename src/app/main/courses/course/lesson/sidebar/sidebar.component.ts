import { Component, Input, OnInit } from '@angular/core';
import { Course, CourseLesson } from 'app/main/courses/courses.models';

@Component({
  selector: 'lesson-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() course: Course;
  @Input() courseLessons: Array<CourseLesson>;
  @Input() currentCourseLesson: CourseLesson;

  constructor() { }

  ngOnInit(): void {
  }

}
