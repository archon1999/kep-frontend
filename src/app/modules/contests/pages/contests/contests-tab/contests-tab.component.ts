import { Component, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'contests-tab',
  templateUrl: './contests-tab.component.html',
  styleUrls: ['./contests-tab.component.scss']
})
export class ContestsTabComponent implements OnInit {

  public activeId = 1;

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User) => this.currentUser = user
    )
  }

}
