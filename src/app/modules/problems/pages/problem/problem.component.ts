import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Params } from '@angular/router';
import { AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { Problem } from '@problems/models/problems.models';
import { ProblemsApiService } from '../../services/problems-api.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { ProblemSidebarComponent } from '@problems/pages/problem/problem-sidebar/problem-sidebar.component';
import { TourModule } from '@shared/third-part-modules/tour/tour.module';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { SidebarService } from '@shared/ui/sidebar/sidebar.service';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

import { ProblemSubmitCardComponent } from '@problems/components/problem-submit-card/problem-submit-card.component';
import { take } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    CodeEditorModule,
    ProblemSidebarComponent,
    TourModule,
    NgSelectModule,
    KepCardComponent,

    ProblemSubmitCardComponent,
    NgbTooltipModule,
    RouterModule,
  ]
})
export class ProblemComponent extends BasePageComponent implements OnInit {
  public problem: Problem;

  public studyPlanId: number;
  public contestId: number;

  public submitEvent = new Subject<void>();
  public readonly submitEvent$ = this.submitEvent.asObservable();
  constructor(
    public service: ProblemsApiService,
    protected coreSidebarService: SidebarService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ problem }) => {
      this.problem = problem;
      this.titleService.updateTitle(this.route, {
        problemTitle: this.problem.title,
        problemId: this.problem.id
      });
      this.loadContentHeader();
      this.handleInitialTab();
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

  codeEditorSidebarToggle() {
    this.coreSidebarService.getSidebarRegistry('codeEditorSidebar').toggleOpen();
  }

  onSubmit() {
    this.submitEvent.next();
    this.navigateToChild('attempts');
  }

  onHackSubmitted() {
    this.navigateToChild('hacks');
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

  private handleInitialTab() {
    if (this._queryParams?.tab === 'hacks') {
      this.navigateToChild('hacks', { replaceUrl: true });
    } else if (this._queryParams?.tab === 'attempts') {
      this.navigateToChild('attempts', { replaceUrl: true });
    } else if (this._queryParams?.tab) {
      this.updateQueryParams({ tab: null });
    }
  }

  private navigateToChild(segment: 'attempts' | 'hacks', extras?: NavigationExtras) {
    if (segment === 'hacks' && !this.problem?.hasCheckInput) {
      return;
    }

    const currentPath = this.route.snapshot.firstChild?.routeConfig?.path;
    if (currentPath !== segment) {
      this.router.navigate([segment], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        ...(extras ?? {}),
      });
    }

    if (this._queryParams?.tab) {
      this.updateQueryParams({ tab: null }, { replaceUrl: true });
    }
  }
}
