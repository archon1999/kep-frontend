import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { randomInt } from '@shared/utils';
import { CourseLesson } from '@courses/interfaces';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lesson-card',
  templateUrl: './lesson-card.component.html',
  styleUrls: ['./lesson-card.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule],
  encapsulation: ViewEncapsulation.None,
})
export class LessonCardComponent implements OnInit {
  @Input() lesson: CourseLesson;

  public backgroundPosition = 'left';

  constructor() { }

  ngOnInit(): void {
    this.update();
  }

  update() {
    const positions = ['left', 'center', 'right'];
    const randomPosition = positions[randomInt(0, 2)];
    this.backgroundPosition = randomPosition;
    setTimeout(() => {
      this.update();
    }, randomInt(1, 3000));
  }
}
