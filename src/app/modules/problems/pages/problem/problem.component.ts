import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ShepherdService } from 'angular-shepherd';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ContentHeader } from 'app/layout/components/content-header/content-header.component';
import { TitleService } from 'app/shared/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Problem } from '../../models/problems.models';
import { ProblemsService } from '../../services/problems.service';
import { Location } from '@angular/common';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { ApiService } from '../../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 1500 }),
    fadeInRightOnEnterAnimation({ duration: 1000 }),
  ],
})
export class ProblemComponent implements OnInit, OnDestroy, AfterViewInit {
  public contentHeader: ContentHeader;

  public problem: Problem;

  public currentUser: User = this.authService.currentUserValue;

  public activeId = 1;
  public studyPlanId: number;
  public contestId: number;

  public submitEvent = new Subject();

  public checkInput = '';
  public editorOptions = {
    theme: 'vs-light',
    language: 'python',
  };


  private _unsubscribeAll = new Subject();

  constructor(
    public route: ActivatedRoute,
    public authService: AuthenticationService,
    public service: ProblemsService,
    public titleService: TitleService,
    public translateService: TranslateService,
    private shepherdService: ShepherdService,
    public router: Router,
    public location: Location,
    public coreConfigService: CoreConfigService,
    public api: ApiService,
    public toastr: ToastrService,
  ) {
    if (this.router.url.endsWith('hacks')) {
      this.activeId = 3;
    } else if (this.router.url.endsWith('attempts')) {
      this.activeId = 2;
    }
  }

  ngOnInit(): void {
    this.coreConfigService.getConfig().subscribe((config: any) => {
      if (config.layout.skin === 'dark') {
        this.editorOptions = {
          theme: 'vs-dark',
          language: 'python',
        };
      } else {
        this.editorOptions = {
          theme: 'vs-light',
          language: 'python',
        };
      }
    });

    this.route.queryParams.subscribe(
      (params: any) => {
        if (params['study-plan']) {
          this.studyPlanId = params['study-plan'];
        }
        if (params['contest']) {
          this.contestId = params['contest'];
        }
      }
    );

    this.route.data.subscribe(({ problem }) => {
      this.problem = problem;
      this.titleService.updateTitle(this.route, {
        problemTitle: this.problem.title,
        problemId: this.problem.id
      });
      this.checkInput = this.problem.checkInputSource;
      this.loadContentHeader();
    });

    this.authService.currentUser
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: any) => {
        if (user !== this.currentUser) {
          this.service.getProblem(this.problem.id).subscribe((problem: any) => this.problem = problem);
        }
        this.currentUser = user;
      });
  }

  ngAfterViewInit() {
    const backBtnClass = 'btn btn-sm btn-outline-primary';
    const nextBtnClass = 'btn btn-sm btn-primary btn-next';

    const translations = this.translateService.translations[this.translateService.currentLang];

    const tourSteps = [
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

  loadContentHeader() {
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
            name: this.problem.id + '',
            isLink: false,
          },
        ]
      }
    };
  }

  startTour() {
    this.shepherdService.start();
  }

  activeIdChange(index: number) {
    if (index === 1) {
      this.location.go(`/practice/problems/problem/${this.problem.id}`);
    } else if (index === 2) {
      this.location.go(`/practice/problems/problem/${this.problem.id}/attempts`);
    } else if (index === 3) {
      this.location.go(`/practice/problems/problem/${this.problem.id}/hacks`);
    }
  }

  saveCheckInput() {
    this.api.post(`problems/${this.problem.id}/save-check-input`, { source: this.checkInput }).subscribe(
      () => {
        this.toastr.success('Success');
      }, () => {
        this.toastr.error('Error');
      }
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
