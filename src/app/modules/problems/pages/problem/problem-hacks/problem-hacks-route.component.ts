import { Component, inject } from '@angular/core';
import { ProblemHacksComponent } from './problem-hacks.component';
import { ProblemComponent } from '../problem.component';
import { Problem } from '../../../models/problems.models';

@Component({
  selector: 'app-problem-hacks-route',
  standalone: true,
  imports: [ProblemHacksComponent],
  template: `
    @if (problem) {
      <problem-hacks [problem]="problem"></problem-hacks>
    }
  `,
})
export class ProblemHacksRouteComponent {
  private readonly parent = inject(ProblemComponent);

  get problem(): Problem | undefined {
    return this.parent.problem;
  }
}
