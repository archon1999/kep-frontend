import { Component, inject } from '@angular/core';
import { Attempt } from '@problems/models/attempts.models';
import { interval, Observable } from 'rxjs';
import { Duel, DuelProblem, DuelResults } from '@duels/domain';
import { DuelsApiService } from '@duels/data-access';
import { KepCardComponent } from '@shared/components/kep-card/kep-card.component';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ContestantViewModule } from '@contests/components/contestant-view/contestant-view.module';
import { ProblemBodyComponent } from '@problems/components/problem-body/problem-body.component';
import { CodeEditorModule } from '@shared/components/code-editor/code-editor.module';
import { AttemptsTableModule } from '@problems/components/attempts-table/attempts-table.module';
import { DuelCountdownComponent } from '@duels/ui/components/duel-countdown/duel-countdown.component';
import { ProblemInfoCardComponent } from '@problems/components/problem-info-card/problem-info-card.component';
import { ProblemListCardComponent } from '@duels/ui/components/problem-list-card/problem-list-card.component';
import { BaseLoadComponent } from '@core/common';
import { takeUntil } from 'rxjs/operators';
import { PageResult } from '@core/common/classes/page-result';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProblemSubmitCardComponent } from '@problems/components/problem-submit-card/problem-submit-card.component';

@Component({
  templateUrl: './duel.component.html',
  styleUrls: ['./duel.component.scss'],
  standalone: true,
  imports: [
    KepCardComponent,
    CoreCommonModule,
    NgbTooltip,
    ContestantViewModule,
    ProblemBodyComponent,
    CodeEditorModule,
    AttemptsTableModule,
    DuelCountdownComponent,
    ProblemInfoCardComponent,
    ProblemListCardComponent,
    NgxSkeletonLoaderModule,
    ProblemSubmitCardComponent
  ]
})
export class DuelComponent extends BaseLoadComponent<Duel> {
  public duelProblem: DuelProblem | null = null;
  public attempts: Attempt[] = [];

  protected readonly duelsApi = inject(DuelsApiService);

  get duel() {
    return this.data;
  }

  getData(): Observable<Duel> {
    return this.duelsApi.getDuel(this.route.snapshot.params.id);
  }

  override ngOnInit() {
    super.ngOnInit();

    interval(5000).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => {
        if (this.duel?.status === 0) {
          this.loadData();
          this.reloadResults();
        }
      }
    );
  }

  afterLoadData(duel: Duel) {
    this.titleService.updateTitle(this.route, {
      playerFirstUsername: duel.playerFirst.username,
      playerSecondUsername: duel.playerSecond?.username || '',
    });

    if (duel.problems?.length && !this.duelProblem) {
      this.changeProblem(duel.problems[0]);
    }
    if (this.duelProblem) {
      this.reloadAttempts();
    }
  }

  changeProblem(duelProblem: DuelProblem) {
    this.duelProblem = duelProblem;
    if (this.currentUser && this.duel?.isPlayer) {
      this.reloadAttempts();
    }
  }

  reloadAttempts() {
    if (!this.duel || !this.duelProblem) {
      return;
    }

    this.duelsApi.getProblemAttempts(this.duel.id, this.duelProblem.symbol).subscribe(
      (pageResult: PageResult<Attempt>) => {
        this.attempts = pageResult.data;
      }
    );
  }

  reloadResults() {
    if (!this.duel?.problems?.length) {
      return;
    }

    this.duelsApi.getDuelResults(this.duel.id).subscribe((results: DuelResults) => {
      let playerFirstBalls = 0;
      let playerSecondBalls = 0;

      this.duel?.problems?.forEach((problem, index) => {
        problem.playerFirstBall = results.playerFirst?.[index] ?? 0;
        problem.playerSecondBall = results.playerSecond?.[index] ?? 0;
        playerFirstBalls += problem.playerFirstBall;
        playerSecondBalls += problem.playerSecondBall;
      });

      if (this.duel?.playerFirst) {
        this.duel.playerFirst.balls = playerFirstBalls;
      }
      if (this.duel?.playerSecond) {
        this.duel.playerSecond.balls = playerSecondBalls;
      }
    });
  }
}
