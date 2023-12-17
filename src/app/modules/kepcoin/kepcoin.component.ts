import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KepcoinService } from './kepcoin.service';

@Component({
  selector: 'app-kepcoin',
  templateUrl: './kepcoin.component.html',
  styleUrls: ['./kepcoin.component.scss'],
})
export class KepcoinComponent implements OnInit, OnDestroy {

  public spends = [];
  public earns = [];

  public currentPage = 1;
  public total = 0;
  public type = 1;

  public streakFreeze = 0;
  public streak = 0;

  public currentUser: User;

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
        if(user){
          this.loadData();
        }
      })
  }

  loadData(){
    this.updatePage();

    this.service.getStreakFreeze().subscribe(
      (result: any) => {
        this.streakFreeze = result.streakFreeze;
        this.streak = result.streak;
      }
    )
  }

  updatePage(){
    if(this.type == 1){
      this.service.getUserKepcoinEarns(this.currentPage).subscribe(
        (result: any) => {
          this.earns = result.data;
          this.total = result.total;
        }
      )
    } else {
      this.service.getUserKepcoinSpends(this.currentPage).subscribe(
        (result: any) => {
          this.spends = result.data;
          this.total = result.total;
        }
      )
    }
  }

  success(){
    this.streakFreeze++;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
