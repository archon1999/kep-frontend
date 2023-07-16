import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'app/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-navbar-kepcoin',
  templateUrl: './navbar-kepcoin.component.html',
  styleUrls: ['./navbar-kepcoin.component.scss']
})
export class NavbarKepcoinComponent implements OnInit, OnDestroy {

  public currentUser: User;
  private _unsubscribeAll = new Subject();

  public earn = 0;
  public spend = 0;

  constructor(
    public authService: AuthenticationService,
    public service: NavbarService,
  ) { }

  loadData(){
    this.service.getTodayKepcoin().subscribe((result: any) => {
      this.earn = result.earn;
      this.spend = result.spend;
    })    
  }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => this.currentUser = user)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
