import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { IconNamePipe } from '@shared/pipes/feather-icons.pipe';
import { KepDeltaComponent } from '@shared/components/kep-delta/kep-delta.component';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { NgIf } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Contest, Contestant, ContestProblem, ContestProblemInfo } from '@contests/models';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { RouterLink } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { BaseUserComponent } from '@app/common';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ContestTypes } from '@contests/constants';

@Component({
  selector: 'contest-standings-table',
  standalone: true,
  imports: [
    ContestantViewModule,
    IconNamePipe,
    KepDeltaComponent,
    KepTableComponent,
    NgIf,
    NgbTooltip,
    TranslateModule,
    KepIconComponent,
    RouterLink,
    CoreCommonModule
  ],
  templateUrl: './contest-standings-table.component.html',
  styleUrl: './contest-standings-table.component.scss',
  animations: [fadeInOnEnterAnimation()],
})
export class ContestStandingsTableComponent extends BaseUserComponent implements OnChanges {
  @Input() contest: Contest;
  @Input() contestants: Contestant[];
  @Input() contestProblems: ContestProblem[];
  @Input() isLoading = false;

  ngOnChanges(changes: SimpleChanges) {
    if ('contestants' in changes) {
      this.preprocessContestants();
    }
  }

  getProblemInfoBySymbol(
    problemsInfo: Array<ContestProblemInfo>,
    problemSymbol: string
  ): ContestProblemInfo | undefined {
    return problemsInfo.find(problemInfo => problemInfo.problemSymbol === problemSymbol);
  }

  preprocessContestants() {
    if (this.contest.type === ContestTypes.ACM20M) {
      let rowClass: 'row-even' | 'row-odd' = 'row-even';
      this.contestants.forEach(
        (contestant, index) => {
          if (index && contestant.points !== this.contestants[index - 1].points) {
            if (rowClass === 'row-even') {
              rowClass = 'row-odd';
            } else {
              rowClass = 'row-even';
            }
          }
          contestant.rowClass = rowClass;
        }
      );
    }
  }
}
