import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { Problem } from '@problems/models/problems.models';
import { AttemptLangs } from '@problems/constants';
import { ProblemsApiService } from '../../services/problems-api.service';
import { ApiService } from '@core/data-access/api.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemDescriptionComponent } from '@problems/pages/problem/problem-description/problem-description.component';
import { ProblemAttemptsComponent } from '@problems/pages/problem/problem-attempts/problem-attempts.component';
import { ProblemHacksComponent } from '@problems/pages/problem/problem-hacks/problem-hacks.component';
import { ProblemSidebarComponent } from '@problems/pages/problem/problem-sidebar/problem-sidebar.component';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { ProblemSubmitCardComponent } from '@problems/components/problem-submit-card/problem-submit-card.component';
import { take } from 'rxjs/operators';
import { ResourceByIdPipe } from '@shared/pipes/resource-by-id.pipe';
import { ProblemWorkspaceComponent } from './problem-workspace/problem-workspace.component';
import { MonacoEditorComponent } from '@shared/third-part-modules/monaco-editor/monaco-editor.component';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbNavModule,
    NgbTooltipModule,
    ProblemDescriptionComponent,
    ProblemAttemptsComponent,
    ProblemHacksComponent,
    ProblemSidebarComponent,
    ProblemSubmitCardComponent,
    ProblemWorkspaceComponent,
    MonacoEditorComponent,
    ResourceByIdPipe,
  ]
})
export class ProblemComponent extends BasePageComponent implements OnInit {
  public problem: Problem;
  protected readonly AttemptLangs = AttemptLangs;

  public activeId = 1;
  public studyPlanId: number;
  public contestId: number;

  public submitEvent = new Subject();
  public checkInput = '';
  constructor(
    public service: ProblemsApiService,
    public api: ApiService,
  ) {
    super();
  }

  ngOnInit(): void {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (currentPath === 'attempts' || this._queryParams.tab === 'attempts') {
      this.activeId = 2;
    } else if (currentPath === 'hacks' || this._queryParams.tab === 'hacks') {
      this.activeId = 3;
    }

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

  onSubmit() {
    this.activeId = 2;
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
}
