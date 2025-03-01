import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation, fadeInRightOnEnterAnimation } from 'angular-animations';
import { ApiService } from 'app/shared/services/api.service';
import { User } from '@auth';
import { ContentHeader } from '@core/components/content-header/content-header.component';
import { Attempt } from '@problems/models/attempts.models';
import { AvailableLanguage, Problem } from '@problems/models/problems.models';
import { TitleService } from 'app/shared/services/title.service';
import { takeUntil } from 'rxjs/operators';
import { ContestsService } from '@contests/contests.service';
import { LanguageService } from 'app/modules/problems/services/language.service';
import { findAvailableLang } from 'app/modules/problems/utils';
import { AttemptLangs } from 'app/modules/problems/constants';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { BaseComponent } from '@app/common/classes/base.component';
import { sortContestProblems } from '@contests/utils/sort-contest-problems';
import { paramsMapper } from '@shared/utils';
import { PageResult } from '@app/common/classes/page-result';
import { CoreCommonModule } from '@core/common.module';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContestCardModule } from '@contests/components/contest-card/contest-card.module';
import { ProblemInfoCardComponent } from '@problems/components/problem-info-card/problem-info-card.component';
import { ProblemBodyComponent } from '@problems/components/problem-body/problem-body.component';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { KepPaginationComponent } from '@shared/components/kep-pagination/kep-pagination.component';
import { ContentHeaderModule } from '@core/components/content-header/content-header.module';
import { ContestTabComponent } from '@contests/pages/contest/contest-tab/contest-tab.component';
import { ContestStatus } from '@contests/constants/contest-status';
import { ContestProblem } from '@contests/models/contest-problem';
import { ContestProblemInfo } from '@contests/models/contest-problem-info';
import { Contest } from '@contests/models/contest';
import { Contestant } from '@contests/models/contestant';
import { getResourceById, Resources } from '@app/resources';
import { ContestClassesPipe } from '@contests/pipes/contest-classes.pipe';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { ProblemInfoHtmlPipe } from '@contests/pages/contest/contest-problem/problem-info-html.pipe';

const CONTESTANT_RESULTS_VISIBLE_KEY = 'contestant-results-visible';

@Component({
  selector: 'app-contest-problem',
  templateUrl: './contest-problem.component.html',
  styleUrls: ['./contest-problem.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 1000 }),
    fadeInRightOnEnterAnimation({ duration: 1000, translate: '40px' })
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    ContestantViewModule,
    CodeEditorModule,
    NgbTooltipModule,
    ContestCardModule,
    ProblemInfoCardComponent,
    ProblemBodyComponent,
    AttemptsTableModule,
    KepPaginationComponent,
    ContentHeaderModule,
    ContestTabComponent,
    ContestClassesPipe,
    KepCardComponent,
    ProblemInfoHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestProblemComponent extends BaseComponent implements OnInit, OnDestroy {

  public contentHeader: ContentHeader;

  public contest: Contest;
  public contestProblems: Array<ContestProblem> = [];

  public problemSymbol: string;
  public contestProblem: ContestProblem;
  public problem: Problem;

  public attempts: Array<Attempt> = [];

  public selectedAvailableLang: AvailableLanguage;
  public selectedLang: string;

  public totalAttemptsCount = 0;
  public currentPage = 1;

  public contestant: Contestant | null;

  private _intervalId: any;

  constructor(
    public api: ApiService,
    public titleService: TitleService,
    public service: ContestsService,
    public coreSidebarService: CoreSidebarService,
    public langService: LanguageService,
    public cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ contest, contestProblem }) => {
      if (this.contestProblems.length) {
        this.reloadProblems();
      }
      this.contest = Contest.fromJSON(contest);
      this.contestProblem = contestProblem;
      this.problem = contestProblem.problem;
      this.cdr.markForCheck();
      // setTimeout(() => this.langService.setLanguage(this.selectedLang as any));
      this.titleService.updateTitle(this.route, {
        contestTitle: contest.title,
        problemSymbol: contestProblem.symbol,
        problemTitle: this.problem.title,
      });

      this.updateContentHeader();

      this.langService.getLanguage().pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (lang: AttemptLangs) => {
          this.selectedAvailableLang = findAvailableLang(this.problem.availableLanguages, lang);
          this.selectedLang = lang;
          if (!this.selectedAvailableLang) {
            setTimeout(() => {
              this.langService.setLanguage(this.problem.availableLanguages[0].lang);
              this.cdr.markForCheck();
            }, 1000);
          }
        }
      );

      setTimeout(() => this.reloadAttempts());
    });
  }

  afterChangeCurrentUser(currentUser: User) {
    if (this.currentUser) {
      this.service.getMe(this.contest?.id).subscribe(
        (contestant: Contestant | null) => {
          if (contestant) {
            this.contestant = Contestant.fromJSON(contestant);
            if (this.contest.status === ContestStatus.ALREADY) {
              this._intervalId = setInterval(() => {
                this.updateContestant();
                this.cdr.markForCheck();
              }, 60000);
            }
          }
        }
      );
    }
    this.reloadProblems();
  }

  updateContestant() {
    this.service.getMe(this.contest?.id).subscribe(
      (contestant: Contestant | null) => {
        this.contestant = Contestant.fromJSON(contestant);
        this.cdr.markForCheck();
      }
    );
  }

  updateContentHeader() {
    this.contentHeader = {
      headerTitle: this.problem.title,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'CONTESTS.CONTESTS',
            isLink: true,
            link: '../../../../'
          },
          {
            name: this.contest?.id + '',
            isLink: true,
            link: '../../'
          },
          {
            name: 'CONTESTS.PROBLEMS',
            isLink: true,
            link: '../../problems'
          },
          {
            name: this.contestProblem.symbol,
            isLink: true,
            link: '.'
          },
        ]
      }
    };
  }

  reloadProblems() {
    this.api.get(`contests/${ this.contest?.id }/problems`).subscribe((result: any) => {
      this.contestProblems = result;
      this.sortProblems();
      this.cdr.markForCheck();
    });
  }

  sortProblems() {
    this.contestProblems = sortContestProblems(this.contestProblems);
  }

  getProblemInfoBySymbol(
    problemsInfo: Array<ContestProblemInfo>,
    problemSymbol: string
  ): ContestProblemInfo | undefined {
    return problemsInfo.find(problemInfo => problemInfo.problemSymbol === problemSymbol);
  }

  reloadAttempts() {
    const params = {
      contestId: this.contest?.id,
      contestProblem: this.contestProblem.symbol,
      username: this.currentUser?.username
    };
    this.api.get('attempts', paramsMapper(params)).subscribe(
      (result: PageResult<Attempt>) => {
        this.attempts = result.data;
        this.totalAttemptsCount = result.total;
        this.cdr.markForCheck();
      }
    );
  }

  codeEditorSidebarToggle() {
    if (this.contest?.userInfo?.isRegistered === false) {
      this.router.navigateByUrl(getResourceById(Resources.Contest, this.contest.id));
      return;
    }
    this.coreSidebarService.getSidebarRegistry('codeEditorSidebar').toggleOpen();
  }


  onAttemptChecked() {
    this.reloadProblems();
    this.updateContestant();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
  }
}
