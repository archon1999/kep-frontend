import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ArenaParticipationActivity } from '@users/domain';
import { RouterLink } from "@angular/router";
import { Resources } from "@app/resources";
import { ResourceByIdPipe } from "@shared/pipes/resource-by-id.pipe";

@Component({
  selector: 'user-activity-history-arena-participation',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, ResourceByIdPipe],
  template: `
    <a [routerLink]="Resources.ArenaTournament | resourceById:activity.payload.arenaId" class="mb-0 text-muted fs-13 mt-2">
      {{ 'UserActivityHistory.Types.ArenaParticipation.Description' | translate: {
        title: activity.payload.arenaTitle
      } }}
    </a>
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
  protected readonly Resources = Resources;
}
