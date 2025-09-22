import { Component, inject } from '@angular/core';
import { ProblemAttemptsComponent } from './problem-attempts.component';
import { ProblemComponent } from '../problem.component';
import { Problem } from '../../../models/problems.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-problem-attempts-route',
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
    this.parent.onHackSubmitted();
  }
}
