import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { AuthService, AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KepcoinService } from './kepcoin.service';
import { CoreCommonModule } from '@core/common.module';
import { RouterModule } from '@angular/router';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { KepcoinSpendSwalModule } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'app-kepcoin',
  templateUrl: './kepcoin.component.html',
  styleUrls: ['./kepcoin.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    RouterModule,
    KepcoinViewModule,
    CoreDirectivesModule,
    KepcoinSpendSwalModule,
    KepPaginationComponent,
    KepCardComponent,
  ],
})
export class KepcoinComponent implements OnInit, OnDestroy {

  public spends = [];
  public earns = [];

  public currentPage = 1;
  public total = 0;
  public type = 1;

  public streakFreeze = 0;
  public streak = 0;

  public currentUser: AuthUser;

  protected cdr = inject(ChangeDetectorRef);

  private _unsubscribeAll = new Subject();

  constructor(
    public api: ApiService,
    public authService: AuthService,
    public service: KepcoinService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        this.currentUser = user;
        if (user) {
          this.loadData();
        }
      })
  }

  loadData() {
    this.updatePage();

    this.service.getStreakFreeze().subscribe(
      (result: any) => {
        this.streakFreeze = result.streakFreeze;
        this.streak = result.streak;
      }
    )
  }

  updatePage() {
    if (this.type == 1) {
      this.service.getUserKepcoinEarns({
        page: this.currentPage
      }).subscribe(
        (result: any) => {
          this.earns = result.data;
          this.total = result.total;
          this.cdr.detectChanges();
        }
      )
    } else {
      this.service.getUserKepcoinSpends({
        page: this.currentPage,
      }).subscribe(
        (result: any) => {
          this.spends = result.data;
          this.total = result.total;
          this.cdr.detectChanges();
        }
      )
    }
  }

  success() {
    this.streakFreeze++;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
