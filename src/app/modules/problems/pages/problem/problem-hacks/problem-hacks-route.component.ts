import { Component, inject } from '@angular/core';
import { Problem } from '@problems/models/problems.models';
import { ProblemComponent } from '../problem.component';
import { ProblemHacksComponent } from './problem-hacks.component';

@Component({
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
