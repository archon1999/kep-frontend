import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectAttemptSummaryActivity } from '@users/domain';

@Component({
  selector: 'user-activity-project-attempt-summary',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{
        'UserActivityHistory.ProjectAttemptSummary' |
          translate : {
            total: activity.payload.total,
            checked: activity.payload.checked
          }
      }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityProjectAttemptSummaryComponent {
  @Input({required: true}) activity!: ProjectAttemptSummaryActivity;
}
