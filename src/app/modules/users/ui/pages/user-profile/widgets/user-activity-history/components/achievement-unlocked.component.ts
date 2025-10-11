import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AchievementUnlockedActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-achievement-unlocked',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.AchievementUnlocked.Description' | translate: { message: activity.payload.message } }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryAchievementUnlockedComponent {
  @Input({ required: true }) activity!: AchievementUnlockedActivity;
}
