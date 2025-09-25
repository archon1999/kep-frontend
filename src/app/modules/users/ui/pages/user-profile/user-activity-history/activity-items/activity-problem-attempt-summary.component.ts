import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProblemAttemptSummaryActivity } from '@users/domain';

@Component({
  selector: 'user-activity-problem-attempt-summary',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{
        'UserActivityHistory.ProblemAttemptSummary' |
          translate : {
            total: activity.payload.total,
            accepted: activity.payload.accepted
          }
      }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityProblemAttemptSummaryComponent {
  @Input({required: true}) activity!: ProblemAttemptSummaryActivity;
}
