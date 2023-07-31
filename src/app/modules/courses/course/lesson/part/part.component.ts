import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourseLesson, CourseLessonPart } from '../../../../courses/courses.models';

@Component({
  selector: 'lesson-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class PartComponent implements OnInit {

  @Input() lessonPart: CourseLessonPart;
  @Input() lesson: CourseLesson;
  @Output() checkPartCompletionEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  checkCompletionEvent(result: any){
    this.checkPartCompletionEvent.emit(result);
  }

}
