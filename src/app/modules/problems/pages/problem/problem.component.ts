import { Component, OnInit } from '@angular/core';
import { Params, RouterModule } from '@angular/router';
import { AuthUser } from '@auth';
import { Subject } from 'rxjs';
import { Problem } from '@problems/models/problems.models';
import { CoreCommonModule } from '@core/common.module';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { ProblemSidebarComponent } from '@problems/pages/problem/problem-sidebar/problem-sidebar.component';
import { TourModule } from '@shared/third-part-modules/tour/tour.module';
import { BasePageComponent } from '@core/common/classes/base-page.component';
import { SidebarService } from '@shared/ui/sidebar/sidebar.service';
import { ContentHeaderModule } from '@shared/ui/components/content-header/content-header.module';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContentHeaderModule,
    RouterModule,
    CodeEditorModule,
    ProblemSidebarComponent,
    TourModule,
    KepCardComponent,
  ]
})
export class ProblemComponent extends BasePageComponent implements OnInit {
  public problem: Problem;

  public studyPlanId: number;
  public contestId: number;

  private readonly submitEventSubject = new Subject<void>();
  public readonly submitEvent$ = this.submitEventSubject.asObservable();

  private pendingTab: 'attempts' | 'hacks' | null = null;

  constructor(
    protected coreSidebarService: SidebarService,
  ) {
    super();
  }

  ngOnInit(): void {
    const resolvedProblem = this.route.snapshot.data['problem'];
    if (resolvedProblem) {
      this.setProblem(resolvedProblem);
    }

    this.route.data.subscribe(({ problem }) => {
      this.setProblem(problem);
    });
  }

  afterFirstChangeQueryParams(params: Params) {
    if (params['study-plan']) {
      this.studyPlanId = params['study-plan'];
    }
    if (params['contest']) {
      this.contestId = params['contest'];
    }

    const tab = params['tab'];
    if (tab === 'attempts' || tab === 'hacks') {
      this.pendingTab = tab;
      this.applyPendingTab();
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
    this.submitEventSubject.next();
    this.navigateToAttempts();
  }

  navigateToAttempts(options?: { replaceUrl?: boolean }) {
    this.router.navigate(['attempts'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
      replaceUrl: options?.replaceUrl,
    });
  }

  navigateToHacks(options?: { replaceUrl?: boolean }) {
    if (!this.problem?.hasCheckInput) {
      return;
    }

    this.router.navigate(['hacks'], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
      replaceUrl: options?.replaceUrl,
    });
  }

  private navigateToProblemRoot(options?: { replaceUrl?: boolean }) {
    this.router.navigate([''], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
      replaceUrl: options?.replaceUrl,
    });
  }

  private applyPendingTab() {
    if (!this.pendingTab) {
      return;
    }

    if (!this.problem) {
      return;
    }

    if (this.pendingTab === 'hacks' && !this.problem?.hasCheckInput) {
      this.pendingTab = null;
      return;
    }

    if (this.pendingTab === 'attempts') {
      this.navigateToAttempts({ replaceUrl: true });
    } else if (this.pendingTab === 'hacks') {
      this.navigateToHacks({ replaceUrl: true });
    }

    this.pendingTab = null;
  }

  private ensureValidChildRoute() {
    const childPath = this.route.firstChild?.snapshot.routeConfig?.path;
    if (childPath === 'hacks' && !this.problem?.hasCheckInput) {
      this.navigateToProblemRoot({ replaceUrl: true });
    }
  }

  private setProblem(problem: Problem) {
    this.problem = problem;
    this.titleService.updateTitle(this.route, {
      problemTitle: this.problem.title,
      problemId: this.problem.id
    });
    this.loadContentHeader();
    this.applyPendingTab();
    this.ensureValidChildRoute();
  }
}
