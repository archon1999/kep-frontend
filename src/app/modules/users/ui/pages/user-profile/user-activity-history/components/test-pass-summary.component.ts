import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TestPassSummaryActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-test-pass-summary',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.TestPassSummary.Description' | translate: {
        completed: activity.payload.completed,
        total: activity.payload.total,
        solved: activity.payload.solved
      } }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryTestPassSummaryComponent {
  @Input({ required: true }) activity!: TestPassSummaryActivity;
}
