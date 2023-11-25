import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contest, Contestant } from '../../../contests.models';
import { ContestsService } from '../../../contests.service';

@Component({
  selector: 'app-contest-rating-changes',
  templateUrl: './contest-rating-changes.component.html',
  styleUrls: ['./contest-rating-changes.component.scss']
})
export class ContestRatingChangesComponent implements OnInit, OnDestroy {

  public contentHeader: ContentHeader;
  
  public contest: Contest;
  public contestants: Array<Contestant> = [];

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ContestsService,
    public route: ActivatedRoute,
    public router: Router,
    public titleService: TitleService,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ contest }) => {
      this.contest = Contest.fromJSON(contest);
      this.titleService.updateTitle(this.route, { contestTitle: contest.title } );
      this.loadContentHeader();
      this.loadContestants();
    })

    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => this.currentUser = user);
  }

  loadContentHeader(){
    this.contentHeader = {
      headerTitle: 'CONTESTS.RATING_CHANGES',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../..'
          },
          {
            name: this.contest.id+'',
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

  loadContestants(){
    this.service.getContestants(this.contest.id).subscribe((result: any) => {
      this.contestants = result.map((data: any) => Contestant.fromJSON(data));
      this.reassignRanks();
    });
  }

  reassignRanks(){
    for(var index = 0; index < this.contestants.length; index++){
      if(index == 0){
        this.contestants[index].rank = 1;
      } else {
        this.contestants[index].rank = this.contestants[index - 1].rank;
        if(this.contestants[index].points != this.contestants[index - 1].points ||
           this.contestants[index].penalties != this.contestants[index - 1].penalties){
             this.contestants[index].rank = index+1;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
