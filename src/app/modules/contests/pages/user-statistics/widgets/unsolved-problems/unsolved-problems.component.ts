import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ContestUserStatisticsUnsolvedProblem } from '@contests/models';
import { Resources, getResourceByParams } from '@app/resources';

@Component({
  selector: 'contests-user-statistics-unsolved-problems',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, KepCardComponent],
  templateUrl: './unsolved-problems.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestsUserStatisticsUnsolvedProblemsComponent {
  @Input() problems: ContestUserStatisticsUnsolvedProblem[] = [];

  public getContestProblemLink(contestId: number, symbol: string) {
    return getResourceByParams(Resources.ContestProblem, { id: contestId, symbol });
  }
}
