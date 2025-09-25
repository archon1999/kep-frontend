import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DailyActivityActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-daily-activity',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.DailyActivity.Description' | translate: { value: activity.payload.value } }}
    </p>
    <p class="mb-0 text-muted fs-13 mt-2" *ngIf="activity.payload.note">
      {{ 'UserActivityHistory.Types.DailyActivity.Note' | translate: { note: activity.payload.note } }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryDailyActivityComponent {
  @Input({ required: true }) activity!: DailyActivityActivity;
}
