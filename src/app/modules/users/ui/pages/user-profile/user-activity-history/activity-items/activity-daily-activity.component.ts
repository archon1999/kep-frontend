import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DailyActivityActivity } from '@users/domain';

@Component({
  selector: 'user-activity-daily-activity',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{
        'UserActivityHistory.DailyActivityValue' |
          translate : { value: activity.payload.value }
      }}
    </p>
    @if (activity.payload.note) {
      <p class="mb-0 text-muted fs-12">
        {{ 'UserActivityHistory.Note' | translate }}: {{ activity.payload.note }}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityDailyActivityComponent {
  @Input({required: true}) activity!: DailyActivityActivity;
}
