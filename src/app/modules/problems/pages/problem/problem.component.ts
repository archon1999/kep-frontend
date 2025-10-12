import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Params } from '@angular/router';
import { AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { Problem } from '@problems/models/problems.models';
import { ProblemsApiService } from '../../services/problems-api.service';
import { ApiService } from '@core/data-access/api.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
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
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

import { ProblemSubmitCardComponent } from '@problems/components/problem-submit-card/problem-submit-card.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

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

    ProblemSubmitCardComponent,
    NgbTooltipModule,
    ResourceByIdPipe,
  ]
})
export class ProblemComponent extends BasePageComponent implements OnInit {
  public problem: Problem;

  public activeId = 1;
  public studyPlanId: number;
  public contestId: number;

  public submitEvent = new Subject();
  public checkInput = '';
  private isSyncingActiveTab = false;
  constructor(
    public service: ProblemsApiService,
    public api: ApiService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateActiveTabFromUrl(this.router.url, this._queryParams?.tab);

    this.router.events
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        this.updateActiveTabFromUrl(event.urlAfterRedirects, this._queryParams?.tab);
      });

    this.route.data.subscribe(({ problem }) => {
      this.problem = problem;
      this.titleService.updateTitle(this.route, {
        problemTitle: this.problem.title,
        problemId: this.problem.id
      });
      this.checkInput = this.problem.checkInputSource;
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
    if (this.isSyncingActiveTab) {
      return;
    }

    this.navigateToTab(index);
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

  onSubmit() {
    this.navigateToTab(2);
    this.submitEvent.next(null);
  }

  goToPreviousProblem() {
    if (!this.problem) {
      return;
    }

    this.service.getProblemPrevious(this.problem.id)
      .pipe(take(1))
      .subscribe(({ id }) => this.navigateToProblem(id));
  }

  goToNextProblem() {
    if (!this.problem) {
      return;
    }

    this.service.getProblemNext(this.problem.id)
      .pipe(take(1))
      .subscribe(({ id }) => this.navigateToProblem(id));
  }

  private navigateToProblem(problemId?: number) {
    if (!problemId || this.problem?.id === problemId) {
      return;
    }
    this.router.navigate(['/practice/problems/problem', problemId], {
      queryParams: this.route.snapshot.queryParams,
    });
  }

  private updateActiveTabFromUrl(url: string, tabParam?: string) {
    let nextActiveId = 1;

    if (url.includes('/hacks')) {
      nextActiveId = 3;
    } else if (url.includes('/attempts')) {
      nextActiveId = 2;
    } else if (tabParam === 'hacks') {
      nextActiveId = 3;
    } else if (tabParam === 'attempts') {
      nextActiveId = 2;
    }

    if (this.activeId === nextActiveId) {
      return;
    }

    this.isSyncingActiveTab = true;
    this.activeId = nextActiveId;
    setTimeout(() => (this.isSyncingActiveTab = false));
  }

  navigateToTab(index: number) {
    if (!this.problem) {
      return;
    }

    const commands: Array<any> = ['/practice/problems/problem', this.problem.id];
    if (index === 2) {
      commands.push('attempts');
    } else if (index === 3) {
      commands.push('hacks');
    }

    const queryParams = { ...this.route.snapshot.queryParams };
    delete queryParams['tab'];

    this.router.navigate(commands, { queryParams });
  }
}
