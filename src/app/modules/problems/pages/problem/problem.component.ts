import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
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

import { ProblemSubmitCardComponent } from '@problems/components/problem-submit-card/problem-submit-card.component';
import { take } from 'rxjs/operators';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
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

  private readonly _tabSegments: Record<number, string> = {
    1: '',
    2: 'attempts',
    3: 'hacks',
  };

  constructor(
    public service: ProblemsApiService,
    public api: ApiService,
  ) {
    super();
  }

  ngOnInit(): void {
    const initialTab = this.getTabId(this._queryParams?.tab as string ?? this.route.snapshot.data['defaultTab']);
    this.activeId = initialTab;

    this.route.data.subscribe(({ problem, defaultTab }) => {
      this.problem = problem;
      this.titleService.updateTitle(this.route, {
        problemTitle: this.problem.title,
        problemId: this.problem.id
      });
      this.checkInput = this.problem.checkInputSource;
      this.activeId = this.getTabId(this._queryParams?.tab as string ?? defaultTab);
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
    this.activeId = index;
    const segment = this._tabSegments[index];
    if (segment !== undefined) {
      this.navigateToTab(segment);
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

  onSubmit() {
    this.activeId = 2;
    this.navigateToTab(this._tabSegments[2]);
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
    const segment = this._tabSegments[this.activeId];
    const commands = ['/practice/problems/problem', problemId];
    if (segment) {
      commands.push(segment);
    }
    const queryParams = { ...this.route.snapshot.queryParams };
    delete queryParams['tab'];
    this.router.navigate(commands, {
      queryParams,
    });
  }

  navigateToTab(segment?: string) {
    if (!this.problem) {
      return;
    }
    const commands = ['/practice/problems/problem', this.problem.id];
    if (segment) {
      commands.push(segment);
    }
    const queryParams = { ...this.route.snapshot.queryParams };
    delete queryParams['tab'];
    this.router.navigate(commands, {
      queryParams,
    });
  }

  private getTabId(tabKey?: string | null): number {
    if (!tabKey) {
      return 1;
    }
    const normalized = tabKey.toLowerCase();
    if (normalized === 'attempts') {
      return 2;
    }
    if (normalized === 'hacks') {
      return 3;
    }
    return 1;
  }
}
