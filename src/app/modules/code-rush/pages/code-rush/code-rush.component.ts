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
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';

@Component({
  templateUrl: './code-rush.component.html',
  styleUrls: ['./code-rush.component.scss']
})
export class CodeRushComponent implements OnInit, OnDestroy {
  public contentHeader: ContentHeader;

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
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ codeRush }) => {
      this.codeRush = codeRush;
      this.codeRush.players[0].score = 4;
      this.codeRush.players[1].score = 2;
      this.codeRush.players[0].problemsInfo = [
        {
          problemSymbol: 'A',
          isSolved: true,
          acceptedTime: '02:20',
        },
        {
          problemSymbol: 'B',
          isSolved: true,
          acceptedTime: '03:13',
        },
        {
          problemSymbol: 'C',
          isSolved: true,
          acceptedTime: '05:56',
        },
        {
          problemSymbol: 'D',
          isSolved: true,
          acceptedTime: '07:04',
        }
      ];
      this.codeRush.players[1].problemsInfo = [
        {
          problemSymbol: 'A',
          isSolved: true,
          acceptedTime: '06:33',
        },
        {
          problemSymbol: 'B',
          isSolved: true,
          acceptedTime: '09:13',
        },
        {
          problemSymbol: 'C',
          isSolved: false,
          acceptedTime: '05:56',
        },
        {
          problemSymbol: 'D',
          isSolved: null,
          acceptedTime: '07:04',
        }
      ];
      this.codeRush.players[2].problemsInfo = [];
      this.codeRush = this.codeRush;
      this.loadContentHeader();
    });
  }

  loadContentHeader() {
    this.contentHeader = {
      headerTitle: this.codeRush.id + '',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Code Rush',
            isLink: false,
          },
          {
            name: this.codeRush.id + '',
            isLink: true,
            link: '.'
          },
        ]
      }
    };
  }

  ngOnDestroy(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }

    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
