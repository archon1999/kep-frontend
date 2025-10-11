import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DailyTaskCompletedActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-daily-task-completed',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.DailyTaskCompleted.Description' | translate: { type: activity.payload.taskType } }}
    </p>
    <p class="mb-0 text-muted fs-13 mt-2">
      {{ 'UserActivityHistory.Types.DailyTaskCompleted.Task' | translate: { description: activity.payload.description } }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryDailyTaskCompletedComponent {
  @Input({ required: true }) activity!: DailyTaskCompletedActivity;
}
