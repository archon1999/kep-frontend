import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@core/data-access/api.service';
import { AuthService } from '@auth';
import { KepcoinService } from './kepcoin.service';
import { CoreCommonModule } from '@core/common.module';
import { RouterModule } from '@angular/router';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';
import { CoreDirectivesModule } from '@shared/directives/directives.module';
import { KepcoinSpendSwalModule } from '@shared/components/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { EarnsListComponent } from './components/earns-list/earns-list.component';
import { SpendsListComponent } from './components/spends-list/spends-list.component';
import { HowToEarnKepcoinComponent } from './components/how-to-earn-kepcoin/how-to-earn-kepcoin.component';
import { HowToSpendKepcoinComponent } from './components/how-to-spend-kepcoin/how-to-spend-kepcoin.component';
import { YouHaveCardComponent } from './components/you-have-card/you-have-card.component';
import { BaseComponent } from "@core/common";

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
    EarnsListComponent,
    SpendsListComponent,
    HowToEarnKepcoinComponent,
    HowToSpendKepcoinComponent,
    YouHaveCardComponent,
  ],
})
export class KepcoinComponent extends BaseComponent implements OnInit, OnDestroy {

  public spends = [];
  public earns = [];

  public currentPage = 1;
  public total = 0;
  public view: 'earns' | 'spends' = 'earns';

  public streakFreeze = 0;
  public streak = 0;

  constructor(
    public api: ApiService,
    public authService: AuthService,
    public service: KepcoinService,
  ) {
    super();
    this.loadData();
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
    if (this.view === 'earns') {
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
}
