import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { asyncScheduler, interval, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { Attempt } from '@problems/models/attempts.models';
import { GlobalService } from '@shared/services/global.service';
import { SpinnersEnum } from '@shared/components/spinner/spinners.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { CoreCommonModule } from '@core/common.module';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';

const RELOAD_INTERVAL_TIME = 30000;

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.component.html',
  styleUrls: ['./attempts.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    SpinnerComponent,
    AttemptsTableModule,
    KepPaginationComponent,
    ContentHeaderModule,
  ]
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

  public currentPage = 1;
  public isLoading = true;
  public totalAttemptsCount: number;
  public attempts: Array<Attempt> = [];

  public myAttempts = false;
  public currentUser: User;

  protected readonly SpinnersEnum = SpinnersEnum;
  protected _reloader = new Subject();
  private _unsubscribeAll = new Subject();
  private _intervalId: any;

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public globalService: GlobalService,
    public spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.globalService.currentUser$.subscribe(
      (user: any) => {
        this.currentUser = user;
        if (user) {
          this.myAttempts = true;
          setTimeout(() => this._reloader.next(null), 100);
        } else {
          this.myAttempts = false;
        }
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

    interval(RELOAD_INTERVAL_TIME).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => {
        this._reloader.next(null);
      }
    );
  }

  ngOnDestroy(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private _loadPage() {
    this.spinner.show(SpinnersEnum.AttemptsTable);
    const params: any = { page: this.currentPage };
    this.isLoading = true;
    if (this.myAttempts && this.currentUser) {
      params.username = this.currentUser.username;
    }
    this.api.get('attempts', params).subscribe((result: any) => {
      this.attempts = result.data;
      this.totalAttemptsCount = result.total;
      this.isLoading = false;
      this.spinner.hide(SpinnersEnum.AttemptsTable);
    });
  }
}
