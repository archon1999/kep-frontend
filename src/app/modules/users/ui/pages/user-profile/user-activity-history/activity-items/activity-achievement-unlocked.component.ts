import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AchievementUnlockedActivity } from '@users/domain';

@Component({
  selector: 'user-activity-achievement-unlocked',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.AchievementUnlockedDescription' | translate }}
    </p>
    <p class="mb-0 text-muted fs-12">{{ activity.payload.message }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityAchievementUnlockedComponent {
  @Input({required: true}) activity!: AchievementUnlockedActivity;
}
