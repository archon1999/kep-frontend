import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '@shared/components/classes/base-page.component';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ContestsService } from '@contests/contests.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { ContestRegistrant } from '@contests/models/contest-registrant';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'app-contest-registrants',
  templateUrl: './contest-registrants.component.html',
  styleUrl: './contest-registrants.component.scss',
  animations: [
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation(),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestTabComponent,
    ContestantViewModule,
    ContestCardModule,
  ]
})
export class ContestRegistrantsComponent extends BasePageComponent implements OnInit {
  public contest: Contest;
  public registrants: ContestRegistrant[] = [];

  constructor(public service: ContestsService) {
    super();
  }

  ngOnInit() {
    this.route.data.subscribe(
      ({ contest }) => {
        this.contest = contest;
        this.service.getContestRegistrants(this.contest.id).subscribe(
          registrants => this.registrants = registrants
        );
      }
    );
    this.loadContentHeader();
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: 'Registrants',
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest?.id + '',
            isLink: true,
            link: '..'
          },
        ]
      }
    };
  }
}
