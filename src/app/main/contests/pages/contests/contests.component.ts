import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { ApiService } from 'app/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contest, ContestsRating } from '../../contests.models';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ delay: 700, duration: 2000 }),
    fadeInRightOnEnterAnimation({ delay: 900, duration: 2000 }),
    fadeInRightOnEnterAnimation({ anchor: 'contests', duration: 3000 }),
    fadeInUpOnEnterAnimation({ delay: 0, duration: 1500 }),
  ]
})
export class ContestsComponent implements OnInit, OnDestroy {

  public contests: Array<Contest> = [];
  public currentPage: number = 1;
  public totalContests: number = 0;

  public topContestsRating: Array<ContestsRating> = [];

  public currentUser: User = this.authService.currentUserValue;

  public contestTypes = ['All', 'ACM20M', 'ACM2H', 'Ball525',
                         'Ball550', 'LessLine', 'LessCode',
                         'OneAttempt', 'IQ', 'Exam', 'MultiL', 'CodeGolf'];
  contestType: number = 0;
  contestStatus: number = 2;
  contestCategory = 0;

  private _unsubscribeAll = new Subject();

  constructor(
    public coreConfigService: CoreConfigService,
    public api: ApiService,
    public route: ActivatedRoute,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.api.get('contests-rating').subscribe((result: any) => {
      this.topContestsRating = result.data.map((data: any) => {
        return ContestsRating.fromJSON(data);
      });
    })

    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        this.currentUser = user;
      });

    this.reloadContests();
  }

  reloadContests() {
    let params: any = { page_size: 7 };
    params.page = this.currentPage;

    if(this.contestCategory){
      params.category = this.contestCategory;
    }

    if (this.contestType) {
      params.type = this.contestTypes[this.contestType];
    }

    if (this.contestStatus != 2) {
      params.is_participated = this.contestStatus;
    }

    this.api.get('contests', params).subscribe(
      (result: any) => {
        this.contests = result.data.map((contest: Contest) => {
          return Contest.fromJSON(contest);
        }).sort((ca, cb) => {
          if(ca.status != cb.status){
            return +(ca.status < cb.status);
          } else {
            if(ca.status == -1){
              return -(ca.startTime < cb.startTime);
            } else {
              return +(ca.startTime < cb.startTime);
            }
          }
        });
        this.totalContests = result.total;
      }
    )
  }

  contestCategoryClick(category: number){
    this.currentPage = 1;
    this.contestCategory = category;
    this.reloadContests();
  }

  contestTypeClick(index: number){
    this.currentPage = 1;
    this.contestType = index;
    this.reloadContests();
  }

  contestStatusClick(status: number) {
    this.currentPage = 1;
    this.contestStatus = status;
    this.reloadContests();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
