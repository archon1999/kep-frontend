import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject, asyncScheduler } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { Attempt } from '../../models/attempts.models';

const RELOAD_INTERVAL_TIME = 30000;

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.component.html',
  styleUrls: ['./attempts.component.scss']
})
export class AttemptsComponent implements OnInit, OnDestroy {

  public contentHeader = {
    headerTitle: 'Attempts',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Problems',
          isLink: true,
          link: '/practice/problems'
        }
      ]
    }
  };

  public currentPage: number = 1;
  public totalAttemptsCount: number;
  public attempts: Array<Attempt> = [];

  public myAttempts: boolean = false;
  public currentUser: User;

  private _reloader = new Subject();
  private _unsubscribeAll = new Subject();
  private _intervalId: any;

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
        if (user) {
          this.myAttempts = true;
        }
        this._reloader.next();
        this._intervalId = setInterval(() => this._reloader.next(), RELOAD_INTERVAL_TIME);
      }
    );

    this._reloader.pipe(
      throttleTime(500, asyncScheduler, { leading: true, trailing: true }),
      takeUntil(this._unsubscribeAll),
    ).subscribe(
      () => {
        this._loadPage();
      }
    )
  }

  private _loadPage() {
    var params: any = { page: this.currentPage };
    if (this.myAttempts && this.currentUser) {
      params.username = this.currentUser.username;
    }
    this.api.get('attempts', params).subscribe((result: any) => {
      this.attempts = result.data;
      this.totalAttemptsCount = result.total;
    });
  }

  ngOnDestroy(): void {
    if(this._intervalId){
      clearInterval(this._intervalId);
    }
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
