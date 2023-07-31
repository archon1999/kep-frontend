import { Component, Input, OnInit } from '@angular/core';
import { CourseLesson } from '../../../../courses/courses.models';
import { randomInt } from '../../../../../shared/utils/random';

@Component({
  selector: 'lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.scss']
})
export class LessonCardComponent implements OnInit {

  @Input() lesson: CourseLesson;

  public backgroundPosition = 'left';

  constructor() { }

  ngOnInit(): void {
    this.update();
  }

  update(){
    let positions = ['left', 'center', 'right'];
    let randomPosition = positions[randomInt(0, 2)];
    this.backgroundPosition = randomPosition;
    setTimeout(() => {
      this.update();
    }, randomInt(1, 3000));
  }
}
