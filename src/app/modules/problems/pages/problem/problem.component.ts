import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { AvailableLanguage, Problem } from '@problems/models/problems.models';
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
import { LanguageService } from '@problems/services/language.service';
import { AttemptLangs } from '@problems/constants';
import { finalize, takeUntil } from 'rxjs/operators';
import { findAvailableLang } from '@problems/utils';
import { AttemptLanguageComponent } from '@shared/components/attempt-language/attempt-language.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

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
  public selectedAvailableLang: AvailableLanguage;
  public isNavigating = false;

  private _languageInitialized = false;

  constructor(
    public service: ProblemsApiService,
    public api: ApiService,
    protected coreSidebarService: SidebarService,
    public langService: LanguageService,
  ) {
    super();
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
      this.initLanguage();
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

  codeEditorSidebarToggle() {
    this.coreSidebarService.getSidebarRegistry('codeEditorSidebar').toggleOpen();
  }

  onSubmit() {
    console.log(4142);
    this.activeId = 2;
    this.submitEvent.next(null);
  }

  langChange(lang: AttemptLangs) {
    this.langService.setLanguage(lang);
  }

  navigateToProblem(direction: 'next' | 'prev') {
    if (!this.problem || this.isNavigating) {
      return;
    }

    this.isNavigating = true;
    const request$ = direction === 'next'
      ? this.service.getNextProblemId(this.problem.id)
      : this.service.getPreviousProblemId(this.problem.id);

    request$
      .pipe(
        takeUntil(this._unsubscribeAll),
        finalize(() => this.isNavigating = false),
      )
      .subscribe(
        (result: { id?: number }) => {
          if (result?.id) {
            this.router.navigate(['../', result.id], {
              relativeTo: this.route,
              queryParamsHandling: 'preserve'
            });
          }
        },
        () => {}
      );
  }

  private initLanguage() {
    if (!this.problem?.availableLanguages?.length) {
      this.selectedAvailableLang = null;
      return;
    }

    if (!this._languageInitialized) {
      this._languageInitialized = true;
      this.langService.getLanguage()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((lang: AttemptLangs) => {
          this.selectedLang = lang;
          this.updateSelectedAvailableLang(lang);
        });
    } else {
      this.updateSelectedAvailableLang(this.langService.getLanguageValue());
    }
  }

  private updateSelectedAvailableLang(lang: AttemptLangs) {
    if (!this.problem?.availableLanguages?.length) {
      this.selectedAvailableLang = null;
      return;
    }

    this.selectedAvailableLang = findAvailableLang(this.problem.availableLanguages, lang);

    if (!this.selectedAvailableLang) {
      this.selectedAvailableLang = this.problem.availableLanguages[0];
      this.langService.setLanguage(this.selectedAvailableLang.lang);
    }
  }
}
