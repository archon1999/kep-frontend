import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule, NgbProgressbarModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from 'app/auth/helpers';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { DragulaModule } from 'ng2-dragula';
import { CountUpModule } from 'ngx-countup';
import { HighlightModule } from 'ngx-highlightjs';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ToastrModule } from 'ngx-toastr';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { ClipboardModule } from '../../shared/components/clipboard/clipboard.module';
import { CodeEditorModule } from '../../shared/components/code-editor/code-editor.module';
import { UserPopoverModule } from '../../shared/components/user-popover/user-popover.module';
import { MathjaxModule } from '../../shared/third-part-modules/mathjax/mathjax.module';
import { QuillModule } from '../../shared/third-part-modules/quill/quill.module';
import { CourseBestParticipantsComponent } from './course/course-best-participants/course-best-participants.component';
import { CourseHeaderComponent } from './course/course-header/course-header.component';
import { CourseInfoComponent } from './course/course-info/course-info.component';
import { CourseLessonsComponent } from './course/course-lessons/course-lessons.component';
import { LessonCardComponent } from './course/course-lessons/lesson-card/lesson-card.component';
import { CourseStatisticsComponent } from './course/course-statistics/course-statistics.component';
import { CourseComponent } from './course/course.component';
import { DictionaryComponent } from './course/dictionary/dictionary.component';
import { TrainingComponent } from './course/dictionary/training/training.component';
import { LessonComponent } from './course/lesson/lesson.component';
import { PartCommentsComponent } from './course/lesson/part-comments/part-comments.component';
import { LectureComponent } from './course/lesson/part/lecture/lecture.component';
import { PartComponent } from './course/lesson/part/part.component';
import { AttemptsTableComponent } from './course/lesson/part/problem/attempts-table/attempts-table.component';
import { ProblemComponent } from './course/lesson/part/problem/problem.component';
import { QuestionComponent } from './course/lesson/part/question/question.component';
import { SidebarComponent } from './course/lesson/sidebar/sidebar.component';
import { ReviewsComponent } from './course/course-reviews/reviews.component';
import { CoursesComponent } from './courses.component';
import { CourseGuard } from './courses.guard';
import { CourseDictionaryResolver, CourseLessonResolver, CourseLessonsResolver, CourseResolver, CoursesResolver } from './courses.resolver';
import { SidebarComponent as CoursesSidebarComponent } from './sidebar/sidebar.component';
import { ReviewCardComponent } from './course/course-reviews/review-card/review-card.component';
import { ProblemsPipesModule } from '../problems/pipes/problems-pipes.module';

const routes: Routes = [
  { 
    path: '',
    component: CoursesComponent,
    data: { animation: 'courses' },
    resolve: {
      courses: CoursesResolver,
    },
    title: 'Courses.Courses',
  },
  {
    path: 'course/:courseId',
    component: CourseComponent,
    resolve: {
      course: CourseResolver,
      courseLessons: CourseLessonsResolver,
    },
    canActivate: [CourseGuard],
    data: {
      title: 'Courses.Course',
    }
  },
  {
    path: 'course/:courseId/lesson/:lessonNumber',
    component: LessonComponent,
    data: { animation: 'lesson', title: 'Courses.CourseLesson' },
    resolve: {
      courseLessons: CourseLessonsResolver,
      courseLesson: CourseLessonResolver,
      course: CourseResolver
    },
    canActivate: [AuthGuard, CourseGuard],
  },
  {
    path: 'course/:courseId/dictionary',
    component: DictionaryComponent,
    data: { animation: 'course-dictionary' },
    resolve: {
      courseLessons: CourseLessonsResolver,
      course: CourseResolver,
      courseDictionary: CourseDictionaryResolver,
    },
    canActivate: [AuthGuard, CourseGuard],
  },
  {
    path: 'course/:courseId/dictionary/training',
    component: TrainingComponent,
    data: { animation: 'course-dictionary-training' },
    resolve: {
      courseLessons: CourseLessonsResolver,
      course: CourseResolver,
      courseDictionary: CourseDictionaryResolver,
    },
    canActivate: [AuthGuard, CourseGuard],
  }
];

@NgModule({
  declarations: [
    CoursesComponent,
    CourseComponent,
    LessonComponent,
    DictionaryComponent,
    PartComponent,
    LectureComponent,
    QuestionComponent,
    ProblemComponent,
    PartCommentsComponent,
    SidebarComponent,
    AttemptsTableComponent,
    ReviewsComponent,
    CoursesSidebarComponent,
    TrainingComponent,
    CourseHeaderComponent,
    CourseLessonsComponent,
    CourseInfoComponent,
    CourseStatisticsComponent,
    LessonCardComponent,
    CourseBestParticipantsComponent,
    ReviewCardComponent,
  ],
  imports: [
    CoreDirectivesModule,
    TranslateModule,
    ContentHeaderModule,
    CorePipesModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgbRatingModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    MathjaxModule,
    CodeEditorModule,
    NgbModule,
    FormsModule,
    ClipboardModule,
    ToastrModule,
    MonacoEditorModule,
    DragulaModule.forRoot(),
    UserPopoverModule,
    BlockUIModule.forRoot(),
    HighlightModule,
    NgxUsefulSwiperModule,
    QuillModule,
    CountUpModule,
    ProblemsPipesModule,
  ],
  providers: [
    CourseGuard,
    CourseDictionaryResolver,
    CourseLessonResolver,
    CourseLessonsResolver,
    CourseResolver,
    CoursesResolver,
  ],
})
export class CoursesModule { }
