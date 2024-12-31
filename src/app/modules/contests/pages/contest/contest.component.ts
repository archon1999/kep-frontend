import { Component, OnInit } from '@angular/core';
import { fadeInUpOnEnterAnimation } from 'angular-animations';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { BasePageComponent } from '@app/common/classes/base-page.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { ContestCardComponent } from '@contests/components/contest-card/contest-card/contest-card.component';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestsTableModule } from '@contests/components/contests-table/contests-table.module';
import { Contest } from '@contests/models/contest';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.scss'],
  animations: [fadeInUpOnEnterAnimation()],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    ContestCardComponent,
    ContestTabComponent,
    ContestsTableModule,
  ]
})
export class ContestComponent extends BasePageComponent implements OnInit {

  public contest: Contest;

  ngOnInit(): void {
    this.route.data.subscribe(({ contest }) => {
      this.contest = Contest.fromJSON(contest);
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title });
    });
  }

  protected getContentHeader(): ContentHeader {
    return {
      headerTitle: this.contest.title,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../..'
          },
          {
            name: this.contest.id + '',
            isLink: true,
            link: '.'
          },
        ]
      }
    };
  }
}
