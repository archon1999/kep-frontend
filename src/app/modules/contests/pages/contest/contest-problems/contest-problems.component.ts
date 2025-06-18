import { Component, OnInit } from '@angular/core';
import { ContestsService } from '@contests/contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestProblemCardComponent } from '@contests/components/contest-problem-card/contest-problem-card.component';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { ContestProblem } from '@contests/models/contest-problem';
import { Contest } from '@contests/models/contest';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { BasePageComponent } from '@app/common';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { KepTableComponent } from "@shared/components/kep-table/kep-table.component";

@Component({
  selector: 'app-contest-problems',
  templateUrl: './contest-problems.component.html',
  styleUrls: ['./contest-problems.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestProblemCardComponent,
    ContestCardModule,
    ContestClassesPipe,
    KepCardComponent,
    KepTableComponent,
  ]
})
export class ContestProblemsComponent extends BasePageComponent implements OnInit {

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];

  constructor(public service: ContestsService) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(({contest, contestProblems}) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblems = contestProblems;
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, {contestTitle: contest.title});
    });
  }

  protected getContentHeader() {
    return {
      headerTitle: this.contest.title,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest.id.toString(),
            isLink: true,
            link: '..'
          },
          {
            name: 'Problems',
            isLink: true,
            link: '.'
          }
        ]
      }
    };
  }
}
