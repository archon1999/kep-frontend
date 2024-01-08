import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '@shared/components/classes/base-page.component';
import { ContentHeader } from '@layout/components/content-header/content-header.component';
import { Contest, ContestRegistrant } from '@contests/contests.models';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ContestsService } from '@contests/contests.service';

@Component({
  selector: 'app-contest-registrants',
  templateUrl: './contest-registrants.component.html',
  styleUrl: './contest-registrants.component.scss',
  animations: [
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation(),
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
