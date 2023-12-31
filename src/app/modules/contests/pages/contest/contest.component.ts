import { Component, OnInit } from '@angular/core';
import { fadeInUpOnEnterAnimation } from 'angular-animations';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { Contest } from '@contests/contests.models';
import { BasePageComponent } from '@shared/components/classes/base-page.component';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.scss'],
  animations: [fadeInUpOnEnterAnimation()]
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
