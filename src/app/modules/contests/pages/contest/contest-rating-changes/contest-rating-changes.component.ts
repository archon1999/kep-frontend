import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContestsService } from '../../../contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Contest } from '@contests/models/contest';
import { Contestant } from '@contests/models/contestant';
import { BaseLoadComponent } from '@core/common';
import { KepTableComponent } from '@shared/components/kep-table/kep-table.component';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { KepDeltaComponent } from '@shared/components/kep-delta/kep-delta.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'app-contest-rating-changes',
  templateUrl: './contest-rating-changes.component.html',
  styleUrls: ['./contest-rating-changes.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestantViewModule,
    NgbTooltipModule,
    KepTableComponent,
    ContestClassesPipe,
    KepDeltaComponent,
    KepCardComponent,
  ]
})
export class ContestRatingChangesComponent extends BaseLoadComponent<Contestant[]> implements OnInit, OnDestroy {
  public contest: Contest;

  constructor(public service: ContestsService) {
    super();
  }

  get contestants(): Contestant[] {
    return this.data || [];
  }

  ngOnInit(): void {
    this.route.data.subscribe(({contest}) => {
      this.contest = Contest.fromJSON(contest);
      this.titleService.updateTitle(this.route, {contestTitle: contest.title});
      this.loadContentHeader();
      this.loadData();
    });
  }

  protected getContentHeader() {
    return {
      headerTitle: 'CONTESTS.RATING_CHANGES',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest.id + '',
            isLink: true,
            link: '..'
          },
          {
            name: 'CONTESTS.RATING_CHANGES',
            isLink: true,
            link: '.'
          }
        ]
      }
    };
  }

  getData() {
    return this.service.getContestants(this.contest.id);
  }
}
