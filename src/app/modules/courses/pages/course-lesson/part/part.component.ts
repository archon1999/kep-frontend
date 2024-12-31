import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourseLesson, CourseLessonPart } from '@courses/interfaces';
import { LectureComponent } from '@courses/pages/course-lesson/part/lecture/lecture.component';
import { QuestionComponent } from '@courses/pages/course-lesson/part/question/question.component';
import { ProblemComponent } from '@courses/pages/course-lesson/part/problem/problem.component';

@Component({
  selector: 'lesson-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss'],
  standalone: true,
  imports: [
    LectureComponent,
    QuestionComponent,
    ProblemComponent

  ]
})
export class PartComponent implements OnInit {

  @Input() lessonPart: CourseLessonPart;
  @Input() lesson: CourseLesson;
  @Output() checkPartCompletionEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  checkCompletionEvent(result: any) {
    this.checkPartCompletionEvent.emit(result);
  }

}
