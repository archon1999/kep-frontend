import { Component, Input, OnInit } from '@angular/core';
import { Course } from '../../courses.models';

@Component({
  selector: 'course-statistics',
  templateUrl: './course-statistics.component.html',
  styleUrls: ['./course-statistics.component.scss']
})
export class CourseStatisticsComponent implements OnInit {

  @Input() course: Course;

  constructor() { }

  ngOnInit(): void {
  }

}
