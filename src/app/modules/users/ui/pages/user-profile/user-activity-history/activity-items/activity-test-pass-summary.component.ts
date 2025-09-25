import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TestPassSummaryActivity } from '@users/domain';

@Component({
  selector: 'user-activity-test-pass-summary',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{
        'UserActivityHistory.TestPassSummary' |
          translate : {
            total: activity.payload.total,
            solved: activity.payload.solved,
            completed: activity.payload.completed
          }
      }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityTestPassSummaryComponent {
  @Input({required: true}) activity!: TestPassSummaryActivity;
}
