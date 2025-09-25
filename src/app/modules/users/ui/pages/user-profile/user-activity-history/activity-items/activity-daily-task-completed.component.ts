import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DailyTaskCompletedActivity } from '@users/domain';

@Component({
  selector: 'user-activity-daily-task-completed',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{
        'UserActivityHistory.DailyTaskCompleted' |
          translate : { description: activity.payload.description }
      }}
    </p>
    <div class="text-muted fs-12 d-flex flex-wrap gap-2">
      <span>
        {{ 'UserActivityHistory.TaskType' | translate }}: {{ activity.payload.taskType }}
      </span>
      <span>
        {{ 'UserActivityHistory.TaskId' | translate }}: {{ activity.payload.taskId }}
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityDailyTaskCompletedComponent {
  @Input({required: true}) activity!: DailyTaskCompletedActivity;
}
