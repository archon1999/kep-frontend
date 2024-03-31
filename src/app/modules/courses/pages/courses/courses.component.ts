import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fadeInRightAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';
import { BaseLoadComponent } from '@app/common';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { CoursesService } from '@app/modules/courses/courses.service';
import { Observable } from 'rxjs';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { Course } from '@app/modules/courses/interfaces';
import { CourseCardComponent } from '@app/modules/courses/components/course-card/course-card.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    CourseCardComponent,
  ],
  animations: [fadeInRightAnimation()],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class CoursesComponent extends BaseLoadComponent<Course[]> implements OnInit {
  constructor(
    private service: CoursesService,
  ) {
    super();
  }

  getData(): Observable<Course[]> {
    return this.service.getCourses();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'COURSES.COURSES',
      breadcrumb: {
        type: '',
        links: [
          {
            name: this.defaultCoreConfig.app.appTitle,
            isLink: false,
          },
        ]
      }
    };
  }
}
