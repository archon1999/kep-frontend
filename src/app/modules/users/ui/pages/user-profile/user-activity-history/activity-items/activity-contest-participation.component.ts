import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ContestParticipationActivity } from '@users/domain';

@Component({
  selector: 'user-activity-contest-participation',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <p class="mb-1 text-muted fs-14 fw-semibold">
      {{ activity.payload.contestTitle }}
    </p>
    <div class="text-muted fs-12 d-flex flex-wrap gap-2">
      <span>
        {{ 'UserActivityHistory.Rank' | translate }}:
        @if (activity.payload.rank !== null && activity.payload.rank !== undefined) {
          {{ activity.payload.rank }}
        } @else {
          {{ 'UserActivityHistory.NoRank' | translate }}
        }
      </span>
      @if (activity.payload.bonus !== null && activity.payload.bonus !== undefined) {
        <span>
          {{ 'UserActivityHistory.Bonus' | translate }}: {{ activity.payload.bonus }}
        </span>
      }
      @if (activity.payload.ratingBefore !== null && activity.payload.ratingAfter !== null) {
        <span>
          {{ 'UserActivityHistory.Rating' | translate }}:
          {{ activity.payload.ratingBefore }} → {{ activity.payload.ratingAfter }}
        </span>
      }
      @if (activity.payload.delta !== null && activity.payload.delta !== undefined) {
        <span>
          {{ 'UserActivityHistory.RatingChange' | translate }}:
          {{ formatDelta(activity.payload.delta) }}
        </span>
      }
    </div>
    @if (activity.payload.finishTime) {
      <div class="text-muted fs-12">
        {{ 'UserActivityHistory.FinishTime' | translate }}:
        {{ activity.payload.finishTime | date: 'MMM d, y, HH:mm' }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityContestParticipationComponent {
  @Input({required: true}) activity!: ContestParticipationActivity;

  formatDelta(delta: number): string {
    if (delta > 0) {
      return `+${delta}`;
    }
    return delta.toString();
  }
}
