import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { Course, CourseKeyword, CourseLesson } from '@courses/interfaces';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from '@courses/pages/course-lesson/sidebar/sidebar.component';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    DragulaModule,
    SidebarComponent,
  ]
})
export class TrainingComponent implements OnInit {

  public course: Course;
  public courseLessons: Array<CourseLesson> = [];
  public courseDictionary: Array<CourseKeyword> = [];

  public score = 0;
  public all = 0;

  public questionType = 1;
  public questionBody = '';
  public questionOptions = [];

  public singleRadio: number;
  public correctAnswerIndex: number;

  public conformityGroupOne = [];
  public conformityGroupTwo = [];

  contentHeader = {
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

  constructor(
    public route: ActivatedRoute,
    private dragulaService: DragulaService,
    public toastr: ToastrService,
  ) {
    this.route.data.subscribe(({ course, courseLessons, courseDictionary }) => {
      this.course = course;
      this.courseLessons = courseLessons.map((data: any) => {
        return CourseLesson.fromJSON(data);
      });
      this.courseDictionary = courseDictionary;
      this.contentHeader.breadcrumb.links[1].name = this.course.title;
    });
  }

  ngOnInit(): void {
    this.makeRandomQuestion();
  }

  makeRandomQuestion() {
    if (Math.random() > 1) {
      this.questionType = 1;
    } else {
      this.questionType = 4;
    }
    if (this.questionType === 1) {
      let randomIndex = Math.floor(Math.random() * this.courseDictionary.length);
      const randomKeyword = this.courseDictionary[randomIndex];
      this.questionBody = randomKeyword.meaning;
      this.questionOptions = [];
      while (this.questionOptions.length !== 4) {
        const randomIndex = Math.floor(Math.random() * this.courseDictionary.length);
        if (this.courseDictionary[randomIndex].keyword === randomKeyword.keyword) {
          continue;
        }
        if (this.questionOptions.indexOf(this.courseDictionary[randomIndex].keyword) !== -1) {
          continue;
        }
        this.questionOptions.push(this.courseDictionary[randomIndex].keyword);
      }
      if (Math.random() < 0.8) {
        this.questionOptions.push(randomKeyword.keyword);
      } else {
        this.questionOptions.push('To`g`ri javob keltirilmagan');
      }
     randomIndex = Math.floor(Math.random() * 5);
      this.correctAnswerIndex = randomIndex;
      [this.questionOptions[randomIndex], this.questionOptions[4]] = [
        this.questionOptions[4], this.questionOptions[randomIndex]];
    } else if (this.questionType === 4) {
      this.conformityGroupOne = [];
      this.conformityGroupTwo = [];
      while (this.conformityGroupOne.length !== 5) {
        const randomIndex = Math.floor(Math.random() * this.courseDictionary.length);
        if (this.conformityGroupOne.indexOf(this.courseDictionary[randomIndex].keyword) !== -1) {
          continue;
        }
        this.conformityGroupOne.push(this.courseDictionary[randomIndex].keyword);
        this.conformityGroupTwo.push(this.courseDictionary[randomIndex].meaning);
      }
    }
  }

  answerCheck() {
    if (this.singleRadio === this.correctAnswerIndex) {
      this.score++;
      this.toastr.success('', 'Success', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    } else {
      this.toastr.error('', 'Error', {
        toastClass: 'toast ngx-toastr',
        closeButton: true
      });
    }
    this.all++;
    this.singleRadio = null;
    this.makeRandomQuestion();
  }

}
