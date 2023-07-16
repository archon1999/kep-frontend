import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Course, CourseLesson, CourseLessonPart, CourseLessonPartComment, CourseLessonPartStatus } from '../../courses.models';
import { CoursesService } from '../../courses.service';
import { AuthenticationService } from 'app/auth/service';
import { User } from 'app/auth/models';
import { ApiService } from 'app/api.service';
import { ShepherdService } from 'angular-shepherd';
import { lessonTourSteps } from './lesson.tour';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TitleService } from 'app/title.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LessonComponent implements OnInit{

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
    public authService: AuthenticationService,
    public api: ApiService,
    public titleService: TitleService,
    private shepherdService: ShepherdService
  ) { }
  
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
      })
      this.currentLessonPart = this.courseLesson.parts[0];
      this.contentHeader.headerTitle = this.courseLesson.title;
      this.contentHeader.breadcrumb.links[1].name = this.course.title;
    })

    this.authService.currentUser.subscribe((user: any) => {
      if(!user){
        this.router.navigate(['/404'], { skipLocationChange: true });
      }
      this.currentUser = user;
    });

  }

  changeLessonPart(lessonPartIndex: number){
    let parts = this.courseLesson.parts.length;
    this.lessonPartIndex = (lessonPartIndex + parts) % parts;
    this.currentLessonPart = this.courseLesson.parts[this.lessonPartIndex];
    if(this.currentLessonPart.contentType == 'problem'){
      this.currentLessonPart.contentType = '';
      this.lessonPartBlockUI.start();
      setTimeout(() => {
        this.currentLessonPart.contentType = 'problem';
        this.lessonPartBlockUI.stop();
      }, 500);
    }
    this.isCommentsShow = false;
  }

  checkPartCompletionEvent(result: any){
    if(this.courseLesson.parts[this.lessonPartIndex].id != this.currentLessonPart.id) return;
    if(result.success){
      this.currentLessonPart.updateStatus(CourseLessonPartStatus.COMPLETED);
    } else if(this.currentLessonPart.status == CourseLessonPartStatus.NOT_COMPLETED){
      this.currentLessonPart.updateStatus(CourseLessonPartStatus.FAILED);
    }
    this.courseLesson.progress = result.lessonProgress;
    this.course.participantProgress = result.participantProgress;
    this.course.participantPoints = result.participantPoints;
  }

  toogleCommentsButton(){
    if(!this.isCommentsShow){
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
    this.shepherdService.addSteps(lessonTourSteps);
    if(this.course.participantProgress == 0){
      this.startTour();
    }
  }

  startTour() {
    this.shepherdService.start();
  }

}
