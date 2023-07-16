import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, CourseKeyword, CourseLesson } from '../../courses.models';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {

  public course: Course;
  public courseLessons: Array<CourseLesson> = [];
  public courseDictionary: Array<CourseKeyword> = [];

  public contentHeader = {
    headerTitle: 'COURSES.DICTIONARY',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'COURSES.COURSES',
          isLink: true,
          link: '/learn/courses'
        },
        {
          name: '',
          isLink: true,
          link: '..'
        },
        {
          name: 'COURSES.DICTIONARY',
          isLink: false,
          link: '.'
        },
      ]
    }
  };

  constructor(
    public route: ActivatedRoute
  ) { 
    this.route.data.subscribe(({ course, courseLessons, courseDictionary }) => {
      this.course = course;
      this.courseLessons = courseLessons.map((data: any) => {
        return CourseLesson.fromJSON(data);
      });
      this.courseDictionary = courseDictionary;
      this.contentHeader.breadcrumb.links[1].name = this.course.title;
    })
  }

  ngOnInit(): void {
  }

}
