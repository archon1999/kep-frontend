import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ShepherdService } from 'angular-shepherd';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Problem } from '../../problems.models';
import { ProblemsService } from '../../problems.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 1500 }),
    fadeInRightOnEnterAnimation({ duration: 1000 }),
  ],
})
export class ProblemComponent implements OnInit, OnDestroy {
  public contentHeader: ContentHeader;

  public problem: Problem;

  public currentUser: User = this.authService.currentUserValue;

  public activeId = 1;
  public studyPlanId: number;
  public contestId: number;

  public submitEvent = new Subject();

  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public authService: AuthenticationService,
    public service: ProblemsService,
    public titleService: TitleService,
    public translateService: TranslateService,
    private shepherdService: ShepherdService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params: any) => {
        if(params['study-plan']){
          this.studyPlanId = params['study-plan'];
        }
        if(params['contest']){
          this.contestId = params['contest'];
        }
      }
    )

    this.route.data.subscribe(({ problem }) => {
      this.problem = problem;
      this.titleService.updateTitle(this.route, {
        problemTitle: this.problem.title,
        problemId: this.problem.id
      });
      this.loadContentHeader();
    })

    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        if (user != this.currentUser) {
          this.service.getProblem(this.problem.id).subscribe((problem: any) => this.problem = problem)
        }
        this.currentUser = user;
      });
  }

  ngAfterViewInit() {
    let backBtnClass = 'btn btn-sm btn-outline-primary';
    let nextBtnClass = 'btn btn-sm btn-primary btn-next';
    
    let translations = this.translateService.translations[this.translateService.currentLang];

    let tourSteps = [
      {
        title: translations['ProblemTourSteps'][0].title,
        text: translations['ProblemTourSteps'][0].text,
        attachTo: {
          element: '.tour-step-1',
          on: 'bottom'
        },
        buttons: [
          {
            text: translations['Finish'],
            type: 'cancel',
            classes: backBtnClass
          },
          {
            text: translations['Next'],
            type: 'next',
            classes: nextBtnClass
          }
        ],
        useModalOverlay: true
      },
      {
        title: translations['ProblemTourSteps'][1].title,
        text: translations['ProblemTourSteps'][1].text,
        attachTo: {
          element: '.tour-step-2',
          on: 'top'
        },
        buttons: [
          {
            text: translations['Finish'],
            type: 'cancel',
            classes: backBtnClass
          },
          {
            text: translations['Back'],
            type: 'back',
            classes: backBtnClass
          },
        ]
      },
    ];

    this.shepherdService.defaultStepOptions = {
      cancelIcon: {
        enabled: true
      }
    };
    this.shepherdService.modal = true;
    this.shepherdService.addSteps(tourSteps);
  }

  loadContentHeader(){
    this.contentHeader = {
      headerTitle: this.problem.title,
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Problems',
            isLink: true,
            link: '/practice/problems',
          },
          {
            name: this.problem.id+"",
            isLink: false,
          },
        ]
      }
    };
  }

  startTour(){
    this.shepherdService.start();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
