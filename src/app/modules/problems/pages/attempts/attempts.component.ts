import { Component, OnDestroy, OnInit } from '@angular/core';
import { Attempt } from '../../attempts.models';
import { ApiService } from 'app/api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { User } from 'app/auth/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.component.html',
  styleUrls: ['./attempts.component.scss']
})
export class AttemptsComponent implements OnInit, OnDestroy {

  public contentHeader =  {
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

  currentPage: number = 1;
  totalAttemptsCount: number;
  attempts: Array<Attempt> = [];

  myAttempts: boolean = false;
  currentUser: User;

  _unsubscribeAll = new Subject();

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        this.currentUser = user;
        if(user){
          this.myAttempts = true;
        }
        this.loadPage(this.currentPage);
      });    
  }

  loadPage(pageNumber){
    var params = { page: pageNumber };
    if(this.myAttempts && this.currentUser){
      params['username'] = this.currentUser.username;
    }
    this.api.get('attempts', params).subscribe((result: any) => {
      if(this.myAttempts && params['username'] || !this.myAttempts && !params['username']){
        this.attempts = result.data;
        this.totalAttemptsCount = result.total;
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
