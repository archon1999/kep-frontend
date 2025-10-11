import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HardProblemSolvedActivity } from '@users/domain';
import { RouterLink } from "@angular/router";
import { Resources } from "@app/resources";
import { ResourceByIdPipe } from "@shared/pipes/resource-by-id.pipe";

@Component({
  selector: 'user-activity-history-hard-problem-solved',
  standalone: true,
  imports: [TranslateModule, RouterLink, ResourceByIdPipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.HardProblemSolved.Description' | translate: {
        title: activity.payload.problemTitle,
        difficulty: activity.payload.difficulty
      } }}
    </p>
    <a [routerLink]="Resources.Problem | resourceById:activity.payload.problemId" class="mb-0 text-muted fs-13 mt-2">
      {{ 'UserActivityHistory.Types.HardProblemSolved.Problem' | translate: { id: activity.payload.problemId } }}
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryHardProblemSolvedComponent {
  @Input({ required: true }) activity!: HardProblemSolvedActivity;
  protected readonly Resources = Resources;
}
