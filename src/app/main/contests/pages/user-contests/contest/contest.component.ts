import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInUpAnimation } from 'angular-animations';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/title.service';
import { Contest } from '../user-contests.models';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.scss'],
  animations: [fadeInUpAnimation({ duration: 1500 })]
})
export class ContestComponent implements OnInit {

  public startAnimationState = false;
  public contentHeader: ContentHeader;

  public contest: Contest;

  constructor(
    public route: ActivatedRoute,
    public titleService: TitleService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.startAnimationState = true, 0);
    this.route.data.subscribe(({ contest }) => {
      this.contest = Contest.fromJSON(contest);
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title } );
    })
  }
  
  loadContentHeader(){
    this.contentHeader = {
      headerTitle: this.contest.title,
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '/competitions/contests'
          },
          {
            name: this.contest.id+'',
            isLink: true,
            link: '.'
          },
        ]
      }
    };
  }
}
