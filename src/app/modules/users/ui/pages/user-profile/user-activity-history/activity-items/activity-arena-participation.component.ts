import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ArenaParticipationActivity } from '@users/domain';

@Component({
  selector: 'user-activity-arena-participation',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <p class="mb-1 text-muted fs-14 fw-semibold">
      {{ activity.payload.arenaTitle }}
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
      <span>
        {{ 'UserActivityHistory.Points' | translate }}:
        @if (activity.payload.points !== null && activity.payload.points !== undefined) {
          {{ activity.payload.points }}
        } @else {
          {{ 'UserActivityHistory.NoPoints' | translate }}
        }
      </span>
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
export class UserActivityArenaParticipationComponent {
  @Input({required: true}) activity!: ArenaParticipationActivity;
}
