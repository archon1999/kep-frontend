import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Course, CourseLesson, CourseLessonPart, CourseLessonPartComment } from '../../interfaces';
import { CoursesService } from '../../courses.service';
import { AuthService, User } from '@auth';
import { ApiService } from 'app/shared/services/api.service';
import { ShepherdService } from 'angular-shepherd';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { TitleService } from 'app/shared/services/title.service';
import { CoreCommonModule } from '@core/common.module';
import { CourseLessonPartStatus } from '@courses/constants';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { SidebarComponent } from '@courses/pages/course-lesson/sidebar/sidebar.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PartComponent } from '@courses/pages/course-lesson/part/part.component';
import { PartCommentsComponent } from '@courses/pages/course-lesson/part-comments/part-comments.component';
import { ScriptService } from '@shared/services/script.service';

const SCRIPT_PATH = '//cdn.jsdelivr.net/gh/highlightjs/cdn-release/build/highlight.min.js';
const SCRIPT_PATH2 = 'https://cdn.jsdelivr.net/npm/highlightjs-line-numbers.js/dist/highlightjs-line-numbers.min.js';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    SidebarComponent,
    NgbTooltipModule,
    PartComponent,
    PartCommentsComponent,
    BlockUIModule,
  ]
})
export class LessonComponent implements OnInit {

  course: Course;
  courseLessons: Array<CourseLesson> = [];
  courseLesson: CourseLesson;

  lessonPartIndex = 0;
  currentLessonPart: CourseLessonPart;

  isCommentsShow = false;
  lessonPartComments: Array<CourseLessonPartComment> = [];

  @BlockUI('lesson-part-section') lessonPartBlockUI: NgBlockUI;

  contentHeader = {
    headerTitle: '',
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
          link: '../..'
        },
        {
          name: 'COURSES.LESSON',
          isLink: false,
          link: '.'
        },
      ]
    }
  };

  currentUser: User = this.authService.currentUserValue;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: CoursesService,
    public toastr: ToastrService,
    public authService: AuthService,
    public api: ApiService,
    public titleService: TitleService,
    private shepherdService: ShepherdService,
    private renderer: Renderer2,
    private scriptService: ScriptService,
  ) {
    this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
    this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH2);
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ course, courseLessons, courseLesson }) => {
      this.course = course;
      this.courseLessons = courseLessons.map((data: any) => {
        return CourseLesson.fromJSON(data);
      });
      this.courseLesson = CourseLesson.fromJSON(courseLesson);
      this.titleService.updateTitle(this.route, {
        lessonTitle: this.courseLesson.title,
        courseTitle: this.course.title,
      });
      this.currentLessonPart = this.courseLesson.parts[0];
      this.contentHeader.headerTitle = this.courseLesson.title;
      this.contentHeader.breadcrumb.links[1].name = this.course.title;

      this.route.queryParams.subscribe(
        (params: any) => {
          if ('page' in params) {
            this.changeLessonPart(+params.page - 1);
          }
        }
      );
    });

    this.authService.currentUser.subscribe((user: any) => {
      if (!user) {
        this.router.navigate(['/404'], { skipLocationChange: true });
      }
      this.currentUser = user;
    });

  }

  changeLessonPart(lessonPartIndex: number) {
    const currentScrollHeight = window.pageYOffset;
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: { page: lessonPartIndex + 1 },
      }
    ).then(() => window.scrollTo({ top: currentScrollHeight }));

    const parts = this.courseLesson.parts.length;
    this.lessonPartIndex = (lessonPartIndex + parts) % parts;
    this.currentLessonPart = this.courseLesson.parts[this.lessonPartIndex];
    if (this.currentLessonPart.contentType === 'problem') {
      this.currentLessonPart.contentType = '';
      this.lessonPartBlockUI.start();
      setTimeout(() => {
        this.currentLessonPart.contentType = 'problem';
        this.lessonPartBlockUI.stop();
      }, 500);
    }
    this.isCommentsShow = false;
  }

  checkPartCompletionEvent(result: any) {
    if (this.courseLesson.parts[this.lessonPartIndex].id !== this.currentLessonPart.id) {
      return;
    }
    if (result.success) {
      this.currentLessonPart.updateStatus(CourseLessonPartStatus.COMPLETED);
    } else if (this.currentLessonPart.status === CourseLessonPartStatus.NOT_COMPLETED) {
      this.currentLessonPart.updateStatus(CourseLessonPartStatus.FAILED);
    }
    this.courseLesson.progress = result.lessonProgress;
    this.course.participantProgress = result.participantProgress;
    this.course.participantPoints = result.participantPoints;
  }

  toogleCommentsButton() {
    if (!this.isCommentsShow) {
      this.service.getCourseLessonPartComments(this.currentLessonPart.id).subscribe((result: any) => {
        this.lessonPartComments = result;
        this.isCommentsShow = true;
      });
    } else {
      this.isCommentsShow = false;
    }
  }

  ngAfterViewInit() {
    this.shepherdService.defaultStepOptions = {
      cancelIcon: {
        enabled: true
      }
    };
    this.shepherdService.modal = true;
    // this.shepherdService.addSteps(lessonTourSteps);
    if (this.course.participantProgress === 0) {
      this.startTour();
    }
  }

  startTour() {
    this.shepherdService.start();
  }

}
