import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ProblemDifficultyColorPipe } from '@problems/pipes/problem-difficulty-color.pipe';
import { getResourceById, Resources } from '@app/resources';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'problem-card',
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule, ProblemDifficultyColorPipe],
  templateUrl: './problem-card.component.html',
  styleUrl: './problem-card.component.scss',
  animations: [fadeInOnEnterAnimation()]
})
export class ProblemCardComponent {
  @Input() problem: Problem;

  protected readonly getResourceById = getResourceById;
  protected readonly Resources = Resources;
}
