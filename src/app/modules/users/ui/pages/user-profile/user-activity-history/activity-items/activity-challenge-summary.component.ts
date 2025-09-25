import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ChallengeSummaryActivity } from '@users/domain';

@Component({
  selector: 'user-activity-challenge-summary',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{
        'UserActivityHistory.ChallengeSummary' |
          translate : {
            wins: activity.payload.wins,
            draws: activity.payload.draws,
            losses: activity.payload.losses
          }
      }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityChallengeSummaryComponent {
  @Input({required: true}) activity!: ChallengeSummaryActivity;
}
