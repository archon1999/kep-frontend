import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Problem } from '@problems/models/problems.models';
import { ProblemComponent } from '../problem.component';
import { ProblemAttemptsComponent } from './problem-attempts.component';

@Component({
  standalone: true,
  imports: [ProblemAttemptsComponent],
  template: `
    @if (problem && submitEvent$) {
      <problem-attempts
        [problem]="problem"
        [submitEvent]="submitEvent$"
        (hackSubmitted)="onHackSubmitted()"
      ></problem-attempts>
    }
  `,
})
export class ProblemAttemptsRouteComponent {
  private readonly parent = inject(ProblemComponent);

  get problem(): Problem | undefined {
    return this.parent.problem;
  }

  get submitEvent$(): Observable<void> {
    return this.parent.submitEvent$;
  }

  onHackSubmitted() {
    this.parent.navigateToHacks();
  }
}
