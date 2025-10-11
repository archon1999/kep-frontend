import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProblemAttemptSummaryActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-problem-attempt-summary',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.ProblemAttemptSummary.Description' | translate: {
        accepted: activity.payload.accepted,
        total: activity.payload.total
      } }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryProblemAttemptSummaryComponent {
  @Input({ required: true }) activity!: ProblemAttemptSummaryActivity;
}
