import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { asyncScheduler, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { HackAttempt } from '@problems/models/hack-attempt.models';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { HackAttemptsTableModule } from '@problems/components/hack-attempts-table/hack-attempts-table.module';

const RELOAD_INTERVAL_TIME = 30000;

@Component({
  selector: 'app-hack-attempts',
  templateUrl: './hack-attempts.component.html',
  styleUrls: ['./hack-attempts.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    PaginationModule,
    HackAttemptsTableModule,
  ],
})
export class HackAttemptsComponent implements OnInit, OnDestroy {

  public contentHeader = {
    headerTitle: 'HackAttempts',
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

  public currentPage = 1;
  public totalAttemptsCount: number;
  public hackAttempts: Array<HackAttempt> = [];

  public myAttempts = false;
  public currentUser: User;

  protected _reloader = new Subject();
  private _unsubscribeAll = new Subject();
  private _intervalId: any;

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
        if (user) {
          this.myAttempts = true;
        }
        setTimeout(() => this._reloader.next(null), 100);
      }
    );

    this._reloader.pipe(
      throttleTime(500, asyncScheduler, { leading: true, trailing: true }),
      takeUntil(this._unsubscribeAll),
    ).subscribe(
      () => {
        this._loadPage();
      }
    );

    this._intervalId = setInterval(() => this._reloader.next(null), RELOAD_INTERVAL_TIME);
  }

  ngOnDestroy(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private _loadPage() {
    const params: any = { page: this.currentPage };
    if (this.myAttempts && this.currentUser) {
      params.username = this.currentUser.username;
    }
    this.api.get('hack-attempts', params).subscribe((result: any) => {
      this.hackAttempts = result.data;
      this.totalAttemptsCount = result.total;
    });
  }

}
