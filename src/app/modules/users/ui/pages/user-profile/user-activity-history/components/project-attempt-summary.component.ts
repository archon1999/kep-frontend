import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectAttemptSummaryActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-project-attempt-summary',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.ProjectAttemptSummary.Description' | translate: {
        checked: activity.payload.checked,
        total: activity.payload.total
      } }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryProjectAttemptSummaryComponent {
  @Input({ required: true }) activity!: ProjectAttemptSummaryActivity;
}
