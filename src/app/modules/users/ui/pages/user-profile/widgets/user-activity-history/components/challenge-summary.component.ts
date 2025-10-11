import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChallengeSummaryActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-challenge-summary',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.ChallengeSummary.Description' | translate }}
    </p>
    <div class="d-flex flex-wrap gap-2 mt-2">
      <span class="badge bg-success-transparent fw-medium">
        {{ 'UserActivityHistory.Types.ChallengeSummary.Wins' | translate: { value: activity.payload.wins } }}
      </span>
      <span class="badge bg-secondary-transparent fw-medium">
        {{ 'UserActivityHistory.Types.ChallengeSummary.Draws' | translate: { value: activity.payload.draws } }}
      </span>
      <span class="badge bg-danger-transparent fw-medium">
        {{ 'UserActivityHistory.Types.ChallengeSummary.Losses' | translate: { value: activity.payload.losses } }}
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryChallengeSummaryComponent {
  @Input({ required: true }) activity!: ChallengeSummaryActivity;
}
