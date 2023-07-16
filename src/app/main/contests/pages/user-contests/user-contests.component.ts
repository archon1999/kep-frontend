import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contest } from './user-contests.models';
import { ContestsService } from './user-contests.service';

@Component({
  selector: 'app-user-contests',
  templateUrl: './user-contests.component.html',
  styleUrls: ['./user-contests.component.scss']
})
export class UserContestsComponent implements OnInit {
  public contentHeader: ContentHeader = {
    headerTitle: 'MyContests',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'CONTESTS.CONTESTS',
          isLink: true,
          link: '..'
        },
      ]
    }
  };

  public contests: Array<Contest> = [];

  public currentUser: User;

  private _unsubscribeAll = new Subject();

  constructor(
    public service: ContestsService,
    public authService: AuthenticationService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (user: User) => {
        this.currentUser = user;
        this.service.getContests(1).subscribe(
          (result: any) => {
            this.contests = result.data.map((data: any) => Contest.fromJSON(data));
          }
        )
      }
    )
  }

  success(){
    this.router.navigateByUrl('/competitions/contests/user-contests/create');
  }

}
