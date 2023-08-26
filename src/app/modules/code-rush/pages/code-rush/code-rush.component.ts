import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../auth/models';
import { AuthenticationService } from '../../../../auth/service';
import { Attempt } from '../../../problems/models/attempts.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CodeRush, CodeRushProblem } from '../../code-rush.models';
import { CodeRushApiService } from '../../services/code-rush-api.service';
import { TitleService } from '../../../../shared/services/title.service';

@Component({
  templateUrl: './code-rush.component.html',
  styleUrls: ['./code-rush.component.scss']
})
export class CodeRushComponent implements OnInit, OnDestroy {

  public codeRush: CodeRush;

  public codeRushProblem: CodeRushProblem;
  public attempts: Array<Attempt> = [];
  public availableLang: any;
  public selectedLang: string;

  public currentUser: User;

  private _intervalId: any;
  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public authService: AuthenticationService,
    public service: CodeRushApiService,
    public titleService: TitleService,
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ codeRush }) => {
    });
  }

  ngOnDestroy(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }

    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
