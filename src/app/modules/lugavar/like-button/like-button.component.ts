import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'app/api.service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent implements OnInit, OnDestroy {

  @Input() likes: number = 0;
  @Input() submitUrl: string;

  public currentUser: User;
  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthenticationService,
    public api: ApiService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    )
  }

  click(){
    this.api.post(this.submitUrl).subscribe(
      (likes: any) => {
        this.likes = likes;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}