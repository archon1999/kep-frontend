import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ArenaParticipationActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-arena-participation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.ArenaParticipation.Description' | translate: {
        title: activity.payload.arenaTitle
      } }}
    </p>
    <div class="d-flex flex-wrap gap-2 mt-2">
      <span class="badge bg-primary-transparent fw-medium">
        {{ 'UserActivityHistory.Types.ArenaParticipation.Points' | translate: { points: activity.payload.points ?? 0 } }}
      </span>
      <span class="badge bg-secondary-transparent fw-medium">
        {{ 'UserActivityHistory.Types.ArenaParticipation.Rank' | translate: { rank: activity.payload.rank ?? '-' } }}
      </span>
    </div>
    <p class="mb-0 text-muted fs-13 mt-2" *ngIf="activity.payload.finishTime">
      {{ 'UserActivityHistory.Types.ArenaParticipation.FinishTime' | translate: {
        time: (activity.payload.finishTime | date:'medium')
      } }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryArenaParticipationComponent {
  @Input({ required: true }) activity!: ArenaParticipationActivity;
}
