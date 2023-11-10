import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContestStatus } from '../../../../../contests/contests.models';
import { Contest, Contestant, ContestProblem, ContestProblemInfo } from '../../user-contests.models';
import { ContestsService } from '../../user-contests.service';

@Component({
  selector: 'app-contest-standings',
  templateUrl: './contest-standings.component.html',
  styleUrls: ['./contest-standings.component.scss']
})
export class ContestStandingsComponent implements OnInit, OnDestroy {

  public contentHeader: ContentHeader;

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];
  public contestants: Array<Contestant> = [];

  public currentUser: User;

  private _intervalId: any;
  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public service: ContestsService,
    public authService: AuthenticationService,
    public titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ contest, contestProblems }) => {
      this.contest = Contest.fromJSON(contest);
      this.contestProblems = contestProblems;
      this.loadContentHeader();
      this.titleService.updateTitle(this.route, { contestTitle: contest.title } );
      this.reloadContestants();
      this.sortProblems();
    })
  
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => this.currentUser = user)

    if(this.contest.status == ContestStatus.ALREADY){
      this._intervalId = setInterval(() => {
        this.reloadPage();
      }, 60000);
    }
  }
  
  loadContentHeader(){
    this.contentHeader = {
      headerTitle: 'CONTESTS.STANDINGS',
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
            name: 'CONTESTS.STANDINGS',
            isLink: true,
            link: '.'
          }
        ]
      }
    };
  }

  reloadContestants(){
    this.service.getContestants(this.contest.id).subscribe((result: any) => {
      this.contestants = result.map((data: any) => {
        return Contestant.fromJSON(data);    
      });
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

  reloadPage(){
    this.service.getContestProblems(this.contest.id).subscribe((result: any) => {
      this.contestProblems = result;
      this.sortProblems();
    });
    this.reloadContestants();
  }

  sortProblems(){
    this.contestProblems = this.contestProblems.sort(function(a, b) {
      let s1 = a.symbol;
      let s2 = b.symbol;
      let a1 = "", a2 = "";
      let x1 = 0, x2 = 0;
      for(let c of s1){
        if(c >= '0' && c <= '9'){
          x1 = x1*10 + +c;
        } else {
          a1 += c;
        }
      }
      for(let c of s2){
        if(c >= '0' && c <= '9'){
          x2 = x2*10 + +c;
        } else {
          a2 += c;
        }
      }

      let x = a1 < a2 || (a1 == a2 && x1 < x2);
      if(x){
        return -1;
      } else {
        return 1;
      }
    });
  }

  getProblemInfoBySymbol(
    problemsInfo: Array<ContestProblemInfo>,
    problemSymbol: string
  ) : ContestProblemInfo | undefined {
    return problemsInfo.find((problemInfo: any) => problemInfo.problemSymbol == problemSymbol);
  }

  ngOnDestroy() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
