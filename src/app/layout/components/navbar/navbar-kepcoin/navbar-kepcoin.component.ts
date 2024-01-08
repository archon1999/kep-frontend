import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarService } from '../navbar.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar-kepcoin',
  templateUrl: './navbar-kepcoin.component.html',
  styleUrls: ['./navbar-kepcoin.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbPopoverModule,
  ]
})
export class NavbarKepcoinComponent implements OnInit, OnDestroy {

  public currentUser: User;
  public earn = 0;
  public spend = 0;
  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
    public service: NavbarService,
  ) { }

  loadData() {
    this.service.getTodayKepcoin().subscribe((result: any) => {
      this.earn = result.earn;
      this.spend = result.spend;
    });
  }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => this.currentUser = user);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
