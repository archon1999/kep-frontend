import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContestParticipationActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-contest-participation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.ContestParticipation.Description' | translate: {
        title: activity.payload.contestTitle
      } }}
    </p>
    <div class="d-flex flex-wrap gap-2 mt-2">
      <span class="badge bg-primary-transparent fw-medium">
        <ng-container *ngIf="activity.payload.rank !== null && activity.payload.rank !== undefined; else noRank">
          {{ 'UserActivityHistory.Types.ContestParticipation.Rank' | translate: { rank: activity.payload.rank } }}
        </ng-container>
        <ng-template #noRank>
          {{ 'UserActivityHistory.Types.ContestParticipation.Rank' | translate: { rank: ('UserActivityHistory.Types.ContestParticipation.NoRank' | translate) } }}
        </ng-template>
      </span>
      <span class="badge fw-medium" [ngClass]="deltaBadgeClass">
        {{ 'UserActivityHistory.Types.ContestParticipation.RatingChange' | translate: { delta: formattedDelta } }}
      </span>
      <span class="badge bg-info-transparent fw-medium"
            *ngIf="activity.payload.ratingBefore !== null && activity.payload.ratingAfter !== null">
        {{ 'UserActivityHistory.Types.ContestParticipation.Rating' | translate: {
          before: activity.payload.ratingBefore,
          after: activity.payload.ratingAfter
        } }}
      </span>
      <span class="badge bg-warning-transparent fw-medium"
            *ngIf="activity.payload.bonus">
        {{ 'UserActivityHistory.Types.ContestParticipation.Bonus' | translate: { bonus: activity.payload.bonus } }}
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryContestParticipationComponent {
  @Input({ required: true }) activity!: ContestParticipationActivity;

  get formattedDelta(): string {
    const delta = this.activity.payload.delta ?? 0;
    if (delta > 0) {
      return `+${delta}`;
    }
    return delta.toString();
  }

  get deltaBadgeClass(): string {
    const delta = this.activity.payload.delta ?? 0;
    if (delta > 0) {
      return 'bg-success-transparent';
    }
    if (delta < 0) {
      return 'bg-danger-transparent';
    }
    return 'bg-secondary-transparent';
  }
}
