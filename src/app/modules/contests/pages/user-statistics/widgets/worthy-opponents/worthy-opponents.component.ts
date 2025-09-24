import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ContestUserStatisticsOpponent } from '@contests/models';
import { Resources, getResourceById } from '@app/resources';

@Component({
  selector: 'contests-user-statistics-worthy-opponents',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, KepCardComponent],
  templateUrl: './worthy-opponents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestsUserStatisticsWorthyOpponentsComponent {
  @Input() opponents: ContestUserStatisticsOpponent[] = [];

  public getContestLink(contestId: number) {
    return getResourceById(Resources.Contest, contestId);
  }
}
