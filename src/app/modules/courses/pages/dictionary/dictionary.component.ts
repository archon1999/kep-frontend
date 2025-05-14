import { Component, OnInit } from '@angular/core';
import { Course, CourseKeyword, CourseLesson } from '@courses/interfaces';
import { CoreCommonModule } from '@core/common.module';
import { BasePageComponent } from '@app/common';
import { ContentHeader } from "@shared/ui/components/content-header/content-header.component";
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from '@courses/pages/course-lesson/sidebar/sidebar.component';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    SidebarComponent,
  ]
})
export class DictionaryComponent extends BasePageComponent implements OnInit {
  public course: Course;
  public courseLessons: Array<CourseLesson> = [];
  public courseDictionary: Array<CourseKeyword> = [];

  ngOnInit(): void {
    this.route.data.subscribe(({course, courseLessons, courseDictionary}) => {
      this.course = course;
      this.courseLessons = courseLessons.map((data: any) => {
        return CourseLesson.fromJSON(data);
      });
      this.courseDictionary = courseDictionary;
      this.loadContentHeader();
      this.contentHeader.breadcrumb.links[1].name = this.course.title;
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'COURSES.DICTIONARY',
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
        ]
      }
    };
  }

}
