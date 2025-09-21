import { Component, OnInit, ViewChild } from '@angular/core';
import { Params } from '@angular/router';
import { AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { Problem } from '@problems/models/problems.models';
import { ProblemsApiService } from '../../services/problems-api.service';
import { ApiService } from '@core/data-access/api.service';
import { CoreCommonModule } from '@core/common.module';
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
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { SidebarService } from '@shared/ui/sidebar/sidebar.service';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { AttemptLangs } from '@problems/constants';
import { LanguageService } from '@problems/services/language.service';
import { findAvailableLang } from '@problems/utils';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { AttemptLanguageComponent } from '@shared/components/attempt-language/attempt-language.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CodeEditorModalComponent } from '@shared/components/code-editor/code-editor-modal/code-editor-modal.component';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
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
    KepCardComponent,
    FormsModule,
    AttemptLanguageComponent,
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

  public selectedLang: AttemptLangs;

  public isNextLoading = false;
  public isPrevLoading = false;

  @ViewChild(CodeEditorModalComponent)
  private codeEditorModal: CodeEditorModalComponent;

  constructor(
    public service: ProblemsApiService,
    public api: ApiService,
    protected coreSidebarService: SidebarService,
    protected langService: LanguageService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this._queryParams.tab === 'hacks') {
      this.activeId = 3;
    } else if (this._queryParams.tab === 'attempts') {
      this.activeId = 2;
    }

    this.langService.getLanguage()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((lang: AttemptLangs) => {
        this.selectedLang = lang;
        this.updateSelectedAvailableLang();
      });

    this.route.data.subscribe(({ problem }) => {
      this.problem = problem;
      this.titleService.updateTitle(this.route, {
        problemTitle: this.problem.title,
        problemId: this.problem.id
      });
      this.checkInput = this.problem.checkInputSource;
      this.updateSelectedAvailableLang(true);
      this.loadContentHeader();
    });
  }

  afterFirstChangeQueryParams(params: Params) {
    if (params['study-plan']) {
      this.studyPlanId = params['study-plan'];
    }
    if (params['contest']) {
      this.contestId = params['contest'];
    }
  }

  beforeChangeCurrentUser(currentUser: AuthUser) {}

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
        this.toastr.success('Success');
      }, () => {
        this.toastr.error('Error');
      }
    );
  }

  langChange(lang: AttemptLangs) {
    this.langService.setLanguage(lang);
  }

  codeEditorSidebarToggle() {
    this.coreSidebarService.getSidebarRegistry('codeEditorSidebar').toggleOpen();
  }

  runCode() {
    if (!this.isAuthenticated) {
      return;
    }
    this.openEditorSidebar(() => this.codeEditorModal?.run());
  }

  submitCode() {
    if (!this.isAuthenticated) {
      return;
    }
    this.openEditorSidebar(() => this.codeEditorModal?.submit());
  }

  goToPrevProblem() {
    this.navigateToProblem('prev');
  }

  goToNextProblem() {
    this.navigateToProblem('next');
  }

  onSubmit() {
    this.activeId = 2;
    this.submitEvent.next(null);
  }

  private openEditorSidebar(callback?: () => void) {
    if (!this.codeEditorModal) {
      return;
    }

    const execute = () => {
      if (callback) {
        callback();
      }
    };

    if (!this.codeEditorModal.sidebarIsOpened) {
      this.codeEditorModal.openSidebar();
      setTimeout(() => execute());
    } else {
      execute();
    }
  }

  private navigateToProblem(direction: 'next' | 'prev') {
    if (!this.problem) {
      return;
    }

    const loadingKey = direction === 'next' ? 'isNextLoading' : 'isPrevLoading';
    if (this[loadingKey]) {
      return;
    }

    this[loadingKey] = true;
    const request = direction === 'next'
      ? this.service.getProblemNext(this.problem.id)
      : this.service.getProblemPrev(this.problem.id);

    request
      .pipe(finalize(() => this[loadingKey] = false))
      .subscribe((result) => {
        if (result?.id) {
          this.router.navigate([
            '/practice',
            'problems',
            'problem',
            result.id
          ], {
            queryParams: this.route.snapshot.queryParams,
          });
        }
      });
  }

  private updateSelectedAvailableLang(resetIfMissing = false) {
    if (!this.problem?.availableLanguages?.length) {
      return;
    }

    const selected = findAvailableLang(this.problem.availableLanguages, this.selectedLang);
    if (selected) {
      return;
    }

    if (!resetIfMissing) {
      return;
    }

    const fallback = this.problem.availableLanguages[0];
    if (fallback?.lang) {
      this.langService.setLanguage(fallback.lang as AttemptLangs);
    }
  }
}
