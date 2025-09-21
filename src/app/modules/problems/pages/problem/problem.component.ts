import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { User } from '@auth';
import { Subject } from 'rxjs';
import { Problem } from '@problems/models/problems.models';
import { ProblemsApiService } from '../../services/problems-api.service';
import { ApiService } from '@shared/services/api.service';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from '@layout/components/content-header/content-header.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemDescriptionComponent } from '@problems/pages/problem/problem-description/problem-description.component';
import { ProblemAttemptsComponent } from '@problems/pages/problem/problem-attempts/problem-attempts.component';
import { ProblemHacksComponent } from '@problems/pages/problem/problem-hacks/problem-hacks.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { ProblemSidebarComponent } from '@problems/pages/problem/problem-sidebar/problem-sidebar.component';
import { TourModule } from '@shared/third-part-modules/tour/tour.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';
import { BasePageComponent } from '@app/common/classes/base-page.component';
import { LanguageService } from '@problems/services/language.service';
import { AttemptLangs } from '@problems/constants';
import { takeUntil } from 'rxjs/operators';
import { findAvailableLang } from '@problems/utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 1000 }),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    NgbNavModule,
    ProblemDescriptionComponent,
    ProblemAttemptsComponent,
    ProblemHacksComponent,
    MonacoEditorModule,
    CodeEditorModule,
    ProblemSidebarComponent,
    TourModule,
    NgSelectModule,
    MonacoEditorComponent,
    NgbTooltipModule,
  ]
})
export class ProblemComponent extends BasePageComponent implements OnInit {
  public problem: Problem;

  public activeId = 1;
  public studyPlanId: number;
  public contestId: number;

  public submitEvent = new Subject();
  public checkInput = '';

  public previousProblemId: number | null = null;
  public nextProblemId: number | null = null;

  constructor(
    public service: ProblemsApiService,
    public api: ApiService,
    public langService: LanguageService,
  ) {
    super();
    this.coreConfigService.config = {
      layout: {
        footer: {
          hidden: true,
        },
        enableLocalStorage: false
      }
    };
  }

  ngOnInit(): void {
    if (this._queryParams.tab === 'hacks') {
      this.activeId = 3;
    } else if (this._queryParams.tab === 'attempts') {
      this.activeId = 2;
    }

    this.route.data.subscribe(({ problem }) => {
      this.problem = problem;
      this.titleService.updateTitle(this.route, {
        problemTitle: this.problem.title,
        problemId: this.problem.id
      });
      this.checkInput = this.problem.checkInputSource;
      this.loadContentHeader();
      this.loadAdjacentProblems();
      this.ensureLanguageIsAvailable(this.langService.getLanguageValue());
    });

    this.langService.getLanguage().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (lang: AttemptLangs) => {
        this.ensureLanguageIsAvailable(lang);
      }
    );
  }

  afterFirstChangeQueryParams(params: Params) {
    if (params['study-plan']) {
      this.studyPlanId = params['study-plan'];
    }
    if (params['contest']) {
      this.contestId = params['contest'];
    }
  }

  beforeChangeCurrentUser(currentUser: User) {}

  getContentHeader() {
    return this.contentHeader = {
      headerTitle: this.problem.title,
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

  activeIdChange(index: number) {
    if (index === 1) {
      this.updateQueryParams({ tab: null });
    } else if (index === 2) {
      this.updateQueryParams({ tab: 'attempts' });
    } else if (index === 3) {
      this.updateQueryParams({ tab: 'hacks' });
    }
  }

  saveCheckInput() {
    this.api.post(`problems/${ this.problem.id }/save-check-input`, { source: this.checkInput }).subscribe(
      () => {
        this.toastr.success('Success', '', {
          toastClass: 'toast ngx-toastr',
        });
      }, () => {
        this.toastr.error('Error', '', {
          toastClass: 'toast ngx-toastr',
        });
      }
    );
  }

  codeEditorSidebarToggle() {
    this.coreSidebarService.getSidebarRegistry('codeEditorSidebar').toggleOpen();
  }

  loadAdjacentProblems() {
    if (!this.problem?.id) {
      this.previousProblemId = null;
      this.nextProblemId = null;
      return;
    }

    this.previousProblemId = null;
    this.nextProblemId = null;

    this.service.getProblemPrev(this.problem.id).subscribe(
      (result: { id?: number } | null) => {
        this.previousProblemId = result?.id ?? null;
      },
      () => {
        this.previousProblemId = null;
      }
    );

    this.service.getProblemNext(this.problem.id).subscribe(
      (result: { id?: number } | null) => {
        this.nextProblemId = result?.id ?? null;
      },
      () => {
        this.nextProblemId = null;
      }
    );
  }

  navigateToProblem(problemId: number | null) {
    if (!problemId) {
      return;
    }
    this.router.navigate(['/practice', 'problems', 'problem', problemId]);
  }

  private ensureLanguageIsAvailable(lang: AttemptLangs) {
    if (!this.problem?.availableLanguages?.length) {
      return;
    }

    const selectedAvailableLang = findAvailableLang(this.problem.availableLanguages, lang);
    if (!selectedAvailableLang) {
      const fallbackLang = this.problem.availableLanguages[0]?.lang;
      if (fallbackLang && fallbackLang !== lang) {
        this.langService.setLanguage(fallbackLang as AttemptLangs);
      }
    }
  }

}
