import { Component, inject } from '@angular/core';
import { ProblemDescriptionComponent } from './problem-description.component';
import { ProblemComponent } from '../problem.component';
import { Problem } from '@problems/models/problems.models';

@Component({
  standalone: true,
  imports: [ProblemDescriptionComponent],
  template: `
    @if (problem) {
      <problem-description [problem]="problem"></problem-description>
    }
  `,
})
export class ProblemDescriptionRouteComponent {
  private readonly parent = inject(ProblemComponent);

  get problem(): Problem | undefined {
    return this.parent.problem;
  }
}
