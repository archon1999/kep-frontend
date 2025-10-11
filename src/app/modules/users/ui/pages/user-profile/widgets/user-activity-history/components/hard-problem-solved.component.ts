import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HardProblemSolvedActivity } from '@users/domain';

@Component({
  selector: 'user-activity-history-hard-problem-solved',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.Types.HardProblemSolved.Description' | translate: {
        title: activity.payload.problemTitle,
        difficulty: activity.payload.difficulty
      } }}
    </p>
    <p class="mb-0 text-muted fs-13 mt-2">
      {{ 'UserActivityHistory.Types.HardProblemSolved.Problem' | translate: { id: activity.payload.problemId } }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivityHistoryHardProblemSolvedComponent {
  @Input({ required: true }) activity!: HardProblemSolvedActivity;
}
