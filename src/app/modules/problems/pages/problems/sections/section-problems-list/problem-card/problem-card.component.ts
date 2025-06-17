import { Component, Input } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ProblemDifficultyColorPipe } from '@problems/pipes/problem-difficulty-color.pipe';
import { getResourceById, Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'problem-card',
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule, ProblemDifficultyColorPipe, ResourceByIdPipe, KepCardComponent],
  templateUrl: './problem-card.component.html',
  styleUrl: './problem-card.component.scss',
})
export class ProblemCardComponent {
  @Input() problem: Problem;

  protected readonly getResourceById = getResourceById;
  protected readonly Resources = Resources;
}
