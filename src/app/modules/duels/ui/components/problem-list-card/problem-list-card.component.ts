import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DuelProblem } from '@duels/domain';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'problem-list-card',
  templateUrl: './problem-list-card.component.html',
  styleUrls: ['./problem-list-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    KepCardComponent
  ]
})
export class ProblemListCardComponent {
  @Input({ required: true }) duelProblem!: DuelProblem;
}
