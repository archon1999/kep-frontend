import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService, User } from '@auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss'],
  standalone: false,
})
export class LikeButtonComponent implements OnInit, OnDestroy {

  @Input() likes: number = 0;
  @Input() submitUrl: string;

  public currentUser: User;
  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
    public api: ApiService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: any) => {
        this.currentUser = user;
      }
    )
  }

  click() {
    this.api.post(this.submitUrl).subscribe(
      (likes: any) => {
        this.likes = likes;
      }
    )
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
