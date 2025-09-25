import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Resources } from '@app/resources';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { HardProblemSolvedActivity } from '@users/domain';

@Component({
  selector: 'user-activity-hard-problem-solved',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ResourceByIdPipe],
  template: `
    <p class="mb-0 text-muted fs-14">
      {{ 'UserActivityHistory.HardProblemSolvedDescription' | translate }}
      <a
        [routerLink]="Resources.Problem | resourceById: activity.payload.problemId"
        class="fw-semibold"
      >
        {{ activity.payload.problemTitle }}
      </a>
    </p>
    <p class="mb-0 text-muted fs-12">
      {{ 'Difficulty' | translate }}: {{ activity.payload.difficulty }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityHardProblemSolvedComponent {
  @Input({required: true}) activity!: HardProblemSolvedActivity;
  protected readonly Resources = Resources;
}
